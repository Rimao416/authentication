import { prisma } from "@/lib/db";

export const getUser = async (id: string) => prisma.user.findUnique({ where: { id } });

export const getUserByEmail = async (email: string) => prisma.user.findUnique({ where: { email } });

export const getAllUsers = async () => prisma.user.findMany();
