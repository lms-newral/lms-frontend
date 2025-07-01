'use client';

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BookOpen, Video, VideoOff, Link2, NotebookPen } from "lucide-react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import axios from "axios";
import { useSelector } from "react-redux";

const dummyCourses = [
    { id: "1", name: "xyz" },
    { id: "2", name: "abc" },
    { id: "3", name: "pqr" },
];

const Classes = () => {
    const [title, setTitle] = useState("");
    const [liveLink, setLiveLink] = useState("");
    const [recordedLink, setRecordedLink] = useState("");
    const [courseId, setCourseId] = useState("");
    const token = useSelector((state: any) => state.user.accesstoken);

    useEffect(() => {
        if (!token) {
            toast.error('user is not authenticated');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !courseId) {
            toast.error("Please fill in title and select a course.");
            return;
        }

        if ((liveLink && recordedLink) || (!liveLink && !recordedLink)) {
            toast.error("Please fill either Live Link or Recorded Link (not both).");
            return;
        }

        const classData = {
            title,
            videoLink: recordedLink || "",
            zoomLink: liveLink || "",
            isLive: !!liveLink,
            isRecorded: !!recordedLink,
        };

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/class/create/${courseId}`, // ✅ Fixed endpoint structure
                classData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.status === 201 || res.status === 200) {
                toast.success("Class created successfully!");
                setTitle("");
                setLiveLink("");
                setRecordedLink("");
                setCourseId("");
            }
        } catch (error: any) {
            console.error("Error creating class:", error);
            toast.error(error.response?.data?.message || "Failed to create class.");
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <NotebookPen className="w-5 h-5 text-blue-600" />
                Create a Class
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 flex items-center gap-1">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        Title
                    </label>
                    <input
                        type="text"
                        className="mt-1 w-full border rounded-lg p-2 bg-gray-100"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                {/* Live Link */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 flex items-center gap-1">
                        <Link2 className="w-4 h-4 text-blue-600" />
                        Live Class Link (Zoom, Meet etc)
                    </label>
                    <input
                        type="url"
                        className="mt-1 w-full border rounded-lg p-2 bg-gray-100 text-gray-700  "
                        value={liveLink}
                        onChange={(e) => setLiveLink(e.target.value)}
                        placeholder="https://meet.google.com/..."
                        disabled={!!recordedLink}
                    />
                </div>

                {/* Recorded Link */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 flex items-center gap-1">
                        <Video className="w-4 h-4 text-blue-600" />
                        Recorded Video Link
                    </label>
                    <input
                        type="url"
                        className="mt-1 w-full border rounded-lg p-2 bg-gray-100 text-gray-700"
                        value={recordedLink}
                        onChange={(e) => setRecordedLink(e.target.value)}
                        placeholder="https://youtube.com/..."
                        disabled={!!liveLink}
                    />
                </div>

                {/* Course Dropdown */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <VideoOff className="w-4 h-4 text-blue-600" />
                        Select Course
                    </label>

                    <Select
                        value={courseId}
                        onValueChange={(value) => setCourseId(value)}
                        required
                    >
                        <SelectTrigger className="w-full bg-gray-100 text-gray-700">
                            <SelectValue placeholder="-- Select a course --" />
                        </SelectTrigger>
                        <SelectContent>
                            {dummyCourses.map((course) => (
                                <SelectItem key={course.id} value={course.id}>
                                    {course.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Submit */}
                <div className="text-right">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-150"
                    >
                        Create Class
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Classes;
