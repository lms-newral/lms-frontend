"use client";
import { UserState } from "@/types/userstate";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import ProfileDropdown from "./ProfileDropdown";
import { logoutUser } from "@/lib/logout";
import { logout } from "@/store/slices/userSlice";
import Link from "next/link";
const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
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

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-900">
          lms<span className="text-blue-600">.</span>
        </div>

        <nav className="hidden md:flex space-x-8">
          <a
            href="#features"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Pricing
          </a>
          <a
            href="#about"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            About
          </a>
          <a
            href="#contact"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Contact
          </a>
        </nav>

        <div className="flex space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href={"/Dashboard"}
                className="px-4 md:px-6 py-2 text-sm rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition "
              >
                Dashboard
              </Link>
              <ProfileDropdown user={user} onLogout={handleLogout} />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href={"/Signin"}
                className="px-4 md:px-6 py-2 text-sm rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition "
              >
                Signin
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
