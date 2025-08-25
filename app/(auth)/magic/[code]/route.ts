import { setAccessToken, setRefreshToken, signJWT } from "@/server/auth";
import { db, kv } from "@/server/db/db";
import { sessions, users } from "@/server/db/schema";
import { env } from "@/server/env";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createServerStream } from "streamthing";

interface ParamsType {
  params: Promise<{
    code: string;
  }>;
}

export async function GET(request: NextRequest, { params }: ParamsType) {
  try {
    const code = (await params).code;

    const email = (await kv.get(`magic:${code}`)) as string | null;
    if (!email) {
      return NextResponse.json({ message: "Invalid code" }, { status: 401 });
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    const { id } =
      existingUser ||
      (
        await db
          .insert(users)
          .values({ email, name: email.split("@")[0] })
          .returning({ id: users.id })
      )[0];

    const [{ sessionId }] = await db
      .insert(sessions)
      .values({ userId: id })
      .returning({ sessionId: sessions.id });
    await setRefreshToken(sessionId);

    const [access_token] = await Promise.all([
      signJWT({ userId: id }),
      kv.del(`magic:${code}`),
    ]);

    await setAccessToken(access_token);

    const stream = createServerStream({
      id: env.NEXT_PUBLIC_WEBSOCKET_SERVER_ID,
      region: env.NEXT_PUBLIC_WEBSOCKET_SERVER_REGION,
      password: env.WEBSOCKET_SERVER_PASSWORD,
      channel: (await cookies()).get("device_id")?.value as string,
    });

    stream.send("login", "");

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch {
    return NextResponse.json(
      { message: "An unexpected error occurred, please try again." },
      { status: 500 }
    );
  }
}
