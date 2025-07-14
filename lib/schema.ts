import { z } from "zod";

export const emailSchema = z.string().email("Invalid email address");
export const nameSchema = z.string().min(1, "Name is required");
export const commentsSchema = z.string().min(1, "Comment is required");

export const projectsSchema = z.object({
  title: z
    .string()
    .min(1, "Project title cannot be empty")
    .max(64, "Project title has to be less than 64 characters"),
  description: z.string().min(1, "Project description cannot be empty"),
  status: z.enum(["scheduled", "ongoing", "complete"]).optional(),
});
