import { eq } from "drizzle-orm";
import { db } from "./db/db";
import { FullUser, users } from "./db/schema";

export const userRelations = {
  comments: true,
  roles: {
    with: {
      project: {
        with: {
          roles: {
            with: {
              user: true,
            },
          },
          comments: {
            with: {
              user: true,
            },
          },
        },
      },
    },
  },
} as const;

export async function getUserFromId(userId: number) {
  return (await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: userRelations,
  }))! satisfies FullUser;
}
