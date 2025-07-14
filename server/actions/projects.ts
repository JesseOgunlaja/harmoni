"use server";

import InviteEmailComponent from "@/components/email/InviteEmailComponent";
import { generateRandomString } from "@/lib/lib";
import { commentsSchema, projectsSchema } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import { after } from "next/server";
import { isSignedIn } from "../auth";
import { db, kv } from "../db/db";
import { comments, Project, projects, Role, roles, users } from "../db/schema";
import { env } from "../env";
import { sendEmail } from "./lib";

export async function addProject(
  title: string,
  description: string,
  status: string
) {
  try {
    const { signedIn, user } = await isSignedIn();
    if (!signedIn) {
      return {
        message: "Not authenticated",
      };
    }

    const [{ projectId }] = await db
      .insert(projects)
      .values(
        projectsSchema.parse({
          description,
          status,
          title,
        })
      )
      .returning({ projectId: projects.id });

    await db.insert(roles).values({
      projectId,
      userId: user.id,
      role: "owner",
    });

    return {
      success: true,
      message: "Successfully made project",
    };
  } catch {
    return {
      message: "An unexpected error occurred, please try again",
    };
  }
}
export async function editProject(
  projectId: number,
  title: string,
  description: string,
  status: Project["status"]
) {
  try {
    const { signedIn, user } = await isSignedIn();
    if (!signedIn) {
      return {
        message: "Not authenticated",
      };
    }

    const userRole = user.roles.find((role) => role.projectId === projectId);
    if (!userRole || userRole.role === "read_only") {
      return {
        message: "Not authorized",
      };
    }

    await db
      .update(projects)
      .set(
        projectsSchema.parse({
          description,
          status,
          title,
        })
      )
      .where(eq(projects.id, projectId));

    return {
      success: true,
      message: "Successfully edited project",
    };
  } catch {
    return {
      message: "An unexpected error occurred, please try again",
    };
  }
}
export async function changeProjectStatus(
  projectId: number,
  status: Project["status"]
) {
  try {
    const { signedIn, user } = await isSignedIn();
    if (!signedIn) {
      return {
        message: "Not authenticated",
      };
    }

    const userRole = user.roles.find((role) => role.projectId === projectId);
    if (!userRole || userRole.role === "read_only") {
      return {
        message: "Not authorized",
      };
    }

    await db
      .update(projects)
      .set({
        status,
      })
      .where(eq(projects.id, projectId));

    return {
      success: true,
      message: "Successfully updated project status",
    };
  } catch {
    return {
      message: "An unexpected error occurred, please try again",
    };
  }
}
export async function addMember(projectId: number, newMemberEmail: string) {
  try {
    const { signedIn, user } = await isSignedIn();
    if (!signedIn) {
      return {
        message: "Not authenticated",
      };
    }

    const userRole = user.roles.find((role) => role.projectId === projectId);
    if (!userRole || (userRole.role !== "owner" && userRole.role !== "admin")) {
      return {
        message: "Not authorized",
      };
    }

    after(async () => {
      const newMember = await db.query.users.findFirst({
        where: eq(users.email, newMemberEmail),
      });

      if (!newMember) {
        return {
          success: true,
          message: "An invite has been sent to the user.",
        };
      }

      const inviteCode = generateRandomString(true, 15);
      const link = `${env.BASE_URL}/invite/${inviteCode}`;

      await Promise.all([
        kv.set(`invite:${inviteCode}`, `${newMemberEmail}:${projectId}`, {
          ex: 24 * 60 * 60,
        }),
        sendEmail(
          newMemberEmail,
          "You've been invited to a project",
          InviteEmailComponent,
          {
            link,
            email: user.email,
            name: user.name,
            projectName: userRole.project!.title,
          }
        ),
      ]);
    });

    return {
      success: true,
      message: "An invite has been sent to the user.",
    };
  } catch {
    return {
      message: "An unexpected error occurred, please try again.",
    };
  }
}
export async function changeMemberRole(
  userId: number,
  projectId: number,
  newRole: Role["role"]
) {
  try {
    const { signedIn, user } = await isSignedIn();
    if (!signedIn) {
      return {
        message: "Not authenticated",
      };
    }

    const userRole = user.roles.find((role) => role.projectId === projectId);
    if (
      !userRole ||
      (userRole.role !== "owner" &&
        (userRole.role !== "admin" || newRole === "owner"))
    ) {
      return {
        message: "Not authorized",
      };
    }

    if (user.id === userId) {
      return {
        message: "You can't change your own role",
      };
    }

    await db
      .update(roles)
      .set({
        userId,
        projectId,
        role: newRole,
      })
      .where(and(eq(roles.userId, userId), eq(roles.projectId, projectId)));

    return {
      success: true,
      message: "Successfully changed user role",
    };
  } catch {
    return {
      message: "An unexpected error occurred, please try again.",
    };
  }
}
export async function removeMemberFromProject(
  memberId: number,
  projectId: number
) {
  try {
    const { signedIn, user } = await isSignedIn();
    if (!signedIn) {
      return {
        message: "Not authenticated",
      };
    }

    const userRole = user.roles.find((role) => role.projectId === projectId);
    const memberRole = userRole?.project.roles.find(
      (role) => role.userId === memberId
    );
    if (
      !userRole ||
      (userRole.role !== "owner" && userRole.role !== "admin") ||
      !memberRole ||
      memberRole?.role === "owner"
    ) {
      return {
        message: "Not authorized",
      };
    }

    await db
      .delete(roles)
      .where(and(eq(roles.userId, memberId), eq(roles.projectId, projectId)));

    return {
      success: true,
      message: "Successfully changed user role",
    };
  } catch {
    return {
      message: "An unexpected error occurred, please try again",
    };
  }
}
export async function deleteProject(projectId: number) {
  try {
    const { signedIn, user } = await isSignedIn();
    if (!signedIn) {
      return {
        message: "Not authenticated",
      };
    }

    const userRole = user.roles.find((role) => role.projectId === projectId);
    if (!userRole || userRole.role !== "owner") {
      return {
        message: "Not authorized",
      };
    }

    await db.delete(projects).where(eq(projects.id, projectId));

    return {
      success: true,
      message: "Successfully deleted project",
    };
  } catch {
    return {
      message: "An unexpected error occurred, please try again",
    };
  }
}

export async function addComment(content: string, projectId: number) {
  try {
    const { signedIn, user } = await isSignedIn();
    if (!signedIn) {
      return {
        message: "Not authenticated",
      };
    }

    const userRole = user.roles.find((role) => role.projectId === projectId);
    if (!userRole || userRole.role === "read_only") {
      return {
        message: "Not authorized",
      };
    }

    await db.insert(comments).values({
      content: commentsSchema.parse(content),
      projectId,
      userId: user.id,
    });

    return {
      success: true,
      message: "Successfully created comment",
    };
  } catch {
    return {
      message: "An unexpected error occurred, please try again",
    };
  }
}

export async function editComment(content: string, commentId: number) {
  try {
    const { signedIn, user } = await isSignedIn();
    if (!signedIn) {
      return {
        message: "Not authenticated",
      };
    }

    const comment = user.comments.find((comment) => comment.id === commentId);
    if (!comment) {
      return {
        message: "No comment with that id",
      };
    }

    await db
      .update(comments)
      .set({
        content: commentsSchema.parse(content),
      })
      .where(eq(comments.id, commentId));

    return {
      success: true,
      message: "Successfully updated comment",
    };
  } catch {
    return {
      message: "An unexpected error occurred, please try again",
    };
  }
}

export async function deleteComment(commentId: number) {
  try {
    const { signedIn, user } = await isSignedIn();
    if (!signedIn) {
      return {
        message: "Not authenticated",
      };
    }

    const userRole = user.roles.find((role) =>
      role.project.comments.find((comment) => comment.id === commentId)
    );
    const comment = userRole?.project.comments.find(
      (comment) => comment.id === commentId
    );
    if (
      !userRole ||
      (comment?.userId !== user.id &&
        userRole.role !== "owner" &&
        userRole.role !== "admin")
    ) {
      return {
        message: "No comment with that id",
      };
    }

    await db.delete(comments).where(eq(comments.id, commentId));

    return {
      success: true,
      message: "Successfully deleted comment",
    };
  } catch {
    return {
      message: "An unexpected error occurred, please try again",
    };
  }
}
