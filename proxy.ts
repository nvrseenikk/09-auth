import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { parseSetCookie } from "cookie";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  let isAuthenticated = Boolean(accessToken);

  if (!accessToken && refreshToken) {
    const response = await checkSession();
    const setCookieHeader = response.headers["set-cookie"];
    const setCookieHeaders = setCookieHeader
      ? Array.isArray(setCookieHeader)
        ? setCookieHeader
        : [setCookieHeader]
      : [];

    if (setCookieHeaders.length > 0) {
      isAuthenticated = true;

      const targetUrl = isPublicRoute ? new URL("/", request.url) : request.url;

      const nextResponse = isPublicRoute
        ? NextResponse.redirect(targetUrl)
        : NextResponse.next();

      for (const cookieHeader of setCookieHeaders) {
        const parsedCookie = parseSetCookie(cookieHeader);

        if (!parsedCookie.name || parsedCookie.value === undefined) {
          continue;
        }

        nextResponse.cookies.set({
          name: parsedCookie.name,
          value: parsedCookie.value,
          path: parsedCookie.path,
          domain: parsedCookie.domain,
          expires: parsedCookie.expires,
          httpOnly: parsedCookie.httpOnly,
          maxAge: parsedCookie.maxAge,
          sameSite: parsedCookie.sameSite,
          secure: parsedCookie.secure,
        });
      }

      return nextResponse;
    }
  }

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
