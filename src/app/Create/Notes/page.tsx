"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

import {
  BookOpen,
  Video,
  NotebookPen,
  StickyNote,
  ClipboardList,
  Paperclip,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Underline as UnderlineIcon,
} from "lucide-react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Underline } from "@tiptap/extension-underline";

import { UserState } from "@/types/userstate";
import { Classes, Course } from "@/types/DataTypes";

/* -------------------------------------------------- */

export default function CreateNotes() {
  const router = useRouter();
  const user = useSelector((state: { user: UserState }) => state.user);

  /* ──────────────── local state ──────────────── */

  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);

  const [classes, setClasses] = useState<Classes[]>([]);
  const [classId, setClassId] = useState("");
  const [assignments, setAssignments] = useState<string[]>([]);
  const [assignmentInput, setAssignmentInput] = useState("");

  const [attachments, setAttachments] = useState<string[]>([]);
  const [attachmentInput, setAttachmentInput] = useState("");

  const [noteHtml, setNoteHtml] = useState(""); // current note being typed
  const [notes, setNotes] = useState<string[]>([]); // all notes added

  /* ──────────────── fetch courses ──────────────── */

  async function getClasses() {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}class/all/${courseId}`,
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );
      setClasses(res.data);
      console.log("Classes fetched:", res.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Could not fetch classes");
    }
  }

  useEffect(() => {
    if (!user.accessToken) {
      toast.error("User is not authenticated");
      router.push("/");
      return;
    }

    async function getCourses() {
      if (["ADMIN", "SUPER_ADMIN"].includes(user.user?.role ?? "")) {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}course`
          );
          setCourses(res.data);
          console.log(res.data);
        } catch {
          toast.error("Could not fetch courses");
        }
      } else {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}course/createdBy`,
            {
              headers: { Authorization: `Bearer ${user.accessToken}` },
            }
          );
          setCourses(res.data);
        } catch (error: any) {
          toast.error(error.response.data.message);
          toast.error("Could not fetch courses");
        }
      }
    }

    getCourses();
  }, [user, router]);

  // Fetch classes when courseId changes
  useEffect(() => {
    if (courseId) {
      getClasses();
      setClassId(""); // Reset class selection when course changes
    }
  }, [courseId]);

  /* ──────────────── TipTap editor setup ──────────────── */

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: noteHtml,
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setNoteHtml(editor.getHTML());
    },
  });

  /* ──────────────── submit handler ──────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /* basic validations */
    if (!classId) return toast.error("Please select a class.");

    try {
      /* 1️⃣  Create all saved notes */
      if (notes.length > 0) {
        await Promise.all(
          notes.map((noteHtml) =>
            axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}notes/create/${classId}`,
              { notesHtml: noteHtml },
              { headers: { Authorization: `Bearer ${user.accessToken}` } }
            )
          )
        );
      }

      /* 2️⃣  Create current note in editor (if any) */
      if (noteHtml && editor?.getText().trim()) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}notes/create/${classId}`,
          { notesHtml: noteHtml },
          { headers: { Authorization: `Bearer ${user.accessToken}` } }
        );
      }

      /* 3️⃣  Create attachments */
      if (attachments.length > 0) {
        await Promise.all(
          attachments.map((link) =>
            axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}attachment/create/${classId}`,
              { attachment: link },
              { headers: { Authorization: `Bearer ${user.accessToken}` } }
            )
          )
        );
      }

      /* 4️⃣  Create assignments */
      if (assignments.length > 0) {
        await Promise.all(
          assignments.map((link) =>
            axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}assignment/create/${classId}`,
              { assignment: link },
              { headers: { Authorization: `Bearer ${user.accessToken}` } }
            )
          )
        );
      }

      toast.success(
        "Notes, attachments, and assignments created successfully!"
      );

      /* reset form */

      setCourseId("");
      setClassId("");
      setAssignmentInput("");
      setAssignments([]);
      setAttachmentInput("");
      setAttachments([]);
      setNotes([]);
      setNoteHtml("");
      editor?.commands.setContent("");
    } catch (err: any) {
      console.error("Error creating notes:", err);
      toast.error(
        err.response?.data?.message || err.message || "Failed to create notes."
      );
    }
  };

  /* -------------------------------------------------- */
  /* -------------------  RENDER  ---------------------- */
  /* -------------------------------------------------- */
  return (
    <div className="mx-auto mt-10 w-full max-w-2xl rounded-xl bg-white p-6 ">
      <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
        <NotebookPen className="h-5 w-5 text-blue-600" />
        Add to Class
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* course select */}
        <div>
          <label className="flex items-center gap-1 text-sm font-medium">
            <BookOpen className="h-4 w-4 text-blue-600" />
            Select Course <span className="text-red-600">*</span>
          </label>
          <Select value={courseId} onValueChange={setCourseId}>
            <SelectTrigger className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="-- Select a course --" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* class select */}
        <div>
          <label className="flex items-center gap-1 text-sm font-medium">
            <Video className="h-4 w-4 text-blue-600" />
            Select Class <span className="text-red-600">*</span>
          </label>
          <Select value={classId} onValueChange={setClassId}>
            <SelectTrigger className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="-- Select a class --" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {classes.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* notes (TipTap) */}
        <div>
          <label className="mb-2 flex items-center gap-1 text-sm font-medium">
            <StickyNote className="h-4 w-4 text-blue-600" />
            Notes
          </label>

          {/* toolbar */}
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-gray-700">
            {/* Left: Formatting Buttons */}
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
                  action: () =>
                    editor?.chain().focus().setTextAlign("left").run(),
                },
                {
                  Icon: AlignCenter,
                  action: () =>
                    editor?.chain().focus().setTextAlign("center").run(),
                },
                {
                  Icon: AlignRight,
                  action: () =>
                    editor?.chain().focus().setTextAlign("right").run(),
                },
              ].map(({ Icon, action }, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={action}
                  className="rounded-lg border border-gray-300 p-2 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>

            {/* Right: Add Button */}
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              onClick={() => {
                if (noteHtml.trim() && editor?.getText().trim()) {
                  setNotes((prev) => [...prev, noteHtml]);
                  setNoteHtml("");
                  editor?.commands.clearContent();
                }
              }}
            >
              Add
            </button>
          </div>
          <div
            className="min-h-[200px] rounded-lg border border-gray-300 bg-gray-50 p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500"
            onClick={() => {
              if (editor && !editor.isFocused) {
                editor.commands.focus();
              }
            }}
          >
            <EditorContent
              editor={editor}
              className="min-h-[150px] cursor-text"
            />
          </div>
        </div>
        {notes.length > 0 && (
          <div className="mt-4 space-y-3">
            <p className="text-sm font-medium text-blue-600">Saved Notes:</p>
            {notes.map((note, idx) => (
              <div
                key={idx}
                className="relative rounded-md border border-gray-200 bg-white p-3 pr-10 shadow-sm text-sm break-words"
              >
                <button
                  onClick={() =>
                    setNotes((prevNotes) =>
                      prevNotes.filter((_, i) => i !== idx)
                    )
                  }
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-blue-600 hover:bg-gray-100 hover:text-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  aria-label="Delete note"
                >
                  ✕
                </button>
                <div
                  dangerouslySetInnerHTML={{ __html: note }}
                  className="overflow-hidden text-ellipsis"
                />
              </div>
            ))}
          </div>
        )}

        {/* assignments */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            <ClipboardList className="mr-1 inline h-4 w-4 text-blue-600" />
            Assignments
          </label>
          <div className="mb-2 flex items-center gap-2">
            <input
              type="text"
              className="flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              value={assignmentInput}
              onChange={(e) => setAssignmentInput(e.target.value)}
              placeholder="Enter assignment details"
            />
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              onClick={() => {
                if (assignmentInput.trim()) {
                  setAssignments((p) => [...p, assignmentInput.trim()]);
                  setAssignmentInput("");
                }
              }}
            >
              Add
            </button>
          </div>
          <ul className="space-y-1 list-decimal pl-5 text-sm text-gray-600">
            {assignments.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>

        {/* attachments */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            <Paperclip className="mr-1 inline h-4 w-4 text-blue-600" />
            Attachments
          </label>
          <div className="mb-2 flex items-center gap-2">
            <input
              type="text"
              className="flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              value={attachmentInput}
              onChange={(e) => setAttachmentInput(e.target.value)}
              placeholder="Enter attachment link"
            />
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              onClick={() => {
                if (attachmentInput.trim()) {
                  setAttachments((p) => [...p, attachmentInput.trim()]);
                  setAttachmentInput("");
                }
              }}
            >
              Add
            </button>
          </div>
          <ul className="break-all space-y-1 list-decimal pl-5 text-sm text-gray-600">
            {attachments.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>

        {/* submit */}
        <div className="text-right">
          <button
            type="submit"
            className="rounded-lg w-full bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
