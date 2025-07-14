"use client";

import styles from "@/styles/dashboard.module.css";
import { useDraggable } from "@dnd-kit/core";
import { MouseEvent, ReactNode, useState } from "react";
import ProjectDialog from "../dialogs/ProjectDialog";
import { useRole } from "../wrappers/RoleProvider";

interface PropsType {
  children: ReactNode;
}

export default function ProjectWrapper({ children }: PropsType) {
  const role = useRole()!;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: role.projectId,
    data: { status: role.project.status },
  });

  function onClick(e: MouseEvent) {
    if (!(e.target as HTMLElement).closest("dialog")) {
      setIsModalOpen(true);
    }
  }

  return (
    <article
      onClick={onClick}
      className={styles[role.project.status]}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
    >
      {children}
      {isModalOpen && <ProjectDialog setOpen={setIsModalOpen} />}
    </article>
  );
}
