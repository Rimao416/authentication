import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";

import { prisma } from "./lib/db";
import { getUserById } from "./app/data/user";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "./app/data/two-factor-confirmation";
import { getAccountByUserId } from "./app/data/account";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    /**linkAccount : Lorsqu’un compte est lié à un fournisseur (comme Google), l'utilisateur est mis à jour dans la base de données pour confirmer son email : */
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  /** Les callbacks personnalisent le comportement de NextAuth à divers moments du cycle de vie de l'authentification.*/
  callbacks: {
    async signIn({ user, account }) {
      /* Vérifie si l'utilisateur a vérifié son email avant de l'autoriser à se connecter. Cette logique s'applique uniquement aux connexions via "credentials" (identifiants, comme email/mot de passe). */
      if (account?.provider !== "credentials") return true;
      const existingUser = await getUserById(user.id as string);
      if (!existingUser?.emailVerified) return false;
      if (!existingUser.isTowFacorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );
        if (!twoFactorConfirmation) return false;
        // Delete two factor confirmatio for next sign in
        await prisma.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id,
          },
        });
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      /**Personnalise les données de la session utilisateur. Ajoute leSs champs id et role à session.user, en se basant sur les informations du jeton JWT. */
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (token.isTwoFactorEnabled && session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth=token.isOAuth as boolean
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      const existingAccount = await getAccountByUserId(existingUser.id);
      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;

      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTowFacorEnabled;

      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
