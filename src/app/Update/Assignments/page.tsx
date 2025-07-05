"use client";
import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import axios from "axios";

interface Course {
    id: string;
    title: string;
    classes: { id: string; title: string; description: string }[];
}

export default function UpdateAssignment() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [selectedClassId, setSelectedClassId] = useState("");
    const [assignments, setAssignments] = useState<string[]>([]);
    const [assignmentInput, setAssignmentInput] = useState("");

    // Fetch all courses and their classes
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}courses`);
                const data: Course[] = res.data;
                setCourses(data);

                if (data.length > 0) {
                    setSelectedCourseId(data[0].id);
                    setSelectedClassId(data[0].classes[0]?.id || "");
                }
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };

        fetchCourses();
    }, []);

    const selectedCourse = courses.find((c) => c.id === selectedCourseId);
    const selectedClass = selectedCourse?.classes.find((cls) => cls.id === selectedClassId);

    // Fetch assignments when class changes
    useEffect(() => {
        const fetchAssignments = async () => {
            if (!selectedClassId) return;
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}assignments/${selectedClassId}`);
                setAssignments(res.data.assignments);
            } catch (err) {
                console.error("Error fetching assignments:", err);
                setAssignments([]);
            }
        };

        fetchAssignments();
    }, [selectedClassId]);


    const handleUpdateAssignments = async () => {
        if (!selectedClassId) return;
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}assignments/${selectedClassId}`, {
                assignments,
            });
            alert("Assignments updated successfully!");
        } catch (err) {
            alert("Failed to update assignments.");
            console.error(err);
        }
    };

    return (
        <div className="mx-auto mt-10 max-w-3xl rounded-xl bg-white p-6 shadow-sm">
            <h1 className="mb-6 text-xl font-semibold text-gray-800">📋 Update Assignments</h1>

            {/* Course Selector */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Select Course</label>
                <select
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm"
                    value={selectedCourseId}
                    onChange={(e) => {
                        const newCourseId = e.target.value;
                        setSelectedCourseId(newCourseId);
                        const firstClassId =
                            courses.find((c) => c.id === newCourseId)?.classes?.[0]?.id || "";
                        setSelectedClassId(firstClassId);
                    }}
                >
                    {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                            {course.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Class Selector */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Select Class</label>
                <select
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm"
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                >
                    {selectedCourse?.classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                            {cls.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Assignment Input */}
            <div>
                <label className="mb-1 block text-sm font-medium">
                    <ClipboardList className="mr-1 inline h-4 w-4 text-blue-600" />
                    Assignments
                </label>
                <div className="mb-2 flex items-center gap-2">
                    <input
                        type="text"
                        className="flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        value={assignmentInput}
                        onChange={(e) => setAssignmentInput(e.target.value)}
                        placeholder="Enter assignment details"
                    />
                    <button
                        type="button"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                        onClick={() => {
                            if (assignmentInput.trim()) {
                                setAssignments((p) => [...p, assignmentInput.trim()]);
                                setAssignmentInput("");
                            }
                        }}
                    >
                        Add
                    </button>
                </div>

                {/* Assignment List */}
                <ul className="list-decimal space-y-1 pl-5 text-sm text-gray-600">
                    {assignments.map((a, i) => (
                        <li key={i}>{a}</li>
                    ))}
                </ul>
            </div>

            <div className="mt-6 text-right">
                <button
                    onClick={handleUpdateAssignments}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                    Update Assignments
                </button>
            </div>
        </div>
    );
}
