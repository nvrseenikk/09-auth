import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
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
    const setCookie = response.headers["set-cookie"];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      const nextResponse = isPrivateRoute
        ? NextResponse.next()
        : NextResponse.next();

      for (const cookieStr of cookieArray) {
        const [cookiePair] = cookieStr.split(";");
        const [name, value] = cookiePair.split("=");
        nextResponse.cookies.set(name, value);
      }

      isAuthenticated = true;

      if (isPublicRoute) {
        const homeUrl = new URL("/", request.url);
        const redirectResponse = NextResponse.redirect(homeUrl);
        for (const cookieStr of cookieArray) {
          const [cookiePair] = cookieStr.split(";");
          const [name, value] = cookiePair.split("=");
          redirectResponse.cookies.set(name, value);
        }
        return redirectResponse;
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
