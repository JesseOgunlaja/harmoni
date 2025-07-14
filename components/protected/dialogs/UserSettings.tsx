"use client";

import { promiseToast, validateWithSchema } from "@/lib/lib";
import { emailSchema, nameSchema } from "@/lib/schema";
import { deleteAccount, editName, updateEmail } from "@/server/actions/user";
import styles from "@/styles/dialog/settings.module.css";
import "@/styles/utils/dialog.css";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createPortal } from "react-dom";
import { useUser } from "../wrappers/UserProvider";

interface PropsType {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UserSettings({ setOpen }: PropsType) {
  const user = useUser()!;
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);

  function closeModal() {
    setLoading(false);
    setOpen(false);
  }

  function formSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const promises: Promise<unknown>[] = [];

    if (name !== user.name && validateWithSchema(nameSchema, name)) {
      const promise = new Promise((resolve, reject) => {
        editName(name).then((res) => {
          if (res.success) resolve(res.message);
          else reject(res.message);
        });
      });

      promiseToast(promise);
      promises.push(promise);
    }

    if (email !== user.email && validateWithSchema(emailSchema, email)) {
      const promise = new Promise((resolve, reject) => {
        updateEmail(email).then((res) => {
          if (res.success) resolve(res.message);
          else reject(res.message);
        });
      });

      promiseToast(promise);
      promises.push(promise);
    }

    Promise.allSettled(promises).then(() => {
      setLoading(false);
      router.refresh();
    });
  }

  function deleteButtonClick() {
    if (loading) return;
    setLoading(true);

    promiseToast(
      new Promise((resolve, reject) => {
        deleteAccount().then((res) => {
          if (res.success) resolve(res.message);
          else reject(res.message);
        });
      }),
      {
        successFunction: () => router.push("/signin"),
        errorFunction: () => setLoading(false),
      }
    );
  }

  return createPortal(
    <dialog id={styles.dialog} onClick={closeModal} open>
      <div onClick={(e) => e.stopPropagation()}>
        <div>
          <p>Settings</p>
          <button onClick={closeModal}>&times;</button>
        </div>
        <form onSubmit={formSubmit}>
          <label htmlFor="settings-change-name">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            type="text"
            id="settings-change-name"
          />
          <label htmlFor="settings-change-email">Email</label>
          <input
            value={email}
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            id="settings-change-email"
          ></input>
          <p>
            <Info /> You will need to verify this email before it&apos;s changed
          </p>
          <div>
            <button onClick={deleteButtonClick} type="button">
              Delete account
            </button>
            <button onClick={closeModal} type="button">
              Cancel
            </button>
            <button type="submit">Save changes</button>
          </div>
        </form>
      </div>
    </dialog>,
    document.body
  );
}
