import { UserState } from "@/types/userstate";
import axios from "axios";
import { Edit, StarsIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function NotesCard({ htmlContent = "", notesId = "" }) {
  const user = useSelector((state: { user: UserState }) => state.user.user);

  async function handleDelete() {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}notes/delete/${notesId}`
    );
  }
  return (
    <div className="mt-10 flex flex-col gap-6 bg-neutral-100 p-4 rounded-xl text-lg ">
      {(user?.role === "ADMIN" || user?.role === "SUPERADMIN") && (
        <div className=" flex gap-4 w-full justify-end">
          <Link href={`/Update/${notesId}/Notes`}>
            <Edit className="text-blue-800" />
          </Link>
          <button onClick={handleDelete} className="cursor-pointer">
            <Trash2 className="text-red-500" />
          </button>
        </div>
      )}
      <div>
        <Link
          className=" flex gap-2 justify-start w-fit text-sm px-4 py-2 bg-black text-white rounded-lg  "
          href={`/Notes/NotesSummary/${notesId}`}
        >
          <StarsIcon className="text-purple-600" />
          Summarize Using AI
        </Link>
      </div>
      <div
        className="prose max-w-none text-pretty "
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
