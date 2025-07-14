"use client";

import { useState } from "react";
import AddProjectDialog from "../dialogs/AddProjectDialog";

export default function AddProjectButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Add project</button>
      {isModalOpen ? <AddProjectDialog setOpen={setIsModalOpen} /> : null}
    </>
  );
}
