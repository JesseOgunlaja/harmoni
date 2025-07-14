"use server";

import UpdateEmailComponent from "@/components/email/UpdateEmailComponent";
import { generateRandomString } from "@/lib/lib";
import { nameSchema } from "@/lib/schema";
import { eq, inArray } from "drizzle-orm";
import { isSignedIn } from "../auth";
import { db, kv } from "../db/db";
import { projects, users } from "../db/schema";
import { env } from "../env";
import { sendEmail } from "./lib";

export async function editName(newName: string) {
  try {
    const { signedIn, user } = await isSignedIn();
    if (!signedIn) {
      return {
        message: "Not authenticated",
      };
    }
    await db
      .update(users)
      .set({ name: nameSchema.parse(newName), onboarding: false })
      .where(eq(users.id, user.id));

    return {
      success: true,
      message: "Successfully updated name",
    };
  } catch {
    return {
      message: "An unexpected error occurred, please try again",
    };
  }
}

export async function updateEmail(newEmail: string) {
  try {
    const { signedIn, user } = await isSignedIn();
    if (!signedIn) {
      return {
        message: "Not authenticated",
      };
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, newEmail),
    });
    if (existingUser) {
      return {
        message: "A user with that email already exists",
      };
    }

    const { email, name } = user;
    const code = generateRandomString(true, 20);

    await Promise.all([
      sendEmail(newEmail, "Update email", UpdateEmailComponent, {
        name,
        link: `${env.BASE_URL}/update-email/${code}`,
      }),
      kv.set(`update-email:${code}`, `${email}:${newEmail}`, { ex: 60 * 5 }),
    ]);

    return { success: true, message: `An email has been sent to ${newEmail}` };
  } catch (error) {
    return {
      error,
      message: "An unexpected error has occurred, please try again.",
    };
  }
}

export async function deleteAccount() {
  try {
    const { signedIn, user } = await isSignedIn();
    if (!signedIn) {
      return {
        message: "Not authenticated",
      };
    }

    const ownedProjectIds = user.roles
      .filter(({ role }) => role === "owner")
      .map(({ project }) => project.id);
    await db.delete(projects).where(inArray(projects.id, ownedProjectIds));
    await db.delete(users).where(eq(users.id, user.id));

    return {
      success: true,
      message: "Successfully deleted account",
    };
  } catch (error) {
    return {
      error,
      message: "An unexpected error has occurred, please try again.",
    };
  }
}
