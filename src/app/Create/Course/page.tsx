"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FaBookOpen, FaAlignLeft, FaImage } from "react-icons/fa";
import { useRef } from "react";

export default function CreateCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setImageFile(file);
    setThumbnail(URL.createObjectURL(file));
    setFileName(file.name);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !imageFile) {
      toast.error("Title and Thumbnail are required.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("thumbnail", imageFile);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/create/course`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status == 200) {
        toast.success("Course created successfully!");
      } else {
        toast.error(response.status || "Failed to create course");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-6 rounded-lg w-full max-w-4xl"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Create a New Course
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
            placeholder="Enter course title"
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
            placeholder="Enter course description"
            rows={3}
          ></textarea>
        </div>

        <div className="mb-4">
          <label className=" mb-1 font-medium flex items-center gap-2">
            <FaImage className="text-blue-600" />
            Upload Thumbnail Image*
          </label>

          {thumbnail ? (
            <div
              onClick={handleBrowseClick}
              className="w-full h-52 rounded-md border overflow-hidden cursor-pointer"
            >
              <img
                src={thumbnail}
                alt="Thumbnail Preview"
                className="w-full h-full object-cover hover:opacity-90 transition"
              />
            </div>
          ) : (
            <div
              onClick={handleBrowseClick}
              className="border-2 border-dashed border-blue-600 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition"
            >
              <FaImage className="mx-auto text-3xl text-gray-300 mb-2" />
              <p className="text-gray-600 font-medium">
                Browse image to upload
              </p>
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
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 rounded-lg text-white py-2  hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
}