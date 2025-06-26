"use client";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import Footer from "@/components/Footer";
import Header from "@/components/Header/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/Sidebar/AppSidebar";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";

export default function AppLayout({ children }: { children: ReactNode }) {
  const path = usePathname();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const refreshToken = async () => {
      const token = localStorage.getItem("refreshToken");
      if (!token) {
        setIsLoading(false); // Fixed: should be false when no token
        return;
      }

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/refresh`,
          { refreshToken: token }
        );
        localStorage.setItem("refreshToken", response.data.refreshToken);
        dispatch(
          setUser({
            accessToken: response.data.accessToken,
            user: response.data.user,
          })
        );
      } catch (error) {
        console.error("Refresh token error:", error);
        localStorage.removeItem("refreshToken");
      } finally {
        setIsLoading(false); // Fixed: should be false when done loading
      }
    };

    refreshToken();
  }, [dispatch]);

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

  if (path === "/Dashboard" || path === "/Courses") {
    return (
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 lg:ml-0">
          {/* Main content area */}
          <DashboardHeader />
          {children}
          <Footer />
        </main>
      </div>
    );
  }

  return <>{children}</>;
}
