"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FaBookOpen, FaAlignLeft, FaImage } from "react-icons/fa";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { UserState } from "@/types/userstate";

export default function CreateCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [cloudinaryImageUrl, setCloudinaryImageUrl] = useState<string>("");

  const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_THUMBNAIL;
  const user = useSelector((state: { user: UserState }) => state.user);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    // Set preview and filename immediately
    setThumbnail(URL.createObjectURL(file));
    setFileName(file.name);
    setUploadingImage(true);

    try {
      // Upload to Cloudinary
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET || "");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setCloudinaryImageUrl(data.secure_url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
      // Clear the preview if upload fails
      setThumbnail("");
      setFileName("");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !cloudinaryImageUrl) {
      toast.error("Title and Thumbnail are required.");
      return;
    }

    if (uploadingImage) {
      toast.error("Please wait for the image to finish uploading.");
      return;
    }

    try {
      setLoading(true);

      const requestData = {
        title,
        description,
        thumbnail: cloudinaryImageUrl, // Send Cloudinary URL instead of file
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}course`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Course created successfully!");
        // Reset form
        setTitle("");
        setDescription("");
        setThumbnail("");
        setFileName("");
        setCloudinaryImageUrl("");
      } else {
        toast.error("Failed to create course");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg w-full max-w-xl sm:max-w-2xl lg:max-w-4xl p-4 sm:p-6 rounded-xl"
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
            className="w-full border p-2 rounded bg-gray-100 text-sm sm:text-base"
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
          <label className="mb-1 font-medium flex items-center gap-2">
            <FaImage className="text-blue-600" />
            Upload Thumbnail Image*
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
              className="border-2 border-dashed border-blue-600 rounded-md p-4 sm:p-6 text-center cursor-pointer hover:bg-gray-50 transition"

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
          disabled={loading || uploadingImage || !cloudinaryImageUrl}
          className="w-full bg-blue-600 rounded-lg text-white py-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Creating..."
            : uploadingImage
              ? "Uploading Image..."
              : "Create Course"}
        </button>
      </form>
    </div>
  );
}
