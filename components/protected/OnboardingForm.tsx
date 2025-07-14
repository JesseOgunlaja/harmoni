"use client";

import { promiseToast, validateWithSchema } from "@/lib/lib";
import { nameSchema } from "@/lib/schema";
import { editName } from "@/server/actions/user";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface PropsType {
  name: string;
}

export default function OnboardingComponent({ name: initialName }: PropsType) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);

  function formSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    if (!validateWithSchema(nameSchema, name)) return;

    setLoading(true);
    promiseToast(
      new Promise((resolve, reject) => {
        editName(name).then(({ message, success }) => {
          if (success) resolve(message);
          else reject(message);
        });
      }),
      {
        successFunction: () => router.push("/dashboard"),
        errorFunction: () => setLoading(false),
      }
    );
  }

  return (
    <form onSubmit={formSubmit}>
      <label htmlFor="onboarding-form-input">
        Enter the name you&apos;d like
      </label>
      <input
        autoComplete="off"
        id="onboarding-form-input"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button disabled={loading} type="submit">
        Submit name
      </button>
    </form>
  );
}
