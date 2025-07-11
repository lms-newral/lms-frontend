"use client";
import EnrolledStudentsHeader from "@/components/Profile/EnrolledStudentsHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { UserState } from "@/types/userstate";
import { Course, CourseEnrollment } from "@/types/DataTypes";

export default function EnrolledStudents() {
  const [enrolledCourses, setEnrolledCourses] = useState<CourseEnrollment[]>(
    []
  );
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = useSelector((state: { user: UserState }) => state.user);

  useEffect(() => {
    async function getCourses() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}course`,
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }
        );
        setCourses(response.data.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses");
      }
    }

    if (user.accessToken) {
      getCourses();
    }
  }, [user]);

  useEffect(() => {
    async function getEnrolledStudentsInCourse() {
      if (!courseId) {
        setEnrolledCourses([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log("Fetching students for course:", courseId);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}course-enrollment/students/${courseId}`,
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }
        );

        console.log("API Response:", response.data);
        setEnrolledCourses(response.data);
      } catch (err) {
        console.error("Error fetching enrolled students:", err);
        setError("Failed to load enrolled students");
      } finally {
        setLoading(false);
      }
    }

    if (courseId) {
      getEnrolledStudentsInCourse();
    }
  }, [courseId, user.accessToken]);

  // function for pagination
  async function handleShowMore() {}
  // Filter students with better error handling
  const studentsWithEnrollment = enrolledCourses.filter(
    (course) => course.student && course.student !== null
  );

  // Format date helper function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <EnrolledStudentsHeader />

        {/* Course Selection */}
        <div className="mb-8 flex justify-end">
          <div className="w-80">
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger className="mt-2 w-full rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm">
                <SelectValue placeholder="-- Select a course --" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {courses.map((course) => {
                  return (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading students...</span>
          </div>
        )}

        {/* No Students Message */}
        {!loading &&
          !error &&
          courseId &&
          studentsWithEnrollment.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-4">📚</div>
              <p className="text-gray-500 text-lg">
                No students enrolled in this course
              </p>
            </div>
          )}

        {/* Students Table */}
        {!loading && !error && studentsWithEnrollment.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profile
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Full Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined On
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentsWithEnrollment.map((course, index) => {
                    // Type guard to ensure student exists
                    if (!course.student) return null;

                    return (
                      <tr
                        key={`${index}`}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={
                                course.student.profileImage ||
                                "/default-avatar.png"
                              }
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                              alt={`${course.student.name}'s profile`}
                              onError={(e) => {
                                e.currentTarget.src = "/default-avatar.png";
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            @{course.student.username}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">
                            {course.student.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {course.student.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {formatDate(course.enrolledAt || "")}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="w-full py-4 flex justify-center">
              <button
                onClick={handleShowMore}
                className="text-blue-600 cursor-pointer"
              >
                show more
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
