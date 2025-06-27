"use client";

import { UserState } from "@/types/userstate";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import ProfileDropdown from "./ProfileDropdown";
import { logoutUser } from "@/lib/logout";
import { logout } from "@/store/slices/userSlice";
import Link from "next/link";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FiMenu, FiX } from "react-icons/fi";

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const headerRef = useRef<HTMLElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const isAuthenticated = useSelector(
    (state: { user: UserState }) => state.user.isAuthenticated
  );
  const user = useSelector((state: { user: UserState }) => state.user.user);

  const handleLogout = async () => {
    if (!user) return;
    await logoutUser(user.deviceId);
    dispatch(logout());
    router.push("/");
  };

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50"
      >
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            lms<span className="text-blue-600">.</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm sm:text-base lg:text-lg">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition">Pricing</a>
            <a href="#about" className="text-gray-600 hover:text-blue-600 transition">About</a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="block md:hidden text-sm text-blue-600 transition"
            >
              {isOpen ? <FiX /> : <FiMenu />}
            </Button>

            {isAuthenticated ? (
              <>
                <Link
                  href="/Dashboard"
                  className="hidden md:block px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                  Dashboard
                </Link>
                <ProfileDropdown user={user} onLogout={handleLogout} />
              </>
            ) : (
              <Link
                href="/Signin"
                className="hidden md:block px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Signin
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Sheet positioned absolutely under the header */}
      {isOpen && (
        <div className="fixed top-[3rem] left-0 right-0 z-40 bg-white shadow-md border-b rounded-b-xl h-[30vh] overflow-y-auto transition-all duration-500 animate-in slide-in-from-top">
          <nav className="flex flex-col gap-4 p-6 text-gray-700 text-base">
            <a href="#features" onClick={() => setIsOpen(false)} className="hover:text-blue-600">Features</a>
            <a href="#pricing" onClick={() => setIsOpen(false)} className="hover:text-blue-600">Pricing</a>
            <a href="#about" onClick={() => setIsOpen(false)} className="hover:text-blue-600">About</a>
            <a href="#contact" onClick={() => setIsOpen(false)} className="hover:text-blue-600">Contact</a>

            {/* Explore Button */}
            <div className="mt-auto pt-6">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  setIsOpen(false);
                  router.push("/explore");
                }}
              >
                Explore
              </Button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
