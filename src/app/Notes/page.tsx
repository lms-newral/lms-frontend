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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = useSelector((state: { user: UserState }) => state.user);
  const courseId = user.selectedCourse?.courseId;

  useEffect(() => {
    async function getData() {
      if (!courseId) {
        setError("No course selected");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const resp = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}notes/course/${courseId}`
        );

        // Handle the case where resp.data might be empty or null
        setArrayData(resp.data || []);
        console.log(resp.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            // Handle 404 - no notes found
            setArrayData([]);
          } else {
            setError(
              `Failed to load notes: ${
                error.response?.data?.message || error.message
              }`
            );
          }
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, [courseId]); // Added courseId as dependency

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading notes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!user.selectedCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <h2 className="text-xl font-semibold mb-2">No Course Selected</h2>
          <p>Please select a course to view notes.</p>
        </div>
      </div>
    );
  }

  if (arrayData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <h2 className="text-xl font-semibold mb-2">No Notes Found</h2>
          <p>There are no notes available for this course yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Course Notes</h1>

      {/* Map over the whole course data first to get the notes according to class */}
      {arrayData.map((value: Data, index: number) => {
        return (
          <div
            key={index}
            className="flex flex-col mt-2 items-center px-2 pt-4 border-y"
          >
            <h2 className="md:text-3xl text-xl font-semibold mb-4">
              {value.title}
            </h2>

            {/* Now mapping over each note in a class */}
            {value.notes && value.notes.length > 0 ? (
              <div className="w-full max-w-4xl">
                {value.notes.map((note: Notes, index2: number) => {
                  return (
                    <div key={note.id || index2} className="mb-6">
                      <NotesCard
                        notesId={note.id}
                        htmlContent={note.notesHtml}
                      />
                      <div className="mb-2 text-sm text-gray-500 text-center mt-2">
                        Created: {new Date(note.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                <p>No notes available for this class.</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
