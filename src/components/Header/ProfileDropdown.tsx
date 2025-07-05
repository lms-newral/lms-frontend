import Link from "next/link";
import { User, MessageSquare, LogOut, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User as UserType } from "@/types/userstate";

interface ProfileDropdownProps {
  user: UserType | null;
  onLogout: () => void;
}

export default function ProfileDropdown({
  user,
  onLogout,
}: ProfileDropdownProps) {
  const handleLogout = () => {
    onLogout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-10 w-10 rounded-full bg-gradient-to-tr from-blue-400 to-blue-300 flex items-center justify-center shadow-md hover:scale-105 transition-all duration-200 focus:outline-none ">
          <span className="absolute inset-0 rounded-full border-2 border-white opacity-60"></span>
          {user?.profileImage ? (
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={user.profileImage}
              alt={`${user.username}'s profile`}
              onError={(e) => {
                // Fallback to icon if image fails to load
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling?.classList.remove("hidden");
              }}
            />
          ) : null}
          <User
            className={`h-5 w-5 text-white ${
              user?.profileImage ? "hidden" : ""
            }`}
            aria-hidden="true"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 mt-2">
        <DropdownMenuLabel className="flex flex-col">
          <span className="font-medium">{user?.username}</span>
          {user?.email && (
            <span className="text-xs text-muted-foreground font-normal">
              {user.email}
            </span>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer group">
          <User className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          <Link href="/profile" className="w-full">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer group">
          <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          <Link href="/Courses" className="w-full">
            Courses
          </Link>
        </DropdownMenuItem>
        {(user?.role === "ADMIN" ||
          user?.role === "SUPER_ADMIN" ||
          user?.role === "TEACHER") && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer group">
              <PlusCircle className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <Link href="/Create/Class" className="w-full">
                Create Class
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer group">
              <PlusCircle className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <Link href="/Create/Course" className="w-full">
                Create Course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer group">
              <PlusCircle className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <Link href="/Create/Notes" className="w-full">
                Add Notes to Class
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer group">
              <PlusCircle className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <Link href="/Create/Notes" className="w-full">
                Add Assigment to Class
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer group">
              <PlusCircle className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <Link href="/Create/Notes" className="w-full">
                Add Attachment to Class
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 focus:bg-red-50 focus:text-red-700 group"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
