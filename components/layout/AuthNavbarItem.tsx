import { ArrowRight } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import Skeleton from "react-loading-skeleton";
import styles from "@/styles/navbar.module.css";
import "react-loading-skeleton/dist/skeleton.css";
import ProfilePicture from "./ProfilePicture";

export default async function AuthNavbarItem() {
	const userId = (await headers()).get("userId");
	const isSignedIn = !!userId && !isNaN(Number(userId));

	return isSignedIn ? (
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
	);
}
