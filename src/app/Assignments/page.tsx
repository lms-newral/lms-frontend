"use client";
import { UserState } from "@/types/userstate";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface Data {
  assignments: Assignment[];
  title: string;
}

interface Assignment {
  id: string;
  createdAt: string;
  assignments: string;
}

export default function AssignmentPage() {
  const [arrayData, setArrayData] = useState<Data[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const course = useSelector(
    (state: { user: UserState }) => state.user.selectedCourse
  );

  useEffect(() => {
    async function getAssignmentData() {
      if (!course?.courseId) {
        setError("No course selected");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}assignment/course/${course.courseId}`
        );

        // Handle the case where res.data might be empty or null
        setArrayData(res.data || []);
      } catch (error) {
        console.error("Error fetching assignments:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            // Handle 404 - no assignments found
            setArrayData([]);
          } else {
            setError(
              `Failed to load assignments: ${
                error.response?.data?.message || error.message
              }`
            );
          }
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    getAssignmentData();
  }, [course?.courseId]); // Added dependency

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading assignments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <h2 className="text-xl font-semibold mb-2">No Course Selected</h2>
          <p>Please select a course to view assignments.</p>
        </div>
      </div>
    );
  }

  if (arrayData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <h2 className="text-xl font-semibold mb-2">No Assignments Found</h2>
          <p>There are no assignments available for this course yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Course Assignments
      </h1>
      {arrayData.map((value: Data, index: number) => {
        return (
          <div
            key={index}
            className="flex flex-col mt-2 items-center px-2 pt-4 border-y"
          >
            <h2 className="md:text-3xl text-xl font-semibold mb-4">
              {value.title}
            </h2>

            {value.assignments && value.assignments.length > 0 ? (
              <div className="w-full max-w-4xl">
                {value.assignments.map(
                  (assignment: Assignment, index2: number) => {
                    return (
                      <div key={assignment.id || index2} className="mb-6">
                        <div className="mb-4 p-4 shadow border bg-white rounded-lg">
                          <div className="mb-2 text-sm text-gray-500">
                            Assignment #{index2 + 1}
                          </div>
                          <div className="text-gray-800 whitespace-pre-wrap">
                            {assignment.assignments}
                          </div>
                          <div className="mt-3 text-sm text-gray-500">
                            Created:{" "}
                            {new Date(
                              assignment.createdAt
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                <p>No assignments available for this class.</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
