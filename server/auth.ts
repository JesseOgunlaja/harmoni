import { and, eq, gt } from "drizzle-orm";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { db } from "./db/db";
import { FullUser, sessions } from "./db/schema";
import { env } from "./env";
import { getUserFromId, userRelations } from "./lib";

const secret = new TextEncoder().encode(env.SIGNING_KEY);

export async function signJWT(
  payload: Record<string, unknown>,
  duration = "1m"
) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(duration)
    .sign(secret);
}

export async function decodeJWT(jwt: string) {
  const decoded = await jwtVerify(jwt, secret);
  return decoded.payload as Record<string, string>;
}

export async function setRefreshToken(token: string) {
  const cookiesInstance = await cookies();
  cookiesInstance.set({
    name: "refresh_token",
    value: token,
    maxAge: 7 * 24 * 60 * 60,
    httpOnly: true,
    sameSite: "lax",
    secure: true,
  });
}

export async function setAccessToken(jwt: string) {
  const cookiesInstance = await cookies();
  cookiesInstance.set({
    name: "access_token",
    value: jwt,
    maxAge: 60,
    httpOnly: true,
    sameSite: "lax",
    secure: true,
  });
}

export async function refreshAccessToken() {
  try {
    const cookiesInstance = await cookies();
    const refreshToken = cookiesInstance.get("refresh_token")?.value;
    const session = await db.query.sessions.findFirst({
      where: eq(sessions.id, refreshToken!),
    });
    const jwt = await signJWT({ userId: session?.userId });
    await setAccessToken(jwt);
  } catch {}
}

interface SignedIn {
  signedIn: true;
  user: FullUser;
}

interface SignedOut {
  signedIn: false;
  user: undefined;
}

export async function isSignedIn(): Promise<SignedIn | SignedOut> {
  try {
    const cookiesInstance = await cookies();
    const access_token = cookiesInstance.get("access_token")?.value;
    const refresh_token = cookiesInstance.get("refresh_token")?.value;
    if (access_token) {
      const { userId } = await decodeJWT(access_token);
      const user = await getUserFromId(Number(userId));

      return {
        signedIn: !!user,
        user,
      } as SignedIn | SignedOut;
    } else {
      const session = await db.query.sessions.findFirst({
        where: and(
          eq(sessions.id, refresh_token!),
          gt(sessions.expiresAt, new Date())
        ),
        with: {
          user: {
            with: userRelations,
          },
        },
      });
      return {
        signedIn: !!session,
        user: session?.user,
      } as SignedIn | SignedOut;
    }
  } catch {
    return { signedIn: false } as SignedOut;
  }
}
