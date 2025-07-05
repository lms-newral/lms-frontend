"use client";

import { Classes, Course, CourseEnrollment } from "@/types/DataTypes";

import { BookOpen, Calendar, Divide, Play } from "lucide-react";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

interface props {
  user: User;
  courses: CourseEnrollment[];
  classes: Classes[];
  selectedCourse: Course;
}

interface User {
  name: string;
}

export default function DashboardContent(props: props) {
  const { user, courses, classes, selectedCourse } = props;

  const OverviewTab = () => (
    <div className=" max-w-4xl lg:max-w-4xl xl:max-w-6xl mx-auto space-y-6">
      {/* Selected Course Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 col-span-3 overflow-x-auto">
          <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
                Selected course
              </h1>
              <Link
                href="/Courses"
                className="flex gap-2 text-sm text-gray-500 items-center mt-2"
              >
                Select different course <FiArrowRight className="text-xs" />
              </Link>
            </div>
            <div className="text-left md:text-right">
              <p className="text-md md:text-lg font-semibold text-slate-700 mb-3">
                Course title
              </p>
              {selectedCourse?.thumbnail ? (
                <img
                  className="w-32 h-20 object-cover rounded-xl shadow-md border-2 border-white"
                  src={selectedCourse.thumbnail}
                  alt={selectedCourse.title}
                />
              ) : (
                <span className="text-sm text-gray-500">no thumbnail</span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {[
          {
            label: "Total Courses",
            value: courses.length,
            Icon: BookOpen,
            color: "text-blue-600",
          },
          {
            label: "Total Classes",
            value: classes.length,
            Icon: Calendar,
            color: "text-green-600",
          },
          {
            label: "Live Classes",
            value: classes.filter((c) => c.isLive).length,
            Icon: Play,
            color: "text-red-600",
          },
        ].map(({ label, value, Icon, color }, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
              <Icon className={`h-8 w-8 sm:h-10 sm:w-10 ${color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Classes & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Classes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Classes
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {classes.slice(0, 3).map((class_) => (
              <div key={class_.id} className="flex items-center space-x-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    class_.isLive
                      ? "bg-red-500"
                      : class_.isRecorded
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {class_.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {class_.course?.title ?? "Course title"}
                  </p>
                </div>
                <p className="text-xs text-gray-500 whitespace-nowrap">
                  {class_.scheduledAt}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Course Performance */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Courses</h3>
          </div>
          <div className="p-6 space-y-4">
            {courses.map((course, index) => (
              <div
                key={course?.course?.id || index}
                className="flex items-center justify-between flex-wrap"
              >
                <p className="text-sm font-medium text-gray-900 truncate max-w-[70%]">
                  {course?.course?.title || "Error"}
                </p>
                <p className="text-xs text-gray-500 whitespace-nowrap">
                  {course?.course?._count?.classes ?? 0} classes
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-4xl lg:max-w-4xl xl:max-w-6xl mx-auto">
            <div className="">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <OverviewTab />
      </div>
    </div>
  );
}
