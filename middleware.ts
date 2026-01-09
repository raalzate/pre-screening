export { default } from "next-auth/middleware";

export const config = {
    matcher: [
        "/api/(protected)/:path*",
        "/api/certification/:path*",
        "/api/challenge/:path*",
        "/api/evaluation/:path*",
        "/api/forms/:path*",
        "/api/user/:path*",
    ],
};
