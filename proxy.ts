import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { parse, serialize } from "cookie";
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

  // Если accessToken нет, но есть refreshToken — пробуем обновить сессию
  if (!accessToken && refreshToken) {
    const response = await checkSession();
    const setCookieHeader = response.headers["set-cookie"];

    if (setCookieHeader) {
      const cookieArray = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : [setCookieHeader];

      isAuthenticated = true;

      const targetUrl = isPublicRoute ? new URL("/", request.url) : request.url;
      const nextResponse = isPublicRoute
        ? NextResponse.redirect(targetUrl)
        : NextResponse.next();

      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);
        const [name, value] = Object.entries(parsed)[0];

        nextResponse.headers.append(
          "Set-Cookie",
          serialize(name, value, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "none",
          }),
        );
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
