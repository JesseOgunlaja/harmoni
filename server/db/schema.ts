import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const projectStatus = pgEnum("project_status", [
  "scheduled",
  "ongoing",
  "complete",
]);

export const projectRole = pgEnum("project_role", [
  "owner",
  "admin",
  "regular",
  "read_only",
]);

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 32 }).notNull(),
  onboarding: boolean().notNull().default(true),
  email: varchar({ length: 255 }).notNull().unique(),
});

const _usersSchema = createSelectSchema(users);
export type User = z.infer<typeof _usersSchema>;
export type FullUser = User & {
  comments: Comment[];
  roles: FullRole[];
};

export const usersRelations = relations(users, ({ many }) => ({
  comments: many(comments),
  roles: many(roles),
  sessions: many(sessions),
}));

export const projects = pgTable("projects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 64 }).notNull(),
  description: text().notNull(),
  status: projectStatus().notNull().default("scheduled"),
  createdAt: timestamp("created_at").defaultNow(),
});

const _projectsSchema = createSelectSchema(projects);
export type Project = z.infer<typeof _projectsSchema>;
export type FullProject = Project & {
  roles: (Role & {
    user: User;
  })[];
  comments: FullComment[];
};

export const projectsRelations = relations(projects, ({ many }) => ({
  roles: many(roles),
  comments: many(comments),
}));

export const comments = pgTable("comments", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  content: text().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
});

const _commentsSchema = createSelectSchema(comments);
export type Comment = z.infer<typeof _commentsSchema>;
export type FullComment = Comment & {
  user: User;
};

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [comments.projectId],
    references: [projects.id],
  }),
}));

export const roles = pgTable(
  "roles",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    role: projectRole().notNull().default("regular"),
  },
  (table) => [primaryKey({ columns: [table.userId, table.projectId] })]
);

const _rolesSchema = createSelectSchema(roles);
export type Role = z.infer<typeof _rolesSchema>;
export type FullRole = Role & {
  project: FullProject;
};

export const rolesRelations = relations(roles, ({ one }) => ({
  user: one(users, {
    fields: [roles.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [roles.projectId],
    references: [projects.id],
  }),
}));

export const sessions = pgTable("sessions", {
  id: uuid().primaryKey().defaultRandom(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at")
    .notNull()
    .defaultNow()
    .default(sql`now() + interval '1 month'`),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
