import axios from "axios";
import { Course } from "@/types/DataTypes";
import ConfirmDialog from "../DeleteDailog";
import { Edit2, Trash } from "lucide-react";

interface courseParam {
  course: Course;
}

export default function AdminPanel(param: courseParam) {
  async function handleDelete() {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}course/${param.course.id}`
      );
    } catch (err: any) {
      console.error("Failed to delete course:", err);
    }
  }

  return (
    <tr
      key={param.course.id}
      className="border-t border-gray-200 hover:bg-blue-50 transition"
    >
      <td className="py-2 px-4 whitespace-nowrap">
        {param.course.createdAt
          ? new Date(param.course.createdAt).toLocaleDateString()
          : "N/A"}
      </td>
      <td className="py-2 px-4">
        {param.course.thumbnail ? (
          <img
            src={param.course.thumbnail}
            alt={param.course.title}
            className="h-12 w-24 object-cover rounded-md"
          />
        ) : (
          <span className="text-gray-500">No image</span>
        )}
      </td>
      <td className="py-2 px-4">{param.course.title}</td>
      <td className="py-2 px-4 ">{param.course.creator?.username}</td>
      <td className="py-2 px-4">
        <ConfirmDialog
          trigger={
            <button className="text-red-500  font-medium">
              <Trash />
            </button>
          }
          title="Delete Course?"
          description="Are you sure you want to delete this course? This action cannot be undone."
          confirmText="Yes, Delete"
          cancelText="Cancel"
          onConfirm={handleDelete}
        />
      </td>
      <td className="py-2 px-4">
        <button className="text-blue-500 hover:underline font-medium">
          <Edit2 />
        </button>
      </td>
    </tr>
  );
}
