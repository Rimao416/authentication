"use server";
import { getUserByEmail } from "@/app/data/user";
import { signIn } from "@/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import * as z from "zod";
export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Fields" };
  }
  const { email, password } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.password || !existingUser.email) {
    return { error: "User not found" };
  }
  if (!existingUser.emailVerified) {
    await generateVerificationToken(existingUser.email);
    return { success: "Confirmation email Sent" };
  }
  try {
    console.log(password);
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    // TODO: handle error
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Erreur mon frère" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
};
