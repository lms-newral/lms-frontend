"use client";
import AdminPanel from "@/components/Admin/AdminPanel";
import { Course } from "@/types/DataTypes";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}course`
        );
        setCourses(res.data.data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);
  return (
    <div className="py-10">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6">
          All Courses
        </h1>

        <div className="max-w-7xl mx-auto overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm sm:text-base">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Updated</th>
                <th className="py-3 px-4">Thumbnail</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Creator</th>
                <th className="py-3 px-4">Delete</th>
                <th className="py-3 px-4">Edit</th>
              </tr>
            </thead>
            <tbody>
              {courses?.map((course) => {
                return <AdminPanel key={course.id} course={course} />;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
