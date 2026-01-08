import { createWebsocketStream } from "@/server/actions/lib";
import { db, kv } from "@/server/db/db";
import { roles } from "@/server/db/schema";
import { getUserFromEmail } from "@/server/lib";
import { after, NextRequest, NextResponse } from "next/server";

interface ParamsType {
    params: Promise<{
        code: string;
    }>;
}

export async function GET(request: NextRequest, { params }: ParamsType) {
    const code = decodeURIComponent((await params).code);
    const [email, projectId] = String(await kv.get(`invite:${code}`)).split(
        ":"
    );

    const user = await getUserFromEmail(email);

    if (!user)
        return NextResponse.json({ message: "Invalid code" }, { status: 401 });

    await Promise.all([
        db.insert(roles).values({
            userId: user.id,
            projectId: Number(projectId),
        }),
        kv.del(`invite:${code}`),
    ]);

    after(async () => {
        const freshUser = await getUserFromEmail(email);
        const stream = await createWebsocketStream();

        freshUser.roles
            .find((role) => role.projectId === Number(projectId))
            ?.project.roles.forEach((role) => {
                stream.send(
                    String(role.userId),
                    "project-member-added",
                    JSON.stringify({
                        projectId,
                        userId: role.userId,
                        user,
                    })
                );
            });
    });

    return NextResponse.redirect(new URL("/dashboard", request.url));
}
