import { Edit, Trash } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import NotesCard from "./NotesCard";
import { UserState } from "@/types/userstate";
import { useSelector } from "react-redux";

interface PropsData {
  NotesData: Array<{
    id: string;
    createdAt: string;
    notesHtml: string;
  }>;
  Assignments: Array<{
    id: string;
    createdAt: string;
    assignments: string;
  }>;
  Attachments: Array<{
    id: string;
    createdAt: string;
    attachments: string;
  }>;
}

export default function ClassPageComponent(props: PropsData) {
  const user = useSelector((state: { user: UserState }) => state.user.user);

  return (
    <div>
      <Tabs defaultValue="Notes" className="mb-10">
        <TabsList className="w-full flex flex-row bg-gray-100">
          <TabsTrigger value="Notes">Notes</TabsTrigger>
          <TabsTrigger value="Assignments">Assignments</TabsTrigger>
          <TabsTrigger value="Attachments">Attachments</TabsTrigger>
        </TabsList>

        <TabsContent value="Notes">
          {props.NotesData.length > 0 ? (
            <div className="flex flex-col">
              {props.NotesData.map((note) => (
                <div key={note.id} className="  border-b pb-6 last:border-b-0">
                  <NotesCard htmlContent={note.notesHtml} notesId={note.id} />
                  <div className="mb-2 text-sm text-gray-500">
                    Created: {new Date(note.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 min-h-screen">No notes available</p>
          )}
        </TabsContent>
        <TabsContent value="Assignments">
          {props.Assignments.length > 0 ? (
            <div className="min-h-screen mt-10">
              <ol className="list-decimal list-inside space-y-4 bg-gray-100 px-2 py-4 rounded-lg">
                {props.Assignments.map((data) => (
                  <li
                    key={data.id}
                    A
                    className="mb-4 p-4 shadow border flex justify-between bg-white rounded-lg"
                    style={{ display: "list-item" }} // Force list-item display
                  >
                    {data.assignments}
                    {user &&
                      (user.role === "ADMIN" ||
                        user.role === "SUPER_ADMIN" ||
                        user.role === "TEACHER") && (
                        <span className="flex gap-2">
                          <Edit className="text-blue-800" />
                          <Trash className="text-red-500" />
                        </span>
                      )}
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <p className="text-gray-500 min-h-screen">
              No assignments available
            </p>
          )}
        </TabsContent>

        <TabsContent value="Attachments">
          {props.Attachments.length > 0 ? (
            <div>
              <ol className="list-decimal list-inside space-y-4">
                {props.Attachments.map((data, index) => (
                  <li key={index} className="mb-4 p-4 shadow border rounded-lg">
                    {data.attachments}
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <p className="text-gray-500 min-h-screen">
              No attachments available
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
