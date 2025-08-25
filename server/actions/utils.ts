"use server";

import { cookies } from "next/headers";
import { createToken } from "streamthing";
import { env } from "../env";

export async function getWebsocketToken() {
  const cookiesInstance = await cookies();
  let deviceId = cookiesInstance.get("device_id")?.value;

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    cookiesInstance.set({
      name: "device_id",
      value: deviceId,
      maxAge: 60,
      sameSite: "lax",
      secure: true,
    });
  }

  return await createToken({
    channel: deviceId,
    password: env.WEBSOCKET_SERVER_PASSWORD,
  });
}
