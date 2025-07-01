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
        <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          <Link
            href="/"
            className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900"
          >
            lms<span className="text-blue-600">.</span>
          </Link>
          <nav className="hidden md:flex gap-4 md:gap-6 text-sm md:text-base lg:text-lg">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition">Pricing</a>
            <a href="#about" className="text-gray-600 hover:text-blue-600 transition">About</a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition">Contact</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="block md:hidden p-2 text-blue-600 hover:bg-blue-50"
              aria-label="Toggle Menu"
            >
              {isOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </Button>

            {isAuthenticated ? (
              <>
                <Link
                  href="/Dashboard"
                  className="hidden md:block px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition text-sm"
                >
                  Dashboard
                </Link>
                <ProfileDropdown user={user} onLogout={handleLogout} />
              </>
            ) : (
              <Link
                href="/Signin"
                className="hidden md:block px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition text-sm"
              >
                Signin
              </Link>
            )}
          </div>
        </div>
      </header>

      {isOpen && (
        <div className="fixed top-[3.5rem] left-0 right-0 z-40 bg-white border-b shadow-md rounded-b-xl min-h-[40vh] max-h-[60vh] overflow-y-auto transition-all duration-500 animate-in slide-in-from-top px-6 py-4">
          <nav className="flex flex-col gap-4 text-gray-700 text-base sm:text-lg">
            <a href="#features" onClick={() => setIsOpen(false)} className="hover:text-blue-600">Features</a>
            <a href="#pricing" onClick={() => setIsOpen(false)} className="hover:text-blue-600">Pricing</a>
            <a href="#about" onClick={() => setIsOpen(false)} className="hover:text-blue-600">About</a>
            <a href="#contact" onClick={() => setIsOpen(false)} className="hover:text-blue-600">Contact</a>

            <div className="pt-6">
              <Link
                href="/Signin"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition">
                Explore
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
