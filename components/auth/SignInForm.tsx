"use client";

import { promiseToast } from "@/lib/lib";
import { emailSchema } from "@/lib/schema";
import { sendMagicLink } from "@/server/actions/auth";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import CheckEmail from "./CheckEmail";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function formSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    if (!emailSchema.safeParse(email).success) {
      return toast.error("Invalid email");
    }

    setLoading(true);
    promiseToast(
      new Promise((resolve, reject) => {
        sendMagicLink(email).then(({ message, success }) => {
          if (success) resolve(message);
          else reject(message);
        });
      }),
      {
        successFunction: () => setSuccess(true),
        errorFunction: () => setLoading(false),
      }
    );
  }

  return (
    <div>
      <h1>{success ? "Check your email" : "What's your email address?"}</h1>
      {success ? (
        <CheckEmail email={email} />
      ) : (
        <form onSubmit={formSubmit}>
          <input
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Enter your email address..."
          />
          <button disabled={loading} type="submit">
            Continue with email
          </button>
        </form>
      )}
    </div>
  );
}
