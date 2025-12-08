"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { useRealtime } from "@/hooks/useRealtime";
import { FullRole, Project } from "@/server/db/schema";

interface PropsType {
	roles: FullRole[];
	children: ReactNode;
}

export interface UpdateData {
	projectId: number;
	newStatus: Project["status"];
}

const RolesContext = createContext<{
	roles: FullRole[];
	setRoles: React.Dispatch<React.SetStateAction<FullRole[]>>;
} | null>(null);
export const useRoles = () => useContext(RolesContext);

export default function RolesProvider({
	roles: initalRoles,
	children,
}: PropsType) {
	const [roles, setRoles] = useState(initalRoles);

	useRealtime(setRoles);

	return (
		<RolesContext.Provider
			value={{
				roles,
				setRoles,
			}}
		>
			{children}
		</RolesContext.Provider>
	);
}
