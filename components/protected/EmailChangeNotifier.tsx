"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function EmailChangeNotifier() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const newEmail = params.get("newEmail");

    if (newEmail) toast.success(`Successfully changed email to ${newEmail}`);
    router.push("/dashboard");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
