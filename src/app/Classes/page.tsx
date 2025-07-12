"use client";
import ClassCard from "@/components/Classes/ClassCard";
import { UserState } from "@/types/userstate";
import axios from "axios";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { Classes, PaginationData } from "@/types/DataTypes";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Class() {
  const course = useSelector(
    (state: { user: UserState }) => state.user.selectedCourse
  );
  const token = useSelector(
    (state: { user: UserState }) => state.user.accessToken
  );

  const [classes, setClasses] = useState<Classes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationData>({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
    hasNext: false,
    hasPrevious: false,
  });

  const getClasses = useCallback(
    async (page: number = 1, pageLimit: number = 10) => {
      if (!course?.courseId) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}class/all/${course.courseId}?page=${page}&limit=${pageLimit}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);
        setClasses(response.data.data);
        setPagination(response.data.pagination);
        setCurrentPage(page);
      } catch (err) {
        setError("Failed to load classes");
        console.error("Error fetching classes:", err);
      } finally {
        setLoading(false);
      }
    },
    [course, token]
  );

  useEffect(() => {
    getClasses(currentPage, limit);
  }, [getClasses, currentPage, limit]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
    }
  };

  const handleLimitChange = (newLimit: string) => {
    setLimit(parseInt(newLimit));
    setCurrentPage(1); // Reset to first page when changing limit
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading classes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="text-center p-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            onClick={() => getClasses(currentPage, limit)}
            variant="outline"
            className="hover:bg-blue-50"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (classes.length === 0 && !loading) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="text-center p-8">
          <p className="text-gray-500">No classes found for this course.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center md:justify-items-stretch">
          {classes.map((classItem) => (
            <div key={classItem.id}>
              <ClassCard
                id={classItem.id}
                title={classItem.title}
                videoLink={classItem.videoLink}
                zoomLink={classItem.zoomLink || ""}
                attachments={classItem.attachments}
                courseId={classItem.courseId}
                creatorId={classItem.creatorId}
                attendanceCount={classItem.attendanceCount}
                isLive={classItem.isLive}
                isRecorded={classItem.isRecorded}
                isActive={classItem.isActive}
                createdAt={classItem.createdAt}
                updatedAt={classItem.updatedAt}
                description={classItem.description}
                notes={classItem.notes}
                assignments={classItem.assignments}
                course={classItem.course}
                creator={classItem.creator}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls - exactly like the image */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 mt-8">
          {/* Page Numbers */}
          {Array.from(
            { length: Math.min(5, pagination.totalPages) },
            (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else {
                if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
              }

              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 p-0 rounded-sm ${
                    pageNum === currentPage
                      ? "bg-gray-800 text-white hover:bg-gray-700"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </Button>
              );
            }
          )}

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNext}
            className="ml-2 px-3 py-1 text-sm bg-white text-gray-600 border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
