"use client";
import NotesSummary from "@/components/Classes/SummarizeCard";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  console.log(params.id);
  return (
    <div>
      <NotesSummary noteId={params.id as string} />
    </div>
  );
}
