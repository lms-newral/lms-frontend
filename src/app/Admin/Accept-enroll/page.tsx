"use client";
import EnrollReqCard from "@/components/EnrollReqeuestCard";
import axios from "axios";
import { useEffect, useState } from "react";

interface Data {
  id: string;
  student: { username: string; profileImage: string };
  course: { title: string; thumbnail: string };
}
export default function AcceptEnroll() {
  const [data, setData] = useState<Data[]>([]);
  useEffect(() => {
    async function getData() {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}request-enrollment`
      );
      setData(response.data);
      console.log(response.data);
    }
    getData();
  }, []);

  return (
    <div>
      <div className="pt-8">
        {data.map((reqdata) => {
          return (
            <EnrollReqCard
              key={reqdata.id}
              id={reqdata.id}
              student={reqdata.student}
              course={reqdata.course}
            />
          );
        })}
      </div>
    </div>
  );
}
