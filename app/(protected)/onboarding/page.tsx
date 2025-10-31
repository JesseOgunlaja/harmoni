import { Suspense } from "react";
import Onboarding from "@/components/protected/Onboarding";

export default async function Page() {
	return (
		<Suspense fallback={null}>
			<Onboarding />
		</Suspense>
	);
}
