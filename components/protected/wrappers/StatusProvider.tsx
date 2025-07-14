"use client";

import { Project } from "@/server/db/schema";
import { createContext, ReactNode, useContext } from "react";

interface PropsType {
  status: Project["status"];
  children: ReactNode;
}

const StatusContext = createContext<Project["status"] | null>(null);
export const useStatus = () => useContext(StatusContext);

export default function StatusProvider({ status, children }: PropsType) {
  return (
    <StatusContext.Provider value={status}>{children}</StatusContext.Provider>
  );
}
