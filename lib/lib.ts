import { Role } from "@/server/db/schema";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { ZodType } from "zod";

export function validateWithSchema(schema: ZodType, data: unknown) {
  const result = schema.safeParse(data);
  result.error?.errors.forEach(({ message }) => toast.error(message));

  return result.success;
}

export function formatCommentDate(date: Date) {
  return formatDistanceToNow(date, { addSuffix: true });
}

export function getBackgroundColor(initials: string) {
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  const saturation = 65 + (Math.abs(hash) % 10);
  const lightness = 35 + (Math.abs(hash) % 10);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function generateRandomString(
  includeLetters: boolean,
  length: number
): string {
  const numbers = "0123456789";
  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const characters = includeLetters ? numbers + letters : numbers;

  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

export interface OptionsType {
  customProps?: Partial<Parameters<typeof toast.promise>[1]>;
  successFunction?: (..._params: never[]) => unknown;
  errorFunction?: (..._params: never[]) => unknown;
}

export function promiseToast(
  promise: Promise<unknown>,
  options: OptionsType = {}
) {
  const { customProps, successFunction, errorFunction } = options;

  toast.promise(promise, {
    ...customProps,
    loading: "Loading...",
    success: (data) => {
      if (successFunction) successFunction();
      return data as string;
    },
    error: (data) => {
      if (errorFunction) errorFunction();
      return data;
    },
  });
}

export function formatRole(role: Role["role"]) {
  const formattedRole = role === "read_only" ? "viewer" : role;
  return formattedRole[0].toUpperCase() + formattedRole.slice(1);
}
