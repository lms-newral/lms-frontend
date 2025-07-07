"use client";

import axios from "axios";
import { useEffect } from "react";
import { toast } from "sonner";

interface props {
  courseId: string;
}
export default function SingleCoursePage(props: props) {
  async function getCourseDetails() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}course/getCourseById/${props.courseId}`
      );
      console.log(response.data);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }
  useEffect(() => {
    getCourseDetails();
  }, []);
  console.log(props.courseId);
  return (
    <div className="min-h-screen">
      <div>{props.courseId}</div>
    </div>
  );
}
