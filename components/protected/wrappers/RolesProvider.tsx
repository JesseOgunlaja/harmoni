"use client";

import { FullRole, Project } from "@/server/db/schema";
import { createContext, ReactNode, useContext, useOptimistic } from "react";

interface PropsType {
  roles: FullRole[];
  children: ReactNode;
}

interface UpdateData {
  projectId: number;
  newStatus: Project["status"];
}

const RolesContext = createContext<{
  roles: FullRole[];
  changeOptimisticProjectStatus: (_updateData: UpdateData) => void;
} | null>(null);
export const useRoles = () => useContext(RolesContext);

export default function RolesProvider({ roles, children }: PropsType) {
  const [optimisticRoles, changeProjectStatus] = useOptimistic(
    roles,
    (currentRoles, { projectId, newStatus }: UpdateData) => {
      return currentRoles.map((role) =>
        role.projectId === projectId
          ? { ...role, project: { ...role.project, status: newStatus } }
          : role
      );
    }
  );

  return (
    <RolesContext.Provider
      value={{
        roles: optimisticRoles,
        changeOptimisticProjectStatus: changeProjectStatus,
      }}
    >
      {children}
    </RolesContext.Provider>
  );
}
