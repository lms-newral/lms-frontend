"use client";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/index";

interface RoleBasedAccessProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}

export function RoleBasedAccess({
  children,
  allowedRoles,
  fallback = null,
}: RoleBasedAccessProps) {
  const { user } = useSelector((state: RootState) => state.user);

  if (!user) {
    return <>{fallback}</>;
  }

  const userRole = user.role?.toLowerCase();
  const hasRequiredRole = allowedRoles.some(
    (role) => role.toLowerCase() === userRole
  );

  return hasRequiredRole ? <>{children}</> : <>{fallback}</>;
}
