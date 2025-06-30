"use client";
import {
  Book,
  FileText,
  HelpCircle,
  Home,
  MessageSquare,
  MoreHorizontal,
  PenTool,
  Menu,
  X,
  Notebook,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navigationItems = [
  { title: "Dashboard", icon: Home, url: "/Dashboard", isActive: true },
  { title: "Announcements", icon: MessageSquare, url: "/Announcements" },
  { title: "classes", icon: Book, url: "/Classes" },
  { title: "Assignments", icon: FileText, url: "/assignments" },
  { title: "Quiz", icon: PenTool, url: "/quiz" },
  { title: "Notes", icon: Notebook, url: "/Notes" },
];

const bottomItems = [
  { title: "More", icon: MoreHorizontal, url: "/more" },
  { title: "Support Ticket", icon: HelpCircle, url: "/support" },
];

export default function AppSidebar() {
  const [isOpen, setIsOpen] = useState(false);

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
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative top-0 left-0 h-full bg-white border-r border-gray-200 z-40
          w-64 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:block
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <Link
            href={"/"}
            className="text-2xl font-bold text-gray-900 cursor-pointer"
          >
            lms.
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <a
                key={item.title}
                href={item.url}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                  ${
                    item.isActive
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium truncate">{item.title}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <nav className="space-y-1">
            {bottomItems.map((item) => (
              <a
                key={item.title}
                href={item.url}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium truncate">{item.title}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
