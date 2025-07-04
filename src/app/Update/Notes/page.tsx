"use client";
import { useEffect, useState } from "react";
import { StickyNote, Bold, Italic, Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Underline } from "@tiptap/extension-underline";
import axios from "axios";

interface Course {
    id: string;
    title: string;
    classes: { id: string; title: string; description: string }[];
}

export default function UpdateNotes() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<string>("");
    const [selectedClassId, setSelectedClassId] = useState<string>("");
    const [noteHtml, setNoteHtml] = useState("");
    const [loadingNotes, setLoadingNotes] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
        ],
        content: noteHtml,
        onUpdate: ({ editor }) => {
            setNoteHtml(editor.getHTML());
        },
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}courses`);
                const data: Course[] = res.data;
                setCourses(data);
                if (data.length > 0) {
                    setSelectedCourseId(data[0].id);
                    setSelectedClassId(data[0].classes[0]?.id || "");
                }
            } catch (err) {
                console.error("Failed to fetch courses:", err);
            }
        };

        fetchCourses();
    }, []);

    const selectedCourse = courses.find((c) => c.id === selectedCourseId);
    const selectedClass = selectedCourse?.classes.find((cls) => cls.id === selectedClassId);

    useEffect(() => {
        const loadNotes = async () => {
            if (!selectedClassId || !editor) return;
            setLoadingNotes(true);
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}notes/${selectedClassId}`);
                const noteHtmlFromBackend = res.data.notesHtml;
                setNoteHtml(noteHtmlFromBackend);
                editor.commands.setContent(noteHtmlFromBackend);
            } catch (err) {
                console.error("Failed to fetch notes:", err);
                setNoteHtml("");
                editor.commands.setContent("");
            } finally {
                setLoadingNotes(false);
            }
        };

        loadNotes();
    }, [selectedClassId, editor]);

    const handleUpdateNotes = async () => {
        if (!selectedClassId) return;
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notes/update/${selectedClassId}`, {
                noteHtml,
            });
            alert("Notes updated successfully!");
        } catch (err) {
            alert("Failed to update notes.");
            console.error(err);
        }
    };

    return (
        <div className="mx-auto mt-10 max-w-3xl rounded-xl bg-white p-6 shadow-sm">
            <h1 className="mb-6 text-xl font-semibold text-gray-800">📝 Update Notes</h1>

            {/* Course Selector */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Select Course</label>
                <select
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm"
                    value={selectedCourseId}
                    onChange={(e) => {
                        const newCourseId = e.target.value;
                        setSelectedCourseId(newCourseId);
                        const firstClassId = courses.find((c) => c.id === newCourseId)?.classes[0]?.id || "";
                        setSelectedClassId(firstClassId);
                    }}
                >
                    {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                            {course.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Class Selector */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Select Class</label>
                <select
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm"
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                >
                    {selectedCourse?.classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                            {cls.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Class Info */}
            <div className="mb-6 border rounded-md bg-gray-50 p-4 text-sm text-gray-700">
                <p>
                    <strong>Title:</strong> {selectedClass?.title}
                </p>
                <p>
                    <strong>Description:</strong> {selectedClass?.description}
                </p>
            </div>

            {/* Notes Editor */}
            <div className="mb-2 flex items-center gap-1 text-sm font-medium">
                <StickyNote className="h-4 w-4 text-blue-600" />
                Edit Notes
            </div>

            {/* Toolbar */}
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-gray-700">
                <div className="flex flex-wrap items-center gap-2">
                    {[
                        { Icon: Bold, action: () => editor?.chain().focus().toggleBold().run() },
                        { Icon: Italic, action: () => editor?.chain().focus().toggleItalic().run() },
                        { Icon: UnderlineIcon, action: () => editor?.chain().focus().toggleUnderline().run() },
                        { Icon: AlignLeft, action: () => editor?.chain().focus().setTextAlign("left").run() },
                        { Icon: AlignCenter, action: () => editor?.chain().focus().setTextAlign("center").run() },
                        { Icon: AlignRight, action: () => editor?.chain().focus().setTextAlign("right").run() },
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

            {/* Editor Content */}
            <div
                className="min-h-[200px] rounded-lg border border-gray-300 bg-gray-50 p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500"
                onClick={() => {
                    if (editor && !editor.isFocused) {
                        editor.commands.focus();
                    }
                }}
            >
                {loadingNotes ? (
                    <p className="text-sm text-gray-500">Loading notes...</p>
                ) : (
                    <EditorContent editor={editor} className="min-h-[150px] cursor-text" />
                )}
            </div>

            {/* Update Button */}
            <div className="mt-4 text-right">
                <button
                    onClick={handleUpdateNotes}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                    Update Notes
                </button>
            </div>
        </div>
    );
}
