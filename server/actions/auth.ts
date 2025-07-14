"use server";

import AuthEmailComponent from "@/components/email/AuthEmailComponent";
import { generateRandomString } from "@/lib/lib";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import {
  refreshAccessToken,
  setAccessToken,
  setRefreshToken,
  signJWT,
} from "../auth";
import { db, kv } from "../db/db";
import { sessions, users } from "../db/schema";
import { env } from "../env";
import { sendEmail } from "./lib";

export async function sendMagicLink(email: string) {
  try {
    const code = generateRandomString(false, 6);
    const magicLinkCode = generateRandomString(true, 20);

    const pipeline = kv.pipeline();
    pipeline.set(`otp:${code}`, email, { ex: 60 * 5 });
    pipeline.set(`magic:${magicLinkCode}`, email, { ex: 60 * 5 });

    await Promise.all([
      sendEmail(email, "Login for Harmoni", AuthEmailComponent, {
        code,
        magicLink: `${env.BASE_URL}/magic/${magicLinkCode}`,
      }),
      pipeline.exec(),
    ]);

    return { success: true, message: `An email has been sent to ${email}` };
  } catch (error) {
    return {
      error,
      message: "An unexpected error has occurred, please try again.",
    };
  }
}

export async function loginWithOTP(otp: number) {
  try {
    const email = (await kv.get(`otp:${otp}`)) as string | null;
    if (!email) {
      return {
        success: false,
        message: "Invalid credentials",
      };
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
      kv.del(`otp:${otp}`),
    ]);

    await setAccessToken(access_token);

    return {
      success: true,
      message: "Successfully logged in",
    };
  } catch (error) {
    return {
      error,
      message: "An unexpected error occurred, please try again",
    };
  }
}

export async function logout() {
  const cookiesInstance = await cookies();
  cookiesInstance.delete("access_token");
  cookiesInstance.delete("refresh_token");
}

export async function refreshToken() {
  await refreshAccessToken();
}
