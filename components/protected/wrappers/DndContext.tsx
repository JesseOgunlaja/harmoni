"use client";

import { promiseToast } from "@/lib/lib";
import { changeProjectStatus } from "@/server/actions/projects";
import { FullRole, Project as ProjectType } from "@/server/db/schema";
import styles from "@/styles/dashboard.module.css";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import Project from "../projects/Project";

interface PropsType {
  children: ReactNode;
  roles: FullRole[];
}

interface DragEvent {
  over: { id: ProjectType["status"] };
  active: { id: number; data: { current: { status: ProjectType["status"] } } };
}

class CustomMouseSensor extends MouseSensor {
  static override activators = [
    {
      eventName: "onMouseDown",
      handler: ({ nativeEvent }: { nativeEvent: MouseEvent }) => {
        return !(
          nativeEvent.target instanceof HTMLElement &&
          nativeEvent.target.closest("dialog")
        );
      },
    } as const,
  ];
}

export default function DndProvider({ children, roles }: PropsType) {
  const router = useRouter();
  const [activeRole, setActiveProject] = useState<FullRole>();
  const mouseSensor = useSensor(CustomMouseSensor, {
    activationConstraint: {
      distance: 8,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  function handleDragStart(event: unknown) {
    const { active } = event as Pick<DragEvent, "active">;
    setActiveProject(roles.find(({ project: { id } }) => id === active.id));
  }

  function handleDragEnd(event: unknown) {
    const {
      over: { id: newStatus },
      active: {
        id: projectId,
        data: {
          current: { status: oldStatus },
        },
      },
    } = event as DragEvent;
    if (oldStatus === newStatus) return;

    promiseToast(
      new Promise((resolve, reject) => {
        changeProjectStatus(projectId, newStatus).then((res) => {
          if (res.success) resolve(res.message);
          else reject(res.message);
        });
      }),
      {
        successFunction: router.refresh,
      }
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay>
        {activeRole ? (
          <div className={styles.projectList}>
            <div className={styles[activeRole.project.status]}>
              <Project role={activeRole} />
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
