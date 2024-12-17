import NextAuth from "next-auth";
import authConfig from "./auth.config";
const { auth } = NextAuth(authConfig);

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

export default auth((req) => {
  const isLoggedIn = !!req.auth; // Vérifie si l'utilisateur est authentifié
  const isApiAuthRoute = req.nextUrl.pathname.startsWith(apiAuthPrefix); // Routes API
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname); // Routes publiques
  const isAuthRoute = authRoutes.includes(req.nextUrl.pathname); // Routes d'authentification

  // 1. Routes API auth
  if (isApiAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
    }
    return; // Laisser passer
  }

  // 2. Routes d'authentification (login/register)
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
    }
    return; // Laisser passer pour les non-authentifiés
  }

  // 3. Routes publiques
  if (isPublicRoute) {
    return; // Laisser passer sans condition
  }

  // 4. Routes protégées
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", req.url)); // Redirige vers login si non-authentifié
  }

  return; // Laisser passer pour les authentifiés
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
