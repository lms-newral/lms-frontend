"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Course } from "@/types/DataTypes";
import ConfirmDialog from "../DeleteDailog";

const AdminPanel = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    const handleDelete = async (courseId: string) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}course/${courseId}`);
            setCourses((prev) => prev.filter((course) => course.id !== courseId));
        } catch (err: any) {
            console.error("Failed to delete course:", err);
        }
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}course`);
                setCourses(res.data || []);
            } catch (err) {
                console.error("Error fetching courses:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="min-h-screen p-4 overflow-x-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-700 text-center mb-6">
                All Courses
            </h1>

            {loading ? (
                <div className="text-center text-gray-400">Loading courses...</div>
            ) : courses.length === 0 ? (
                <div className="text-center text-gray-400">No courses found.</div>
            ) : (
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm sm:text-base">
                        <thead className="bg-gray-100 text-blue-700 font-semibold">
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
                            {courses.map((course) => (
                                <tr
                                    key={course.id}
                                    className="border-t border-gray-200 hover:bg-blue-50 transition"
                                >
                                    <td className="py-2 px-4 whitespace-nowrap">
                                        {course.createdAt
                                            ? new Date(course.createdAt).toLocaleDateString()
                                            : "N/A"}
                                    </td>
                                    <td className="py-2 px-4">
                                        {course.thumbnail ? (
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="h-12 w-24 object-cover rounded-md"
                                            />
                                        ) : (
                                            <span className="text-gray-500">No image</span>
                                        )}
                                    </td>
                                    <td className="py-2 px-4">{course.title}</td>
                                    <td className="py-2 px-4 break-words">{course?.creatorId || "Unknown"}</td>
                                    <td className="py-2 px-4">
                                        <ConfirmDialog
                                            trigger={
                                                <button className="text-red-500 hover:underline font-medium">
                                                    Delete
                                                </button>
                                            }
                                            title="Delete Course?"
                                            description="Are you sure you want to delete this course? This action cannot be undone."
                                            confirmText="Yes, Delete"
                                            cancelText="Cancel"
                                            onConfirm={() => handleDelete(course.id)}
                                        />
                                    </td>
                                    <td className="py-2 px-4">
                                        <button className="text-green-500 hover:underline font-medium">
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
