"use client";

import { createContext, ReactNode, useContext } from "react";
import { FullRole } from "@/server/db/schema";

interface PropsType {
	role: FullRole;
	children: ReactNode;
}

const RoleContext = createContext<FullRole | null>(null);
export const useRole = () => useContext(RoleContext);

export default function RoleProvider({ role, children }: PropsType) {
	return <RoleContext.Provider value={role}>{children}</RoleContext.Provider>;
}
