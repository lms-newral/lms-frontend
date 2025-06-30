"use client";
import ClassCard from "@/components/Classes/ClassCard";
import { UserState } from "@/types/userstate";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Link from "next/link";
interface ClassData {
  _id: string;
  title: string;
  videoLink?: string;
  attachments: string;
  courseId: string;
  creatorId: string;
  attendanceCount: number;
  isLive: boolean;
  isRecorded: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  zoomLink?: string;
}

export default function Classes() {
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
    <div className="min-h-screen">
      <div>
        {classes.map((classItem) => (
          <Link
            key={classItem._id}
            href={classItem.videoLink || classItem.zoomLink || ""} // replace this with classPage link where we can show all the attachments notes and assignments of class
          >
            <ClassCard
              isClient={isClient}
              _id={classItem._id}
              title={classItem.title}
              videoLink={classItem.videoLink}
              attachments={classItem.attachments}
              courseId={classItem.courseId}
              creatorId={classItem.creatorId}
              attendanceCount={classItem.attendanceCount}
              isLive={classItem.isLive}
              isRecorded={classItem.isRecorded}
              isActive={classItem.isActive}
              createdAt={classItem.createdAt}
              updatedAt={classItem.updatedAt}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
