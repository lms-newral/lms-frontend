"use client";

import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

import CourseCard from "@/components/Courses/CourseCard";
import { Course } from "@/types/DataTypes";
import { UserState } from "@/types/userstate";

// Constants
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const TITLE_MAX_LENGTH = 50;
const DESCRIPTION_MAX_LENGTH = 90;

// Types
interface ApiError {
  message: string;
}

interface EnrollmentRequest {
  studentId: string;
  courseId: string;
}

interface EnrollmentResponse {
  message: string;
}

export default function RequestEnroll() {
  // State
  const [courseData, setCourseData] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const user = useSelector((state: { user: UserState }) => state.user);
  const router = useRouter();

  // Validation
  const isValidUser = user?.user?.id && user?.accessToken;

  // API Functions
  const fetchUnenrolledCourses = useCallback(async () => {
    if (!isValidUser) {
      setError("User not authenticated");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get<Course[]>(
        `${BACKEND_URL}course/unenrolled`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
          timeout: 10000, // 10 second timeout
        }
      );

      setCourseData(response.data || []);
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError
          ? err.response?.data?.message || "Failed to fetch courses"
          : "An unexpected error occurred";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isValidUser, user?.accessToken]);

  const handleEnrollmentRequest = useCallback(
    async (courseId: string) => {
      if (!isValidUser) {
        toast.error("Please log in to request enrollment");
        return;
      }

      if (!courseId) {
        toast.error("Invalid course selection");
        return;
      }

      try {
        setIsEnrolling(true);

        const requestData: EnrollmentRequest = {
          studentId: user.user!.id,
          courseId,
        };

        const response = await axios.post<EnrollmentResponse>(
          `${BACKEND_URL}request-enrollment`,
          requestData,
          {
            timeout: 10000,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        toast.success(
          response.data.message || "Enrollment request sent successfully"
        );

        // Refresh the course list to remove the enrolled course
        await fetchUnenrolledCourses();
      } catch (err) {
        const errorMessage =
          err instanceof AxiosError
            ? err.response?.data?.message || "Failed to send enrollment request"
            : "An unexpected error occurred";

        toast.error(errorMessage);
      } finally {
        setIsEnrolling(false);
      }
    },
    [isValidUser, fetchUnenrolledCourses, user.user]
  );

  // Effects
  useEffect(() => {
    fetchUnenrolledCourses();
  }, [fetchUnenrolledCourses]);

  // Render helpers
  const renderLoadingState = () => (
    <div className="min-h-screen py-10 flex flex-col items-center justify-center">
      <div className="text-lg">Loading courses...</div>
    </div>
  );

  const renderErrorState = () => (
    <div className="min-h-screen py-10 flex flex-col items-center justify-center gap-4">
      <div className="text-red-600 text-center">
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p>{error}</p>
      </div>
      <button
        onClick={fetchUnenrolledCourses}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Retry
      </button>
    </div>
  );

  const renderEmptyState = () => (
    <div className="min-h-screen py-10 flex flex-col items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">All Caught Up!</h2>
        <p className="text-gray-600">
          You are already enrolled in all available courses
        </p>
      </div>
    </div>
  );

  const renderCourseGrid = () => (
    <div className="min-h-screen py-10 flex flex-col items-center gap-10">
      <h1 className="px-4 text-xl sm:text-2xl md:text-3xl font-bold text-center">
        Browse Courses and Request to Enroll
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center md:justify-items-stretch">
        {courseData.map((course) => (
          <button
            key={course.id}
            onClick={() => handleEnrollmentRequest(course.id)}
            disabled={isEnrolling}
            className={`cursor-pointer transition-transform hover:scale-105 ${
              isEnrolling ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label={`Request enrollment in ${course.title}`}
          >
            <CourseCard
              creatorId={course.creatorId || ""}
              title={
                course.title?.slice(0, TITLE_MAX_LENGTH) || "Untitled Course"
              }
              description={
                course.description?.slice(0, DESCRIPTION_MAX_LENGTH) ||
                "No description available"
              }
              thumbnailurl={course.thumbnail || ""}
            />
          </button>
        ))}
      </div>

      {isEnrolling && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <p>Processing enrollment request...</p>
          </div>
        </div>
      )}
    </div>
  );

  // Main render
  if (!isValidUser) {
    return (
      <div className="min-h-screen py-10 flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600">
            Please log in to view available courses
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) return renderLoadingState();
  if (error) return renderErrorState();
  if (courseData.length === 0) return renderEmptyState();

  return renderCourseGrid();
}
