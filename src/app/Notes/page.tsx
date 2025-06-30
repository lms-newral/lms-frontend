"use client";
import NotesCard from "@/components/Classes/NotesCard";
import { UserState } from "@/types/userstate";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface Data {
  notes: Notes[];
  title: string;
}
interface Notes {
  id: string;
  createdAt: string;
  notesHtml: string;
}

export default function NotesPage() {
  const [arrayData, setArrayData] = useState<Data[]>([]);
  const courseid = useSelector((state: { user: UserState }) => state.user);
  useEffect(() => {
    async function getData() {
      const resp = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}notes/course/${courseid.selectedCourse?.courseId}`
      );
      setArrayData(resp.data);
      console.log(resp.data);
    }
    getData();
  }, []);
  return (
    <div className="min-h-screen">
      {/* map over the whole course data first to get the notes acc the class  */}
      {arrayData.map((value: Data, index: number) => {
        return (
          <div
            key={index}
            className="flex flex-col mt-2 items-center px-2 pt-4 border-y"
          >
            <h2 className="md:text-3xl text-xl font-semibold">{value.title}</h2>
            {/* now mapping over each notes in a class  */}
            {value.notes.map((note: Notes, index2: number) => {
              return (
                <div key={index2}>
                  <NotesCard notesId={note.id} htmlContent={note.notesHtml} />
                  <div className="mb-2 text-sm text-gray-500">
                    Created: {new Date(note.createdAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
      <div></div>
    </div>
  );
}
