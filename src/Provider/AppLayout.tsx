"use client";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, setCourse } from "@/store/slices/userSlice";
import Footer from "@/components/Footer";
import Header from "@/components/Header/Header";
import AppSidebar from "@/components/Sidebar/AppSidebar";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import ProtectedRoute from "@/components/ProtectedRoute";

// Utility function to handle localStorage operations safely
const safeLocalStorage = {
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`Failed to set localStorage item ${key}:`, error);
      // Fallback to sessionStorage
      try {
        sessionStorage.setItem(key, value);
        console.log(`Fallback: Set ${key} in sessionStorage`);
        return true;
      } catch (sessionError) {
        console.warn(`Failed to set sessionStorage item ${key}:`, sessionError);
        return false;
      }
    }
  },

  getItem: (key) => {
    try {
      return localStorage.getItem(key) || sessionStorage.getItem(key);
    } catch (error) {
      console.warn(`Failed to get item ${key}:`, error);
      return null;
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove item ${key}:`, error);
    }
  },
};

export default function AppLayout({ children }: { children: ReactNode }) {
  const path = usePathname();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const refreshToken = async () => {
      const token = safeLocalStorage.getItem("refreshToken");
      const storedCourseId = safeLocalStorage.getItem("courseId");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/refresh`,
          { refreshToken: token }
        );

        // Set user first
        dispatch(
          setUser({
            accessToken: response.data.accessToken,
            user: response.data.user,
          })
        );

        // Course logic for dashboard routes
        if (
          path === "/" ||
          path === "/Dashboard" ||
          path === "/Classes" ||
          path === "/Notes" ||
          path === "/Assignments" ||
          path === "/Attachments"
        ) {
          let courseIdToSet = storedCourseId;

          // Only fetch courses if no stored courseId exists
          if (!storedCourseId) {
            try {
              const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}course-enrollment/courses/${response.data.user.id}`;
              const courseResponse = await axios.get(url);

              if (courseResponse.data && courseResponse.data.length > 0) {
                courseIdToSet = courseResponse.data[0].course.id;
                console.log("Setting courseId from API:", courseIdToSet);

                // Use safe localStorage function
                const success = safeLocalStorage.setItem(
                  "courseId",
                  courseIdToSet || ""
                );
                if (!success) {
                  console.error("Failed to save courseId to storage");
                }
              }
            } catch (courseError) {
              console.error("Error fetching courses:", courseError);
            }
          }

          // Set course in Redux store
          if (courseIdToSet) {
            dispatch(setCourse(courseIdToSet));
          }
        }

        // Save refresh token
        safeLocalStorage.setItem("refreshToken", response.data.refreshToken);
      } catch (error) {
        console.error("Refresh token error:", error);
        safeLocalStorage.removeItem("refreshToken");
        safeLocalStorage.removeItem("courseId");
      } finally {
        setIsLoading(false);
      }
    };

    refreshToken();
  }, [dispatch, path]);

  // Show loading spinner while authenticating
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Public routes (no authentication required)
  if (path === "/" || path === "/Signin" || path === "/Signup") {
    return (
      <>
        <Header />
        {children}
        <Footer />
      </>
    );
  }

  // Admin-only routes
  if (path.startsWith("/Create")) {
    return (
      <ProtectedRoute
        allowedRoles={["ADMIN", "SUPER_ADMIN"]}
        redirectTo="/Dashboard"
      >
        <div className="min-h-screen flex w-full">
          <main className="flex-1 lg:ml-0">
            <DashboardHeader />
            {children}
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  // Protected dashboard routes (requires authentication)
  if (
    path === "/Dashboard" ||
    path === "/Courses" ||
    path === "/Classes" ||
    path.startsWith("/Classes/") ||
    path === "/Notes" ||
    path === "/Assignments" ||
    path === "/Attachments"
  ) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 lg:ml-0">
            <DashboardHeader />
            {children}
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return <>{children}</>;
}
