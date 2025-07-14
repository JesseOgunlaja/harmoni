import { db, kv } from "@/server/db/db";
import { roles, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

interface ParamsType {
  params: Promise<{
    code: string;
  }>;
}

export async function GET(request: NextRequest, { params }: ParamsType) {
  const code = decodeURIComponent((await params).code);
  const [email, projectId] = String(await kv.get(`invite:${code}`)).split(":");

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user)
    return NextResponse.json({ message: "Invalid code" }, { status: 401 });

  await Promise.all([
    db.insert(roles).values({
      userId: user.id,
      projectId: Number(projectId),
    }),
    kv.del(`invite:${code}`),
  ]);

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
