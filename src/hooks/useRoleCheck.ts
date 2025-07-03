"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/index";

export function useRoleCheck() {
  const { user } = useSelector((state: RootState) => state.user);

  const hasRole = (requiredRoles: string | string[]) => {
    if (!user || !user.role) return false;

    const roles = Array.isArray(requiredRoles)
      ? requiredRoles
      : [requiredRoles];
    const userRole = user.role.toLowerCase();

    return roles.some((role) => role.toLowerCase() === userRole);
  };

  const isAdmin = () => hasRole("admin");
  const isStudent = () => hasRole("student");
  const isTeacher = () => hasRole("teacher");

  return {
    user,
    hasRole,
    isAdmin,
    isStudent,
    isTeacher,
    userRole: user?.role,
  };
}
