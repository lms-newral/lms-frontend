"use client";
import { useEffect, useState } from "react";
import { Paperclip } from "lucide-react";
import axios from "axios";

interface Course {
    id: string;
    title: string;
    classes: { id: string; title: string; description: string }[];
}

interface Attachment {
    name: string;
    url: string;
}

export default function UpdateAttachment() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [selectedClassId, setSelectedClassId] = useState("");
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const selectedCourse = courses.find((c) => c.id === selectedCourseId);
    const selectedClass = selectedCourse?.classes.find((cls) => cls.id === selectedClassId);

    // Fetch courses and classes
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
                console.error("Failed to fetch courses:", err);
            }
        };

        fetchCourses();
    }, []);

    // Fetch attachments
    useEffect(() => {
        const fetchAttachments = async () => {
            if (!selectedClassId) return;
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}attachment/${selectedClassId}`);
                setAttachments(res.data.attachments); // expecting: [{ name: '', url: '' }]
            } catch (err) {
                console.error("Failed to fetch attachments:", err);
            }
        };

        fetchAttachments();
    }, [selectedClassId]);

    const handleUpload = async () => {
        if (!file || !selectedClassId) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploading(true);
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}attachment/update/${selectedClassId}`, formData);
            alert("File uploaded successfully!");

            // Refresh attachments
            const res = await axios.get(`/api/attachments/${selectedClassId}`);
            setAttachments(res.data.attachments);
            setFile(null);
        } catch (err) {
            alert("Upload failed.");
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="mx-auto mt-10 max-w-3xl rounded-xl bg-white p-6 shadow-sm">
            <h1 className="mb-6 text-xl font-semibold text-gray-800">📎 Update Attachments</h1>

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
                            courses.find((c) => c.id === newCourseId)?.classes[0]?.id || "";
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

            {/* Upload File */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                    <Paperclip className="inline h-4 w-4 text-blue-600 mr-1" />
                    Upload Attachment
                </label>
                <input
                    type="file"
                    className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="mt-2 rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
                >
                    {uploading ? "Uploading..." : "Upload"}
                </button>
            </div>

            {/* Show Attachments */}
            <div className="mt-6 border-t pt-4">
                <h2 className="text-sm font-medium text-gray-800 mb-2">📂 Uploaded Attachments</h2>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {attachments.map((att, index) => (
                        <li key={index}>
                            <a
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                {att.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
