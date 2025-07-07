
"use client";
import {
  Book,
  FileText,
  Home,
  MessageSquare,
  PenTool,
  Menu,
  X,
  Notebook,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FaFirefoxBrowser } from "react-icons/fa";

const navigationItems = [
  { title: "Dashboard", icon: Home, url: "/Dashboard" },
  { title: "Courses", icon: MessageSquare, url: "/Courses" },
  { title: "Classes", icon: Book, url: "/Classes" },
  { title: "Assignments", icon: FileText, url: "/Assignments" },
  { title: "Attachments", icon: PenTool, url: "/Attachments" },
  { title: "Notes", icon: Notebook, url: "/Notes" },
  { title: "Browse Courses", icon: FaFirefoxBrowser, url: "/Request-enroll" },
];

export default function AppSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        hidden={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-transparent z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Overlay for desktop - when sidebar is expanded */}
      {!isCollapsed && (
        <div
          className="hidden lg:block fixed inset-0 z-30"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-white border-r border-gray-200 z-50
          transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:block
          flex flex-col
          ${isCollapsed ? "w-16" : "w-64"}
          overflow-hidden
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <Link
            href={"/"}
            className={`text-2xl font-bold text-gray-900 cursor-pointer transition-opacity duration-300 ${isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
              }`}
          >
            lms.
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              return (
                <Link
                  key={item.title}
                  href={item.url}
                  onClick={() => setIsOpen(false)}
                  className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                  ${pathname === item.url
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }
                  ${isCollapsed ? "justify-center" : ""}
                  group relative
                `}
                  title={isCollapsed ? item.title : ""}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span
                    className={`font-medium truncate transition-all duration-300 ${isCollapsed
                        ? "opacity-0 w-0 overflow-hidden"
                        : "opacity-100"
                      }`}
                  >
                    {item.title}
                  </span>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                      {item.title}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
