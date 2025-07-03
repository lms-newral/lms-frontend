"use client";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setCourseWithPersistence } from "@/store/slices/userSlice";
import Footer from "@/components/Footer";
import Header from "@/components/Header/Header";
import AppSidebar from "@/components/Sidebar/AppSidebar";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import ProtectedRoute from "@/components/ProtectedRoute";
import { UserState } from "@/types/userstate";

// Safe localStorage utility
const safeLocalStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`Failed to get item ${key}:`, error);
      return null;
    }
  },

  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove item ${key}:`, error);
    }
  },
};

export default function AppLayout({ children }: { children: ReactNode }) {
  const path = usePathname();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  // Get selectedCourse from Redux (this is lastClickedCourse)
  const { selectedCourse } = useSelector(
    (state: { user: UserState }) => state.user
  );

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
          // Check if we already have a selectedCourse in Redux
          if (selectedCourse?.courseId) {
            console.log(
              "Using existing selectedCourse from Redux:",
              selectedCourse.courseId
            );
            return; // Don't fetch API if we already have a selected course
          }

          // Check if we have a stored courseId from localStorage
          if (storedCourseId) {
            console.log(
              "Using stored courseId from localStorage:",
              storedCourseId
            );
            dispatch(setCourseWithPersistence(storedCourseId));
            return;
          }

          // If no selectedCourse and no stored courseId, fetch from API
          try {
            const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}course-enrollment/courses/${response.data.user.id}`;
            const courseResponse = await axios.get(url);

            if (courseResponse.data && courseResponse.data.length > 0) {
              // Set to first course (index 0)
              const firstCourseId = courseResponse.data[0].course.id;
              console.log(
                "No existing course found, setting to first course:",
                firstCourseId
              );
              dispatch(setCourseWithPersistence(firstCourseId));
            }
          } catch (courseError) {
            console.error("Error fetching courses:", courseError);
          }
        }

        // Save refresh token
        try {
          localStorage.setItem("refreshToken", response.data.refreshToken);
        } catch (error) {
          console.warn("Failed to save refresh token:", error);
        }
      } catch (error) {
        console.error("Refresh token error:", error);
        safeLocalStorage.removeItem("refreshToken");
        safeLocalStorage.removeItem("courseId");
      } finally {
        setIsLoading(false);
      }
    };

    refreshToken();
  }, [dispatch, path, selectedCourse?.courseId]); // Added selectedCourse to dependencies

  // Rest of your component remains the same...
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (path === "/" || path === "/Signin" || path === "/Signup") {
    return (
      <>
        <Header />
        {children}
        <Footer />
      </>
    );
  }

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