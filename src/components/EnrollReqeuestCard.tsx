"use client";
import axios from "axios";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
interface propsData {
  id: string;
  student: { username: string; profileImage: string };
  course: { title: string; thumbnail: string };
}
export default function EnrollReqCard(props: propsData) {
  const router = useRouter();
  async function handleAccept() {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}request-enrollment/accept/${props.id}`
      );
      toast.success(response.data.message);
      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }
  async function handleReject() {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}request-enrollment/reject/${props.id}`
      );
      toast.error(response.data.message);
      router.refresh();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }
  return (
    <div className="h-full shadow-lg flex flex-col sm:flex-row w-full p-4 gap-4 items-start sm:items-center">
      {/* User Profile Picture */}
      <img
        src={props.student.profileImage}
        alt="student profile"
        className="w-12 h-12 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
      />

      {/* Request Text */}
      <div className="flex-1 text-sm sm:text-base">
        Request from{" "}
        <span className="font-semibold">{props.student.username}</span> for{" "}
        <span className="font-semibold">{props.course.title}</span>
      </div>

      {/* Course Thumbnail */}
      <img
        src={props.course.thumbnail}
        alt="Course thumbnail"
        className="w-20 h-12 sm:w-12 sm:h-9 rounded object-cover flex-shrink-0"
      />

      {/* Action Buttons */}
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={handleAccept}
          className="p-2 hover:bg-green-50 rounded-full transition-colors"
        >
          <Check className="text-green-500 w-5 h-5" />
        </button>
        <button
          onClick={handleReject}
          className="p-2 hover:bg-red-50 rounded-full transition-colors"
        >
          <X className="text-red-500 w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
