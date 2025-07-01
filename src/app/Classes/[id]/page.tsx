"use client";
import ClassPageComponent from "@/components/Classes/ClassPage";
import { UserState } from "@/types/userstate";
import axios from "axios";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
interface ClassData {
  id: string;
  title: string;
  courseId: string;
  creatorId: string;
  attendanceCount: number;
  isLive: boolean;
  videoLink?: string;
  isRecorded: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  zoomLink?: string;
}

export default function ClassPage() {
  const [notes, setNotes] = useState([]);
  const [assignments, setAssignment] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [classes, setClasses] = useState<ClassData>();

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);
  const params = useParams();

  const user = useSelector((state: { user: UserState }) => state.user);
  useEffect(() => {
    async function getClassData() {
      try {
        setLoading(true);
        const classResp = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}class/single/${params.id}`,
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }
        );
        setClasses(classResp.data);

        setLoading(true);
        const resp = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}notes/class/${params.id}`,
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }
        );
        // API returns an array of note objects
        setNotes(resp.data || []);

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}assignment/class/${params.id}`,
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }
        );
        setAssignment(res.data);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}attachment/class/${params.id}`,
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }
        );
        setAttachments(response.data);
      } catch (err) {
        setError("Failed to fetch class data");
        console.error("Error fetching class data:", err);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      getClassData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <p>Loading class data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 ">
      <div>
        <ClassPageComponent
          NotesData={notes || ""}
          Assignments={assignments || ""}
          Attachments={attachments || ""}
          meetLink={classes?.zoomLink}
          videoLink={classes?.videoLink}
          createdAt={classes?.createdAt}
        />
      </div>
    </div>
  );
}
