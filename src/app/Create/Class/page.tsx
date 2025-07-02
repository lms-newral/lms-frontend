'use client';

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BookOpen, Video, VideoOff, Link2, NotebookPen, StickyNote, ClipboardList, Paperclip, Bold, Italic, AlignLeft, AlignRight, AlignCenter, Underline as UnderlineIcon } from "lucide-react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import axios from "axios";
import { useSelector } from "react-redux";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';



const dummyCourses = [
    { id: "1", name: "xyz" },
    { id: "2", name: "abc" },
    { id: "3", name: "pqr" },
];

const Classes = () => {
    const [title, setTitle] = useState("");
    const [liveLink, setLiveLink] = useState("");
    const [recordedLink, setRecordedLink] = useState("");
    const [courseId, setCourseId] = useState("");
    const token = useSelector((state: any) => state.user.accesstoken);

    const [assignments, setAssignments] = useState<string[]>([]);
    const [assignmentInput, setAssignmentInput] = useState("");

    const [attachments, setAttachments] = useState<string[]>([]);
    const [attachmentInput, setAttachmentInput] = useState("");

    const [noteHtml, setNoteHtml] = useState("");



    useEffect(() => {
        console.log(token);
        if (!token) toast.error('user is not authenticated');
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !courseId) return toast.error("Please fill in title and course.");
        if ((liveLink && recordedLink) || (!liveLink && !recordedLink)) {
            return toast.error("Fill either Live or Recorded Link (not both).");
        }

        const classData = {
            title,
            videoLink: recordedLink || "",
            zoomLink: liveLink || "",
            isLive: !!liveLink,
            isRecorded: !!recordedLink,
            notes: noteHtml,
            assignments,
            attachments,
        };

        try {
            // 1. Create class
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}class/create/${courseId}`,
                classData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );


            // 2. Add Notes
            if (noteHtml) {
                try {
                    await axios.post(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}notes/create/${courseId}`,
                        {
                            notesHtml: noteHtml,
                            courseId,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                } catch (err) {
                    console.error("Notes error:", err);
                }
            }

            // 3. Add Attachments
            await Promise.all(attachments.map(async (link) => {
                try {
                    await axios.post(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}attachment/create/${courseId}`,
                        {
                            attachment: link,
                            courseId,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                } catch (err: any) {
                    console.error("Attachment error:", err);
                }
            }));

            // 4. Add Assignments
            await Promise.all(assignments.map(async (link) => {
                try {
                    await axios.post(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}assignment/create/${courseId}`,
                        {
                            assignments: link,
                            courseId,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                } catch (err) {
                    console.error("Assignment error:", err);
                }
            }));

            toast.success("Class, notes, attachments, and assignments created!");

            // 5. Reset form
            if (res.status === 201 || res.status === 200) {
                setTitle("");
                setLiveLink("");
                setRecordedLink("");
                setCourseId("");
                setAssignmentInput("");
                setAssignments([]);
                setAttachmentInput("");
                setAttachments([]);
                editor?.commands.setContent('');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create class.");
        }
    };


    const countWords = (text: string) => {
        return text.trim().split(/\s+/).filter(Boolean).length;
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: noteHtml,
        onUpdate: ({ editor }) => {
            const text = editor.getText();
            const words = countWords(text);
            if (words <= 100) {
                setNoteHtml(editor.getHTML());
            } else {
                editor.commands.setContent(noteHtml, false); // revert
            }
        },
    });


    return (
        <div className="max-w-xl ml-4 md:ml-10 mt-10 bg-white p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <NotebookPen className="w-5 h-5 text-blue-600" />
                Create a Class
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        Title*
                    </label>
                    <input
                        type="text"
                        className="mt-1 w-full border rounded-lg p-2 bg-gray-100"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                {/* Live/Recorded Links */}
                <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <Link2 className="w-4 h-4 text-blue-600" />
                        Live Class Link
                    </label>
                    <input
                        type="url"
                        className="mt-1 w-full border rounded-lg p-2 bg-gray-100"
                        value={liveLink}
                        onChange={(e) => setLiveLink(e.target.value)}
                        disabled={!!recordedLink}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <Video className="w-4 h-4 text-blue-600" />
                        Recorded Video Link
                    </label>
                    <input
                        type="url"
                        className="mt-1 w-full border rounded-lg p-2 bg-gray-100"
                        value={recordedLink}
                        onChange={(e) => setRecordedLink(e.target.value)}
                        disabled={!!liveLink}
                    />
                </div>

                {/* Course Select */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <VideoOff className="w-4 h-4 text-blue-600" />
                        Select Course*
                    </label>
                    <Select value={courseId} onValueChange={setCourseId}>
                        <SelectTrigger className="w-full bg-gray-100 text-gray-700">
                            <SelectValue placeholder="-- Select a course --" />
                        </SelectTrigger>
                        <SelectContent>
                            {dummyCourses.map((course) => (
                                <SelectItem key={course.id} value={course.id}>
                                    {course.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>


                {/* Notes Section */}
                <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1 mb-1">
                        <StickyNote className="w-4 h-4 text-blue-600" />
                        Notes
                    </label>

                    {/* Editor Toolbar */}
                    <div className="flex flex-wrap items-center gap-2 mb-2 text-gray-700">
                        <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()}>
                            <Bold className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()}>
                            <Italic className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                            <UnderlineIcon className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => editor?.chain().focus().setTextAlign("left").run()}>
                            <AlignLeft className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => editor?.chain().focus().setTextAlign("center").run()}>
                            <AlignCenter className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => editor?.chain().focus().setTextAlign("right").run()}>
                            <AlignRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Editor Box */}
                    <div className="border bg-gray-100 text-black p-2 rounded-md min-h-[200px]">
                        <EditorContent editor={editor} className="min-h-[150px]" />
                    </div>

                    <p className="text-xs text-gray-500 text-right mt-1">
                        {countWords(editor?.getText() || "")}/100 words
                    </p>
                </div>


                {/* Assignments */}
                <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">
                        <ClipboardList className="w-4 h-4 text-blue-600" />
                        Assignments
                    </label>
                    <div className="flex items-center gap-2 mb-2">
                        <input
                            type="text"
                            className="flex-1 border rounded-lg p-2 bg-gray-100"
                            value={assignmentInput}
                            onChange={(e) => setAssignmentInput(e.target.value)}
                            placeholder="Enter assignment details"
                        />
                        <button
                            type="button"
                            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            onClick={() => {
                                if (assignmentInput.trim()) {
                                    setAssignments((prev) => [...prev, assignmentInput]);
                                    setAssignmentInput("");
                                }
                            }}
                        >
                            Add
                        </button>
                    </div>
                    <ul className="list-decimal pl-5 text-sm text-gray-500 font-bold space-y-1">
                        {assignments.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                </div>

                {/* Attachments */}
                <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">
                        <Paperclip className="w-4 h-4 text-blue-600" />
                        Attachments
                    </label>
                    <div className="flex items-center gap-2 mb-2">
                        <input
                            type="text"
                            className="flex-1 border rounded-lg p-2 bg-gray-100"
                            value={attachmentInput}
                            onChange={(e) => setAttachmentInput(e.target.value)}
                            placeholder="Enter attachment link"
                        />
                        <button
                            type="button"
                            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            onClick={() => {
                                if (attachmentInput.trim()) {
                                    setAttachments((prev) => [...prev, attachmentInput]);
                                    setAttachmentInput("");
                                }
                            }}
                        >
                            Add
                        </button>
                    </div>
                    <ul className="list-decimal pl-5 text-sm text-gray-500 font-bold space-y-1">
                        {attachments.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                </div>

                {/* Submit */}
                <div className="text-right">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-150"
                    >
                        Create Class
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Classes;
