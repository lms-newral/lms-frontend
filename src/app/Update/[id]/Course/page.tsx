'use client';
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { FaBookOpen, FaAlignLeft, FaImage } from "react-icons/fa";
import { UserState } from "@/types/userstate";
import { Course } from "@/types/DataTypes";

const UpdateCoursePage = () => {
    const user = useSelector((state: { user: UserState }) => state.user);
    const { id: courseId } = useParams<{ id: string }>();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [cloudinaryImageUrl, setCloudinaryImageUrl] = useState<string>("");
    const [fileName, setFileName] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_THUMBNAIL;

    useEffect(() => {
        if (!courseId) return;

        const fetchCourse = async () => {
            try {
                const { data }: { data: Course } = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}course/getCourseById/${courseId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${user.accessToken}`,
                        },
                    }
                );

                setTitle(data.title);
                setDescription(data.description ?? " ");
                setThumbnail(data.thumbnail ?? " ");
                setCloudinaryImageUrl(data.thumbnail ?? " ");
                setFileName("Current Image");
            } catch (err) {
                toast.error("Failed to fetch course details.");
                console.error(err);
            }
        };

        fetchCourse();
    }, [courseId, user]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be less than 5MB.");
            return;
        }

        setThumbnail(URL.createObjectURL(file));
        setFileName(file.name);
        setUploadingImage(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET || "");

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const result = await res.json();
            setCloudinaryImageUrl(result.secure_url);
            toast.success("Image uploaded successfully.");
        } catch (error) {
            toast.error("Image upload failed.");
            setThumbnail("");
            setFileName("");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !cloudinaryImageUrl) {
            toast.error("Title and Thumbnail are required.");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                title,
                description,
                thumbnail: cloudinaryImageUrl,
            };

            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}course/update/${courseId}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.status === 200) {
                toast.success("Course updated successfully.");
            } else {
                toast.error("Failed to update course.");
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Update failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
            <form
                onSubmit={handleUpdate}
                className="bg-white shadow-lg w-full max-w-xl sm:max-w-2xl lg:max-w-4xl p-4 sm:p-6 rounded-xl"
            >
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Update Course
                </h2>

                <div className="mb-4">
                    <label className="mb-1 font-medium flex items-center gap-2">
                        <FaBookOpen className="text-blue-600" />
                        Course Title*
                    </label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded bg-gray-100"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Course Title"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="mb-1 font-medium flex items-center gap-2">
                        <FaAlignLeft className="text-blue-600" />
                        Description*
                    </label>
                    <textarea
                        className="w-full border p-2 rounded bg-gray-100"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Course Description"
                        rows={3}
                    ></textarea>
                </div>

                <div className="mb-4">
                    <label className="mb-1 font-medium flex items-center gap-2">
                        <FaImage className="text-blue-600" />
                        Thumbnail Image*
                    </label>

                    {thumbnail ? (
                        <div
                            onClick={handleBrowseClick}
                            className="w-full h-52 rounded-md border overflow-hidden cursor-pointer relative"
                        >
                            <img
                                src={thumbnail}
                                alt="Thumbnail Preview"
                                className="w-full h-full object-cover hover:opacity-90 transition"
                            />
                            {uploadingImage && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                    <div className="text-white text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                                        <p>Uploading...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div
                            onClick={handleBrowseClick}
                            className="border-2 border-dashed border-blue-600 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition"
                        >
                            <FaImage className="mx-auto text-3xl text-gray-300 mb-2" />
                            <p className="text-gray-600 font-medium">Browse image to upload</p>
                        </div>
                    )}

                    <input
                        type="text"
                        value={fileName}
                        placeholder="No file selected"
                        readOnly
                        className="mt-2 w-full border p-2 rounded-md bg-gray-100 text-sm"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || uploadingImage || !cloudinaryImageUrl}
                    className="w-full bg-green-600 rounded-lg text-white py-2 hover:bg-green-700 disabled:opacity-50"
                >
                    {loading
                        ? "Updating..."
                        : uploadingImage
                            ? "Uploading Image..."
                            : "Update Course"}
                </button>
            </form>
        </div>
    );
};

export default UpdateCoursePage;
