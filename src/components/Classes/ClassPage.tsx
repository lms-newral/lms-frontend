import { Edit, Trash, Video, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import NotesCard from "./NotesCard";
import { UserState } from "@/types/userstate";
import { useSelector } from "react-redux";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";

interface PropsData {
  videoLink?: string;
  meetLink?: string;
  createdAt?: string;
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
    attachment: string;
  }>;
}

/**
 * Renders the class page component with tabbed navigation for Notes, Assignments, and Attachments.
 *
 * @param props - The properties for the component.
 * @param props.videoLink - URL for recorded video content.
 * @param props.meetLink - URL for live meeting link.
 * @param props.NotesData - An array of note objects to display in the Notes tab.
 * @param props.Assignments - An array of assignment objects to display in the Assignments tab.
 * @param props.Attachments - An array of attachment objects to display in the Attachments tab.
 *
 * @returns The rendered class page component with meeting/video links and tabs for notes, assignments, and attachments.
 *
 * @remarks
 * - Displays either a live meeting link or recorded video link if available.
 * - Displays a message if there are no notes, assignments, or attachments.
 * - Shows edit and delete icons for assignments if the user has an admin, super admin, or teacher role.
 */
export default function ClassPageComponent(props: PropsData) {
  const user = useSelector((state: { user: UserState }) => state.user);

  return (
    <div className="p-4 max-w-3xl lg:max-w-4xl  xl:max-w-7xl mx-auto">
      {/* Meeting/Video Link Section */}
      {(props.meetLink || props.videoLink) && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          {props.meetLink ? (
            <div className="flex items-center gap-3">
              <ExternalLink className="text-blue-600 w-5 h-5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 mb-1">
                  Live Meeting
                </h3>
                <a
                  href={props.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline transition-colors block mb-2"
                >
                  Join Live Meeting
                </a>
                {props.createdAt && (
                  <p className="text-sm text-gray-400">
                    Created: {new Date(props.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ) : props.videoLink ? (
            <div className="flex items-center gap-3">
              <Video className="text-blue-600 w-5 h-5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 mb-1">
                  Recorded Video
                </h3>
                <Link
                  href={props.videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline transition-colors block mb-2"
                >
                  Watch Recording
                </Link>
                {props.createdAt && (
                  <p className="text-sm text-gray-400">
                    Created: {new Date(props.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}

      <Tabs defaultValue="Notes" className="w-full">
        <TabsList className="w-full flex bg-gray-100">
          <TabsTrigger value="Notes" className="flex-1">
            Notes
          </TabsTrigger>
          <TabsTrigger value="Assignments" className="flex-1">
            Assignments
          </TabsTrigger>
          <TabsTrigger value="Attachments" className="flex-1">
            Attachments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Notes" className="mt-6">
          {props.NotesData.length > 0 ? (
            <div className="space-y-6">
              {props.NotesData.map((note) => (
                <div
                  key={note.id}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <NotesCard htmlContent={note.notesHtml} notesId={note.id} />
                  <div className="mt-3 text-sm text-gray-500">
                    Created: {new Date(note.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No notes available</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="Assignments" className="mt-6">
          {props.Assignments.length > 0 ? (
            <div className="space-y-4">
              {props.Assignments.map((assignment, index) => (
                <div
                  key={assignment.id}
                  className="flex items-start justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-900 mb-2">
                          {assignment.assignments}
                        </p>
                        <p className="text-sm text-gray-400">
                          Created:
                          {new Date(assignment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  {user.user &&
                    (user.user.role === "ADMIN" ||
                      user.user.role === "SUPER_ADMIN" ||
                      user.user.role === "TEACHER") && (
                      <div className="flex gap-2 ml-4">
                        <Link
                          href={`/Update/${assignment.id}/Assignment`}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                          aria-label="Edit assignment"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            axios
                              .delete(
                                `${process.env.NEXT_PUBLIC_BACKEND_URL}assignment/delete/${assignment.id}`,
                                {
                                  headers: {
                                    Authorization: `Bearer ${user.accessToken}`,
                                  },
                                }
                              )
                              .then(() => {
                                toast.success("Assignment deleted");
                              })
                              .catch((error: any) => {
                                console.log(error);
                                toast.error(
                                  error.response?.data?.message ||
                                    "Failed to delete assignment"
                                );
                              });
                          }}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          aria-label="Delete assignment"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No assignments available</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="Attachments" className="mt-6">
          {props.Attachments.length > 0 ? (
            <div className="space-y-4">
              {props.Attachments.map((attachment, index) => (
                <div
                  key={attachment.id}
                  className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-900 mb-2">
                      {attachment.attachment}
                    </p>
                    <p className="text-sm text-gray-500">
                      Created:{" "}
                      {new Date(attachment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {user.user &&
                    (user.user.role === "ADMIN" ||
                      user.user.role === "SUPER_ADMIN" ||
                      user.user.role === "TEACHER") && (
                      <div className="flex gap-2 ml-4">
                        <Link
                          href={`/Update/${attachment.id}/Attachment`}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                          aria-label="Edit assignment"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            axios
                              .delete(
                                `${process.env.NEXT_PUBLIC_BACKEND_URL}attachment/delete/${attachment.id}`,
                                {
                                  headers: {
                                    Authorization: `Bearer ${user.accessToken}`,
                                  },
                                }
                              )
                              .then(() => {
                                toast.success("Attachment deleted");
                              })
                              .catch((error: any) => {
                                console.log(error);
                                toast.error(
                                  error.response?.data?.message ||
                                    "Failed to delete attachment"
                                );
                              });
                          }}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          aria-label="Delete assignment"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No attachments available</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
