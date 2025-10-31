import { NextRequest, NextResponse } from "next/server";
import { isSignedIn } from "./server/auth";

const publicRoutes = ["/", "/signin"];
const protectedRoutes = ["/onboarding", "/dashboard", "/settings"];

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const { signedIn, user: { onboarding, id: userId } = {} } =
		await isSignedIn();

	if (signedIn && publicRoutes.includes(pathname)) {
		return NextResponse.redirect(
			new URL(onboarding ? "/onboarding" : "/dashboard", request.url),
			{
				headers: { userId: String(userId) },
			},
		);
	}
	if (signedIn && protectedRoutes.includes(pathname)) {
		return onboarding && pathname !== "/onboarding"
			? NextResponse.redirect(new URL("/onboarding", request.url), {
					headers: { userId: String(userId) },
				})
			: !onboarding && pathname === "/onboarding"
				? NextResponse.redirect(new URL("/dashboard", request.url), {
						headers: { userId: String(userId) },
					})
				: NextResponse.next({
						headers: { userId: String(userId) },
					});
	}
	if (!signedIn && protectedRoutes.includes(pathname)) {
		return NextResponse.redirect(new URL("/signin", request.url));
	}

	const response = NextResponse.next();
	response.headers.set("userId", String(userId));
	return response;
}

export const config = {
	matcher: "/((?!api|_next|favicon.ico|.*\\..*).*)",
};
