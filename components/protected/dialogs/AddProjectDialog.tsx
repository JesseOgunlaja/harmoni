"use client";

import { promiseToast, validateWithSchema } from "@/lib/lib";
import { projectsSchema } from "@/lib/schema";
import { addProject } from "@/server/actions/projects";
import styles from "@/styles/dialog/addProject.module.css";
import "@/styles/utils/dialog.css";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createPortal } from "react-dom";
import { useStatus } from "../wrappers/StatusProvider";

interface PropsType {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddProjectDialog({ setOpen }: PropsType) {
  const status = useStatus()!;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function closeModal() {
    setTitle("");
    setDescription("");
    setLoading(false);
    setOpen(false);
  }

  function formSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    if (!validateWithSchema(projectsSchema, { title, description })) return;

    setLoading(true);
    promiseToast(
      new Promise((resolve, reject) => {
        addProject(title, description, status!).then((res) => {
          if (res.success) resolve(res.message);
          else reject(res.message);
        });
      }),
      {
        successFunction: () => {
          closeModal();
          router.refresh();
        },
        errorFunction: () => setLoading(false),
      }
    );
  }

  return createPortal(
    <dialog id={styles.dialog} className={status} onClick={closeModal} open>
      <div onClick={(e) => e.stopPropagation()}>
        <div>
          <p>Add new {status} project</p>
          <button onClick={closeModal}>&times;</button>
        </div>
        <form onSubmit={formSubmit}>
          <label htmlFor="add-project-title">Project Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoComplete="off"
            type="text"
            id="add-project-title"
          />
          <label htmlFor="add-project-description">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="add-project-description"
          ></textarea>
          <div>
            <button onClick={closeModal} type="button">
              Cancel
            </button>
            <button type="submit">Add Project</button>
          </div>
        </form>
      </div>
    </dialog>,
    document.body
  );
}
