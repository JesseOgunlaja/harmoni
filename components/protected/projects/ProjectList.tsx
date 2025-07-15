"use client";

import { Project as ProjectType } from "@/server/db/schema";
import styles from "@/styles/dashboard.module.css";
import Droppable from "../wrappers/Droppable";
import ProjectWrapper from "../wrappers/ProjectWrapper";
import RoleProvider from "../wrappers/RoleProvider";
import { useRoles } from "../wrappers/RolesProvider";
import StatusProvider from "../wrappers/StatusProvider";
import AddProjectButton from "./AddProjectButton";
import Project from "./Project";

interface PropsType {
  title: string;
  status: ProjectType["status"];
}

export default function ProjectList({ title, status }: PropsType) {
  const roles = useRoles()!.roles.filter(
    ({ project }) => project.status === status
  );

  return (
    <StatusProvider status={status}>
      <Droppable className={styles[status]}>
        <div className={styles.sectionHeader}>
          <h2>{title}</h2>
          {status !== "complete" && <AddProjectButton />}
        </div>
        <div className={styles.projectList}>
          {roles.map((role) => (
            <RoleProvider key={role.project.id} role={role}>
              <ProjectWrapper>
                <Project role={role} />
              </ProjectWrapper>
            </RoleProvider>
          ))}
        </div>
      </Droppable>
    </StatusProvider>
  );
}
