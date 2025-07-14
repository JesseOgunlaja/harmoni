"use client";

import { FullUser } from "@/server/db/schema";
import { createContext, ReactNode, useContext } from "react";

interface PropsType {
  user: FullUser;
  children: ReactNode;
}

const UserContext = createContext<FullUser | null>(null);
export const useUser = () => useContext(UserContext);

export default function UserProvider({ user, children }: PropsType) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
