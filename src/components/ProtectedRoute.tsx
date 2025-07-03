"use client";
import { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/index";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
  requireAuth?: boolean;
}

export default function ProtectedRoute({
  children,
  allowedRoles = ["ADMIN", "SUPER_ADMIN", "TEACHER"],
  redirectTo = "/",
  requireAuth = true,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const { user, accessToken } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Wait a moment to ensure Redux state is hydrated
    const checkAuth = () => {
      // If authentication is required but user is not logged in
      if (requireAuth && !accessToken) {
        router.push("/Signin"); // Redirect to login page
        return;
      }

      // If user is logged in but doesn't have required role
      if (allowedRoles.length > 0 && user) {
        const userRole = user.role?.toLowerCase();
        const hasRequiredRole = allowedRoles.some(
          (role) => role.toLowerCase() === userRole
        );

        if (!hasRequiredRole) {
          router.push(redirectTo);
          return;
        }
      }

      setIsChecking(false);
    };

    // Small delay to ensure state is properly hydrated
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [user, accessToken, allowedRoles, redirectTo, requireAuth, router]);

  // Show loading while checking permissions
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If we reach here, user has required permissions
  return <>{children}</>;
}
