"use client";

import { useCurrentRole } from "@/app/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { FormError } from "../form-error";
interface RoleGateProps {
  allowedRoles: UserRole;
  children: React.ReactNode;
}

export default function RoleGate({ allowedRoles, children }: RoleGateProps) {
  const role = useCurrentRole();
  if (role !== allowedRoles) {
    return <FormError message="You are not authorized to access this page" />;
  }
  return <>{children}</>;
}
