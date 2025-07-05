"use client";
import EnrollReqCard from "@/components/EnrollReqeuestCard";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";

interface Student {
  username: string;
  profileImage: string;
}

interface Course {
  title: string;
  thumbnail: string;
}

interface EnrollmentRequest {
  id: string;
  student: Student;
  course: Course;
}

interface ApiResponse {
  data: EnrollmentRequest[];
  message?: string;
  success?: boolean;
}

export default function AcceptEnroll() {
  const [enrollmentRequests, setEnrollmentRequests] = useState<
    EnrollmentRequest[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollmentRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<ApiResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}request-enrollment`
      );

      if (response.data?.data) {
        setEnrollmentRequests(response.data.data);
      } else {
        setEnrollmentRequests(response.data as EnrollmentRequest[]);
      }
    } catch (err) {
      console.error("Failed to fetch enrollment requests:", err);
      setError("Failed to load enrollment requests. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnrollmentRequests();
  }, [fetchEnrollmentRequests]);

  if (loading) {
    return (
      <div className="pt-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
          <button
            onClick={fetchEnrollmentRequests}
            className="ml-4 px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-8">
      {enrollmentRequests.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No enrollment requests found</p>
          <p className="text-sm mt-2">Check back later for new requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {enrollmentRequests.map((request) => (
            <EnrollReqCard
              key={request.id}
              id={request.id}
              student={request.student}
              course={request.course}
            />
          ))}
        </div>
      )}
    </div>
  );
}
