import styles from "@/styles/navbar.module.css";
import { ArrowRight } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProfilePicture from "./ProfilePicture";

export default async function Navbar() {
  const userId = (await headers()).get("userId");
  const isSignedIn = !!userId && !isNaN(Number(userId));

  return (
    <nav id={styles.nav}>
      <ul>
        <li id={styles.title}>
          <Link href={isSignedIn ? "/dashboard" : "/"}>harmoni</Link>
        </li>
        {isSignedIn ? (
          <li>
            <Suspense
              fallback={
                <Skeleton containerClassName={styles.skeleton} circle={true} />
              }
            >
              <ProfilePicture id={Number(userId)} />
            </Suspense>
          </li>
        ) : (
          <li id={styles.signin}>
            <Link href="/signin">
              Sign in <ArrowRight />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
