
import { Users, Calendar, Clock, Play, ArrowBigRight } from "lucide-react";
import Link from "next/link";

interface ClassData {
  id: string;
  title: string;
  videoLink?: string;
  zoomLink?: string;
  attachments: string;
  courseId: string;
  creatorId: string;
  attendanceCount: number;
  isLive: boolean;
  isRecorded: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isClient: boolean;
}

export default function ClassCard(classItem: ClassData) {
  const formatDate = (dateString: string) => {
    if (!classItem.isClient) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    if (!classItem.isClient) return "";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  const data = classItem;

  return (
    <div className="flex flex-wrap gap-6 p-4">
      <div
        key={data.id}
        className="group relative flex flex-col w-full sm:w-80 md:w-72 lg:w-80 flex-shrink-0 h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200/60 overflow-hidden"
        title="Go to class"
      >
        <Link href={`/Classes/${data.id}`}>
          {/* Status indicators */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            {data.isLive && (
              <span className="px-2.5 py-1 bg-red-100 text-gray-700 text-xs font-medium rounded-full border border-emerald-200">
                LIVE
              </span>
            )}
            {data.isRecorded && (
              <span className="px-2.5 py-1 bg-green-100 text-slate-600 text-xs font-medium rounded-full border border-slate-200">
                RECORDED
              </span>
            )}
          </div>

          {/* Main content area */}
          <div className="flex-1 p-5 flex flex-col justify-center items-center text-center">
            <div className="mb-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
                <ArrowBigRight className="w-6 h-6 text-slate-600" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-slate-800 mb-3 line-clamp-2 leading-snug">
              {data.title}
            </h3>

            <div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>{data.attendanceCount}</span>
              </div>
              {data.isClient && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(data.createdAt)}</span>
                </div>
              )}
            </div>

            {data.isClient && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                <span>{formatTime(data.createdAt)}</span>
              </div>
            )}
          </div>
        </Link>

        {/* Bottom action area */}
        <div className="w-full bg-gradient-to-b from-blue-100 to-blue-200 border-t border-slate-200/60 p-4">
          <Link
            href={
              classItem.zoomLink
                ? classItem.zoomLink
                : classItem.videoLink || ""
            }
            target="_blank"
            title={
              classItem.zoomLink ? "Open the meet link" : "Open the video link"
            }
            className="w-full py-2.5 px-4 bg-white/80 backdrop-blur-sm font-medium rounded-xl hover:bg-white transition-all duration-200 flex items-center justify-center gap-2 text-slate-700 border border-slate-200/60 hover:border-slate-300/60 hover:shadow-sm"
          >
            <Play className="w-4 h-4" />
            {data.isLive ? "Join Live Class" : "Watch Class"}
          </Link>
        </div>

        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>

      </div>
    </div>
  );
}
