"use client";
import ClassCard from "@/components/Classes/ClassCard";
import { UserState } from "@/types/userstate";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Classes } from "@/types/DataTypes";
interface ClassData extends Classes {
  isClient: boolean;
}
export default function Class() {
  const course = useSelector(
    (state: { user: UserState }) => state.user.selectedCourse
  );
  const token = useSelector(
    (state: { user: UserState }) => state.user.accessToken
  );

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  async function getClasses() {
    console.log(course);
    if (!course?.courseId) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}class/all/${course.courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
      setClasses(response.data);
    } catch (err) {
      setError("Failed to load classes");
      console.error("Error fetching classes:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    getClasses();
  }, [course?.courseId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p>{error}</p>
        <button
          onClick={getClasses}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>No classes found for this course.</p>
      </div>
    );
  }
  //this page is not finished yet
  return (
    <div className="min-h-screen flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-8 justify-items-center md:justify-items-stretch">
        {classes.map((classItem) => (
          <div key={classItem.id}>
            <ClassCard
              isClient={isClient}
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
  );
}
