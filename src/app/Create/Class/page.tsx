"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

import {
  BookOpen,
  Video,
  VideoOff,
  Link2,
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
import { Course } from "@/types/DataTypes";

/* -------------------------------------------------- */

export default function Classes() {
  const router = useRouter();
  const user = useSelector((state: { user: UserState }) => state.user);

  /* ──────────────── local state ──────────────── */
  const [title, setTitle] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [recordedLink, setRecordedLink] = useState("");
  const [courseId, setCourseId] = useState("");

  const [courses, setCourses] = useState<Course[]>([]);

  const [assignments, setAssignments] = useState<string[]>([]);
  const [assignmentInput, setAssignmentInput] = useState("");

  const [attachments, setAttachments] = useState<string[]>([]);
  const [attachmentInput, setAttachmentInput] = useState("");

  const [noteHtml, setNoteHtml] = useState("");

  /* ──────────────── fetch courses ──────────────── */
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
        } catch {
          toast.error("Could not fetch courses");
        }
      }
    }

    getCourses();
  }, [user, router]);

  /* ──────────────── TipTap editor setup ──────────────── */
  const countWords = (t: string) =>
    t.trim().split(/\s+/).filter(Boolean).length;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: noteHtml,
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      if (countWords(text) <= 100) {
        setNoteHtml(editor.getHTML());
      } else {
        editor.commands.setContent(noteHtml, false); // revert if >100 words
      }
    },
  });

  /* ──────────────── submit handler ──────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /* basic validations */
    if (!title || !courseId)
      return toast.error("Please fill in title and course.");
    if ((liveLink && recordedLink) || (!liveLink && !recordedLink))
      return toast.error("Fill either Live or Recorded Link (not both).");

    const classPayload = {
      title,
      videoLink: recordedLink || "",
      zoomLink: liveLink || "",
      isLive: !!liveLink,
      isRecorded: !!recordedLink,
      notes: noteHtml, // (optional: your backend may ignore)
      assignments,
      attachments,
    };

    try {
      /* 1️⃣  Create class */
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}class/create/${courseId}`,
        classPayload,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );

      /* Grab the classId returned by the backend */
      const classId =
        res.data?.data?.id ?? res.data?.data?.classId ?? res.data?.classId;
      if (!classId) throw new Error("classId not returned from backend");

      /* 2️⃣  Create note (HTML) */
      if (noteHtml) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}notes/create/${classId}`,
          { notesHtml: noteHtml },
          { headers: { Authorization: `Bearer ${user.accessToken}` } }
        );
      }

      /* 3️⃣  Create attachments */
      await Promise.all(
        attachments.map((link) =>
          axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}attachment/create/${classId}`,
            { attachment: link },
            { headers: { Authorization: `Bearer ${user.accessToken}` } }
          )
        )
      );

      /* 4️⃣  Create assignments */
      await Promise.all(
        assignments.map((link) =>
          axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}assignment/create/${classId}`,
            { assignment: link },
            { headers: { Authorization: `Bearer ${user.accessToken}` } }
          )
        )
      );

      toast.success("Class, notes, attachments, and assignments created!");

      /* reset form */
      setTitle("");
      setLiveLink("");
      setRecordedLink("");
      setCourseId("");
      setAssignmentInput("");
      setAssignments([]);
      setAttachmentInput("");
      setAttachments([]);
      editor?.commands.setContent("");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to create class."
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
        Create a Class
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* title */}
        <div>
          <label className="flex items-center gap-1 text-sm font-medium">
            <BookOpen className="h-4 w-4 text-blue-600" />
            Title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* links */}
        <div>
          <label className="flex items-center gap-1 text-sm font-medium">
            <Link2 className="h-4 w-4 text-blue-600" />
            Live Class Link
          </label>
          <input
            type="url"
            className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            value={liveLink}
            onChange={(e) => setLiveLink(e.target.value)}
            disabled={!!recordedLink}
            placeholder="https://zoom.us/..."
          />
        </div>

        <div>
          <label className="flex items-center gap-1 text-sm font-medium">
            <Video className="h-4 w-4 text-blue-600" />
            Recorded Video Link
          </label>
          <input
            type="url"
            className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            value={recordedLink}
            onChange={(e) => setRecordedLink(e.target.value)}
            disabled={!!liveLink}
            placeholder="https://youtube.com/..."
          />
        </div>

        {/* course select */}
        <div>
          <label className="flex items-center gap-1 text-sm font-medium">
            <VideoOff className="h-4 w-4 text-blue-600" />
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

        {/* notes (TipTap) */}
        <div>
          <label className="mb-2 flex items-center gap-1 text-sm font-medium">
            <StickyNote className="h-4 w-4 text-blue-600" />
            Notes (max 100 words)
          </label>

          {/* toolbar */}
          <div className="mb-2 flex flex-wrap items-center gap-2 text-gray-700">
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

          <div className="min-h-[200px] rounded-lg border border-gray-300 bg-gray-50 p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
            <EditorContent editor={editor} className="min-h-[150px]" />
          </div>
          <p className="mt-1 text-right text-xs text-gray-500">
            {countWords(editor?.getText() ?? "")}/100 words
          </p>
        </div>

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
            Create Class
          </button>
        </div>
      </form>
    </div>
  );
}