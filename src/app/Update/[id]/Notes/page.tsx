"use client";

import { useEffect, useState } from "react";
import {
  StickyNote,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Underline } from "@tiptap/extension-underline";
import axios from "axios";
import { useParams } from "next/navigation";

import { Classes, Note } from "@/types/DataTypes";
import { useSelector } from "react-redux";
import { UserState } from "@/types/userstate";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  title: string;
}

export default function UpdateNotes() {
  const router = useRouter();

  const user = useSelector((state: { user: UserState }) => state.user);

  const [courseTitle, setCourseTitle] = useState("");
  const [classTitle, setClassTitle] = useState("");

  const [courseId, setCourseId] = useState("");
  const [classId, setClassId] = useState("");

  const [notesHtml, setNotesHtml] = useState("");
  const [loadingNotes, setLoadingNotes] = useState(true);

  const { id: notesId } = useParams<{ id: string }>();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "", // will be set later
    onUpdate: ({ editor }) => setNotesHtml(editor.getHTML()),
  });

  useEffect(() => {
    if (!notesId) return;

    const fetchNote = async () => {
      try {
        setLoadingNotes(true);
        const { data }: { data: Note } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}notes/getNoteById/${notesId}`,
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }
        );

        setCourseId(data.courseId);
        setClassId(data.classId);
        setNotesHtml(data.notesHtml);
      } catch (err) {
        console.error("Failed to fetch note:", err);
      } finally {
        setLoadingNotes(false);
      }
    };

    fetchNote();
  }, [notesId, user]);

  useEffect(() => {
    if (editor && notesHtml && editor.getHTML() !== notesHtml) {
      editor.commands.setContent(notesHtml, false);
    }
  }, [editor, notesHtml]);

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
  const handleUpdateNotes = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}notes/update/${notesId}`,
        { notesHtml },
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );
      toast.success("Notes updated successfully!");
      router.push("/Classes");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-xl bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-xl font-semibold text-gray-800">
        📝 Update Notes
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

      {/* Toolbar */}
      <div className="mb-2 text-sm font-medium text-gray-700">
        <div className="mb-1 flex items-center gap-1">
          <StickyNote className="h-4 w-4 text-blue-600" />
          Edit Notes
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            {
              Icon: Bold,
              action: () => editor?.chain().focus().toggleBold().run(),
            },
            {
              Icon: Italic,
              action: () => editor?.chain().focus().toggleItalic().run(),
            },
            {
              Icon: UnderlineIcon,
              action: () => editor?.chain().focus().toggleUnderline().run(),
            },
            {
              Icon: AlignLeft,
              action: () => editor?.chain().focus().setTextAlign("left").run(),
            },
            {
              Icon: AlignCenter,
              action: () =>
                editor?.chain().focus().setTextAlign("center").run(),
            },
            {
              Icon: AlignRight,
              action: () => editor?.chain().focus().setTextAlign("right").run(),
            },
          ].map(({ Icon, action }, idx) => (
            <button
              key={idx}
              type="button"
              onClick={action}
              className="rounded-lg border border-gray-300 p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div
        className="min-h-[200px] rounded-lg border border-gray-300 bg-gray-50 p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500"
        onClick={() => editor?.commands.focus()}
      >
        {loadingNotes ? (
          <p className="text-sm text-gray-500">Loading notes…</p>
        ) : (
          <EditorContent
            editor={editor}
            className="min-h-[150px] cursor-text"
          />
        )}
      </div>

      {/* Submit */}
      <div className="mt-4 text-right">
        <button
          onClick={handleUpdateNotes}
          disabled={loadingNotes}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white enabled:hover:bg-blue-700 disabled:opacity-50"
        >
          Update Note
        </button>
      </div>
    </div>
  );
}
