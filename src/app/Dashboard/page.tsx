"use client";
import DashboardContent from "@/components/Dashboard/DashboardContent";
import { Classes, Course, CourseEnrollment } from "@/types/DataTypes";
import { UserState } from "@/types/userstate";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function Dashboard() {
  const [classes, setClasses] = useState<Classes[]>([]);
  const [courses, setCourses] = useState<CourseEnrollment[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course>();
  const user = useSelector((state: { user: UserState }) => state.user);

  useEffect(() => {
    //to get the courses data
    async function getEnrolledCourses() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}course-enrollment/courses/${user.user?.id}`
        );
        //to get the classes in enrolled courses data
        setCourses(response.data);

        const resp = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}class/all/${user.selectedCourse?.courseId}`,
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }
        );

        setClasses(resp.data);
      } catch (error: any) {
        toast.error(
          error.response.data.message || "No enrolled courses found "
        );
      }
    }

    //to get the currrently selected course data
    async function getCourseById() {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}course/getCourseById/${user.selectedCourse?.courseId}`
      );
      setSelectedCourse(response.data);
    }
    getEnrolledCourses();
    getCourseById();
  }, []);

  return (
    <div>
      <DashboardContent
        user={{ name: user.user?.username ?? "" }}
        classes={classes}
        courses={courses}
        selectedCourse={
          selectedCourse ?? { id: "", title: "", thumbnail: "", creatorId: "" }
        }
      />
    </div>
  );
}
