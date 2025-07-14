"use client";

import { SquarePen } from "lucide-react";
import { useState } from "react";
import EditProjectDialog from "../dialogs/EditProjectDialog";

export default function EditProjectButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
      >
        <SquarePen />
      </button>
      {isModalOpen ? <EditProjectDialog setOpen={setIsModalOpen} /> : null}
    </>
  );
}
