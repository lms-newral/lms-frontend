import { Search } from "lucide-react";
import { Input } from "../ui/input";
import ProfileDropdown from "../Header/ProfileDropdown";
import { useDispatch, useSelector } from "react-redux";
import { UserState } from "@/types/userstate";
import { logoutUser } from "@/lib/logout";
import { logout } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardHeader() {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state: { user: UserState }) => state.user.user);

  const handleLogout = async () => {
    if (!user) return;
    await logoutUser(user.deviceId);
    dispatch(logout());
    router.push("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between w-full gap-4">
        {/* Logo + Search */}
        <div className="flex items-center flex-1 gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="ml-12 text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 whitespace-nowrap"
          >
            lms<span className="text-blue-600">.</span>
          </Link>

          {/* Search Bar */}
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
            <Search className="hidden md:block absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by concepts, lectures, assignment etc..."
              className="md:pl-10 bg-gray-50 border-gray-200 w-full placeholder:text-xs"
            />
          </div>
        </div>

        {/* Profile Dropdown */}
        <div className="flex items-center">
          <ProfileDropdown user={user} onLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
}
