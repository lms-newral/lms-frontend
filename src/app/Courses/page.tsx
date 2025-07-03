"use client";
import CourseCard from "@/components/Courses/CourseCard";
import { setCourseWithPersistence } from "@/store/slices/userSlice";
import { Course } from "@/types/DataTypes";

import { UserState } from "@/types/userstate";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

interface CourseEnrollment {
  course: Course;
}

export default function CoursesPage() {
  const [data, setData] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state: { user: UserState }) => state.user.user);

  function handleCourseSelectionSimple(courseId: string) {
    dispatch(setCourseWithPersistence(courseId));
    localStorage.setItem("courseId", courseId);
  }

  useEffect(() => {
    async function getCourses() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}course-enrollment/courses/${user.id}`;
        const response = await axios.get(url);

        if (response.data.length === 0) {
          console.log("no data found");
          toast.error("You are not enrolled in any course");
          setData([]);
          return;
        }

        setData(response.data);
      } catch (error: any) {
        console.log(error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message || "Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    }

    getCourses();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col p-4 md:p-6 items-center justify-center">
        <div>Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-4 lg:p-6 items-center">
      <div className="w-full max-w-7xl flex justify-center">
        {data.length === 0 ? (
          <div className="text-center py-8">
            <p>No courses found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-8 justify-items-center md:justify-items-stretch">
            {data.map((courseData, index) => {
              return (
                <Link
                  key={index}
                  href={`/Classes`}
                  className="w-full"
                  onClick={() =>
                    handleCourseSelectionSimple(courseData.course.id)
                  }
                >
                  <CourseCard
                    title={courseData.course.title}
                    description={courseData.course.description || ""}
                    thumbnailurl={courseData.course.thumbnail || ""}
                  />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
