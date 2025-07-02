"use client";
import DashboardContent from "@/components/Dashboard/DashboardContent";
import { UserState } from "@/types/userstate";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface Course {
  course: {
    id: string;
    title: string;
    _count: { classes: number }; //number of classes in a course
  };
}

interface Classes {
  id: string;
  title: string;
  course: {
    title: string;
  }; // course which this class belongs to
  createdAt: string;
  isLive: boolean;
  isRecorded: boolean;
  scheduledAt: string;
}
interface SelectedCourse {
  title: string;
  thumbnail: string;
}
export default function Dashboard() {
  const [classes, setClasses] = useState<Classes[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<SelectedCourse>();
  const user = useSelector((state: { user: UserState }) => state.user);

  useEffect(() => {
    //to get the courses data
    async function getEnrolledCourses() {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}course-enrollment/courses/${user.user?.id}`
      );
      setCourses(response.data);
    }
    //to get the classes in enrolled courses data
    async function getClassesInCourses() {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}class/all/${user.selectedCourse?.courseId}`,
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );

      console.log(response.data);
      setClasses(response.data);
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
    getClassesInCourses();
  }, []);

  return (
    <div>
      <DashboardContent
        user={{ name: user.user?.username ?? "" }}
        classes={classes}
        courses={courses}
        selectedCourse={selectedCourse ?? { title: "", thumbnail: "" }}
      />
    </div>
  );
}
