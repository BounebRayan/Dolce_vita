import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function middleware(req) {
    const token = req.cookies.get("adminToken");

    if (req.nextUrl.pathname.startsWith("/admin")) {
        if (!token) {
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }

        try {
            verifyToken(token);
        } catch (err) {
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
