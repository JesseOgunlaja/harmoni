"use client";

import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";
import { useStatus } from "./StatusProvider";

interface PropsType {
  children: ReactNode;
  className: string;
}

const Droppable = ({ children, className }: PropsType) => {
  const status = useStatus();
  const { isOver, setNodeRef } = useDroppable({
    id: status!,
  });

  return (
    <section
      className={className}
      style={{ outline: isOver ? "2px solid rgba(0, 0, 0, 0.5)" : "" }}
      ref={setNodeRef}
    >
      {children}
    </section>
  );
};

export default Droppable;
