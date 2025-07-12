"use client";
import axios from "axios";
import EnrolledStudentsHeader from "@/components/Profile/EnrolledStudentsHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
// import axios from "axios"; // Remove this import for the artifact
import { useSelector } from "react-redux";
import { UserState } from "@/types/userstate";
import { Course, CourseEnrollment, PaginationData } from "@/types/DataTypes";

export default function EnrolledStudents() {
  const [enrolledCourses, setEnrolledCourses] = useState<CourseEnrollment[]>(
    []
  );
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [pagination, setPagination] = useState<PaginationData>({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
    hasNext: false,
    hasPrevious: false,
  });
  const [hasInitialized, setHasInitialized] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Refs for infinite scroll
  const observerTarget = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  const user = useSelector((state: { user: UserState }) => state.user);

  // Search function
  const searchStudents = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) {
      return enrolledCourses.filter(
        (course) => course.student && course.student !== null
      );
    }

    const searchLower = searchTerm.toLowerCase();
    return enrolledCourses.filter((course) => {
      if (!course.student) return false;

      const student = course.student;
      return (
        student.name?.toLowerCase().includes(searchLower) ||
        student.email?.toLowerCase().includes(searchLower) ||
        student.username?.toLowerCase().includes(searchLower) ||
        student.role?.toLowerCase().includes(searchLower)
      );
    });
  }, [enrolledCourses, searchTerm]);

  // Get courses
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

  // Function to fetch enrolled students
  const fetchEnrolledStudents = useCallback(
    async (
      page: number = 1,
      pageLimit: number = 10,
      isLoadingMore: boolean = false
    ) => {
      if (!courseId || isLoadingRef.current) return;

      isLoadingRef.current = true;

      if (isLoadingMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        console.log("Fetching students for course:", courseId, "page:", page);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}course-enrollment/students/${courseId}?page=${page}&limit=${pageLimit}`,
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }
        );

        console.log("API Response:", response.data);

        // Update pagination data
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }

        // If loading more, append to existing data, otherwise replace
        if (isLoadingMore) {
          setEnrolledCourses((prev) => [...prev, ...response.data.data]);
        } else {
          setEnrolledCourses(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching enrolled students:", err);
        setError("Failed to load enrolled students");
      } finally {
        setLoading(false);
        setLoadingMore(false);
        isLoadingRef.current = false;
      }
    },
    [courseId, user.accessToken]
  );

  // Initial load when course changes
  useEffect(() => {
    if (courseId) {
      setCurrentPage(1);
      setEnrolledCourses([]);
      setSearchTerm(""); // Clear search when course changes
      setPagination({
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10,
        hasNext: false,
        hasPrevious: false,
      });
      setHasInitialized(false);
      fetchEnrolledStudents(1, limit);
    } else {
      setEnrolledCourses([]);
      setSearchTerm("");
      setPagination({
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10,
        hasNext: false,
        hasPrevious: false,
      });
    }
  }, [courseId, fetchEnrolledStudents, limit]);

  // Load more function for infinite scroll
  const loadMore = useCallback(() => {
    if (pagination.hasNext && !isLoadingRef.current && !loadingMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchEnrolledStudents(nextPage, limit, true);
    }
  }, [
    pagination.hasNext,
    currentPage,
    limit,
    fetchEnrolledStudents,
    loadingMore,
  ]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (
          target.isIntersecting &&
          pagination.hasNext &&
          !isLoadingRef.current &&
          !searchTerm // Only load more if not searching
        ) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, pagination.hasNext, searchTerm]);

  // Get total count for display
  const totalStudents = enrolledCourses.filter(
    (course) => course.student && course.student !== null
  ).length;

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
      <div className="max-w-7xl mx-auto">
        <EnrolledStudentsHeader
          onSearch={searchStudents}
          totalCount={totalStudents}
          filteredCount={searchTerm ? filteredStudents.length : undefined}
        />

        <div className="p-6">
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

          {/* No Course Selected */}
          {!loading && !error && !courseId && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-4">🎓</div>
              <p className="text-gray-500 text-lg">
                Please select a course to view enrolled students
              </p>
            </div>
          )}

          {/* No Students Message */}
          {!loading && !error && courseId && totalStudents === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-4">📚</div>
              <p className="text-gray-500 text-lg">
                No students enrolled in this course
              </p>
            </div>
          )}

          {/* No Search Results */}
          {!loading &&
            !error &&
            courseId &&
            totalStudents > 0 &&
            searchTerm &&
            filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-4xl mb-4">🔍</div>
                <p className="text-gray-500 text-lg">
                  No students found matching "{searchTerm}"
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 text-blue-500 hover:text-blue-700 text-sm"
                >
                  Clear search
                </button>
              </div>
            )}

          {/* Students Grid/List */}
          {!loading && !error && filteredStudents.length > 0 && (
            <div className="space-y-6">
              {/* Search Results Info */}
              {searchTerm && (
                <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-blue-700">
                      Found {filteredStudents.length} student
                      {filteredStudents.length !== 1 ? "s" : ""} matching "
                      {searchTerm}"
                    </p>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Clear search
                    </button>
                  </div>
                </div>
              )}

              {/* Pagination Info */}
              {!searchTerm && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      Showing {totalStudents} of {pagination.totalCount}{" "}
                      students
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-500">
                        Live updates
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Students Cards */}
              <div className="space-y-4">
                {filteredStudents.map((course, index) => {
                  if (!course.student) return null;

                  return (
                    <div
                      key={`${course.student.id}-${index}`}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        {/* Profile Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={
                              course.student.profileImage ||
                              "/default-avatar.png"
                            }
                            className="w-16 h-16 rounded-full object-cover border-3 border-gray-200 shadow-sm"
                            alt={`${course.student.name}'s profile`}
                            onError={(e) => {
                              e.currentTarget.src = "/default-avatar.png";
                            }}
                          />
                        </div>

                        {/* Student Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {course.student.name}
                            </h3>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {course.student.role}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-1">
                            @{course.student.username}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            {course.student.email}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            Enrolled on {formatDate(course.enrolledAt || "")}
                          </div>
                        </div>

                        {/* Action Menu */}
                        <div className="flex-shrink-0">
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Loading More Indicator - only show if not searching */}
              {!searchTerm && loadingMore && (
                <div className="flex justify-center items-center py-8">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">
                      Loading more students...
                    </span>
                  </div>
                </div>
              )}

              {/* End of Results - only show if not searching */}
              {!searchTerm && !pagination.hasNext && totalStudents > 0 && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center space-x-2 text-gray-500">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm">
                      You've reached the end of the list
                    </span>
                  </div>
                </div>
              )}

              {/* Infinite scroll target - only active when not searching */}
              {!searchTerm && <div ref={observerTarget} className="h-1"></div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
