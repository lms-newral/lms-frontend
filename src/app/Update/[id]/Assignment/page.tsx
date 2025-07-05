"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { UserState } from "@/types/userstate";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Assignment, Classes, Course } from "@/types/DataTypes";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function UpdateAssignment() {
  const router = useRouter();

  const user = useSelector((state: { user: UserState }) => state.user);

  const [courseTitle, setCourseTitle] = useState("");
  const [classTitle, setClassTitle] = useState("");

  const [courseId, setCourseId] = useState("");
  const [classId, setClassId] = useState("");

  const [assignment, setAssignment] = useState<string>("");
  const [loadingAssignment, setLoadingAssignment] = useState(true);

  const { id: assignmentId } = useParams<{ id: string }>();

  useEffect(() => {
    if (!assignmentId) return;

    async function fetchAssignment() {
      try {
        setLoadingAssignment(true);
        const { data }: { data: Assignment } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}assignment/getAssignmentById/${assignmentId}`,
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }
        );
        console.log(data);
        setCourseId(data.courseId);
        setClassId(data.classId);

        setAssignment(data.assignments);
      } catch (err) {
        console.error("Failed to fetch attachemnt:", err);
      } finally {
        setLoadingAssignment(false);
      }
    }

    fetchAssignment();
  }, [assignmentId, user]);

  // class titles once their IDs are known
  useEffect(() => {
    if (!courseId && !classId) return;

    const fetchMeta = async () => {
      try {
        if (courseId) {
          const { data }: { data: Course } = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}course/getCourseById/${courseId}`,
            {
              headers: { Authorization: `Bearer ${user.accessToken}` },
            }
          );
          setCourseTitle(data.title);
        }

        if (classId) {
          const { data }: { data: Classes } = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}class/single/${classId}`,
            {
              headers: { Authorization: `Bearer ${user.accessToken}` },
            }
          );
          setClassTitle(data.title);
        }
      } catch (err) {
        console.error("Failed to fetch course/class meta:", err);
      }
    };

    fetchMeta();
  }, [courseId, classId, user]);

  //Update handler
  async function handleUploadAssignment() {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}assignment/update/${assignmentId} `,
        { assignment },
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );
      toast.success("assignment updated successfully!");
      router.push("/Classes");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response.data.message);
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-xl bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-xl font-semibold text-gray-800">
        📝 Update Assignment
      </h1>

      {/* Course & Class titles (read‑only) */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Course
        </label>
        <p className="mt-1 rounded-lg border border-gray-300 p-2 text-sm">
          {courseTitle || "—"}
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Class</label>
        <p className="mt-1 rounded-lg border border-gray-300 p-2 text-sm">
          {classTitle || "—"}
        </p>
      </div>

      {/* Editor */}
      <div className=" ">
        {loadingAssignment ? (
          <p className="text-sm text-gray-500">Loading Assignment...</p>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Assignment
            </label>
            <Input
              value={assignment}
              onChange={(e) => {
                setAssignment(e.target.value);
              }}
              className="border border-gray-300"
            />
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="mt-4 text-right">
        <button
          onClick={handleUploadAssignment}
          disabled={loadingAssignment}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white enabled:hover:bg-blue-700 disabled:opacity-50"
        >
          Update Assignment
        </button>
      </div>
    </div>
  );
}
