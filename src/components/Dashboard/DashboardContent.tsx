"use client";
import { BookOpen, Calendar, Play } from "lucide-react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

interface props {
  user: User;
  courses: Course[];
  classes: Classes[];
  selectedCourse: SelectedCourse;
}

interface User {
  name: string;
}

interface Course {
  course: {
    id: string;
    title: string;
    _count: { classes: number };
  };
}

interface Classes {
  id: string;
  title: string;
  course: {
    title: string;
  };
  createdAt: string;
  isLive: boolean;
  isRecorded: boolean;
  scheduledAt: string;
}
interface SelectedCourse {
  title: string;
  thumbnail: string;
}
export default function DashboardContent(props: props) {
  const user = props.user;
  const courses = props.courses;
  const classes = props.classes;
  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 col-span-3">
          <div className="w-full flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">
                Selected course
              </h1>
              <Link
                href={"/Courses"}
                className="flex gap-2 text-sm text-gray-500 items-center mt-2"
              >
                Select different course <FiArrowRight className="text-xs" />{" "}
              </Link>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-slate-700 mb-3">
                course title
              </p>
              {props.selectedCourse.thumbnail ? (
                <img
                  className="-32 h-20 object-cover rounded-xl shadow-md border-2 border-white"
                  src={props.selectedCourse.thumbnail}
                  alt={props.selectedCourse.title}
                />
              ) : (
                <>please enroll in a course</>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses.length}
              </p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Classes</p>
              <p className="text-2xl font-bold text-gray-900">
                {classes.length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Live Classes</p>
              <p className="text-2xl font-bold text-gray-900">
                {classes.filter((c) => c.isLive).length}
              </p>
            </div>
            <Play className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Classes
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {classes.slice(0, 3).map((class_, index) => (
                <div key={class_.id} className="flex items-center space-x-4">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      class_.isLive
                        ? "bg-red-500"
                        : class_.isRecorded
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {class_.title}
                    </p>

                    <p className="text-xs text-gray-500">
                      {class_.course?.title ?? "Course title"}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {class_.scheduledAt}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Course Performance
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {courses.map((course, index) => (
                <div
                  key={course.course.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {course.course.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {course.course._count?.classes ?? 0} classes
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center space-x-4"></div>
          </div>
        </div>

        {/* Tab Content */}
        <OverviewTab />
      </div>
    </div>
  );
}
