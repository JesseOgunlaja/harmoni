import { db, kv } from "@/server/db/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

interface ParamsType {
  params: Promise<{
    code: string;
  }>;
}

export async function GET(request: NextRequest, { params }: ParamsType) {
  const { code } = await params;
  const [email, newEmail] = String(await kv.get(`update-email:${code}`)).split(
    ":"
  );

  await Promise.all([
    db
      .update(users)
      .set({
        email: newEmail,
      })
      .where(eq(users.email, email)),
    kv.del(`update-email:${code}`),
  ]);

  return NextResponse.redirect(
    new URL(`/dashboard?newEmail=${newEmail}`, request.url)
  );
}
