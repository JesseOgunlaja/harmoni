import { promiseToast } from "@/lib/lib";
import { loginWithOTP } from "@/server/actions/auth";
import { getWebsocketToken } from "@/server/actions/utils";
import { env } from "@/server/env";
import styles from "@/styles/signin.module.css";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ClientStream, createClientStream } from "streamthing";

interface PropsType {
  email: string;
}

export default function CheckEmail({ email }: PropsType) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isManualLogin, setIsManualLogin] = useState(false);

  useEffect(() => {
    let stream: ClientStream;

    (async () => {
      stream = createClientStream({
        id: env.NEXT_PUBLIC_WEBSOCKET_SERVER_ID,
        region: env.NEXT_PUBLIC_WEBSOCKET_SERVER_REGION,
        token: await getWebsocketToken(),
      });

      stream.receive("login", () => window.location.replace("/onboarding"));
    })();

    return () => stream?.disconnect();
  }, [email]);

  function formSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    promiseToast(
      new Promise((resolve, reject) => {
        loginWithOTP(Number(code)).then((res) => {
          if (res.success) resolve(res);
          else reject(res);
        });
      }),
      {
        successFunction: () => router.push("/onboarding"),
        errorFunction: () => setLoading(false),
      }
    );
  }

  return (
    <div id={styles.checkEmail}>
      <p>
        We&apos;ve sent you a temporary login link.
        <br /> Please check your inbox at <span>{email}</span>.
      </p>
      {isManualLogin ? (
        <form onSubmit={formSubmit} id={styles.codeLogin}>
          <input
            value={code}
            autoFocus
            maxLength={6}
            onChange={(e) =>
              /^\d+$/.test(e.target.value) && setCode(e.target.value)
            }
            type="text"
            placeholder="Enter code"
          />
          <button disabled={loading} type="submit">
            Continue with login code
          </button>
        </form>
      ) : (
        <button onClick={() => setIsManualLogin(true)}>
          Enter code manually
        </button>
      )}
    </div>
  );
}
