"use client";
import { ReactNode, useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, setCourse } from "@/store/slices/userSlice";
import Footer from "@/components/Footer";
import Header from "@/components/Header/Header";
import AppSidebar from "@/components/Sidebar/AppSidebar";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";

export default function AppLayout({ children }: { children: ReactNode }) {
  const path = usePathname();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const refreshToken = async () => {
      const token = localStorage.getItem("refreshToken");
      const storedCourseId = localStorage.getItem("courseId");

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

        // add all the routes in the sidebar here like attachments, notes, etc when you build them

        if (
          path === "/Dashboard" ||
          path === "/Classes" ||
          path === "/Notes" ||
          path === "/Assignments" ||
          path === "/Attachments"
        ) {
          let courseIdToSet = storedCourseId;

          if (!storedCourseId) {
            try {
              const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}course-enrollment/courses/${response.data.user.id}`;
              const courseResponse = await axios.get(url);

              if (courseResponse.data && courseResponse.data.length > 0) {
                courseIdToSet = courseResponse.data[0].course.id;
                localStorage.setItem("courseId", courseIdToSet || "");
              }
            } catch (courseError) {
              console.error("Error fetching courses:", courseError);
            }
          }

          // Set course if we have one
          if (courseIdToSet) {
            dispatch(setCourse(courseIdToSet));
          }
        }

        localStorage.setItem("refreshToken", response.data.refreshToken);
      } catch (error) {
        console.error("Refresh token error:", error);
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("courseId");
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

  if (path === "/") {
    return (
      <>
        <Header />
        {children}
        <Footer />
      </>
    );
  }

  if (
    path === "/Dashboard" ||
    path === "/Courses" ||
    path === "/Classes" ||
    path === `/Classes/${params.id}` ||
    path === `/Notes` ||
    path === "/Assignments" ||
    path === "/Attachments"
  ) {
    return (
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 lg:ml-0">
          {/* Main content area */}
          <DashboardHeader />
          {children}
          {/*<Footer />*/}
        </main>
      </div>
    );
  }

  return <>{children}</>;
}
