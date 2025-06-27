import {
  PlayCircle,
  Users,
  Calendar,
  Clock,
  PlayCircleIcon,
} from "lucide-react";
interface ClassData {
  _id: string;
  title: string;
  videoLink?: string;
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      <div
        key={classItem._id}
        className="group relative flex flex-col w-full h-64 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100 overflow-hidden"
      >
        {/* Status indicators */}
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          {classItem.isLive && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full animate-pulse">
              LIVE
            </span>
          )}
          {classItem.isRecorded && (
            <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
              RECORDED
            </span>
          )}
          {!classItem.isActive && (
            <span className="px-2 py-1 bg-gray-500 text-white text-xs font-semibold rounded-full">
              INACTIVE
            </span>
          )}
        </div>

        {/* Main content area */}
        <div className="flex-1 p-4 flex flex-col justify-center items-center text-center">
          <div className="mb-4">
            <PlayCircle className="w-12 h-12 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
          </div>

          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
            {classItem.title}
          </h3>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{classItem.attendanceCount}</span>
            </div>
            {classItem.isClient && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(classItem.createdAt)}</span>
              </div>
            )}
          </div>

          {classItem.isClient && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{formatTime(classItem.createdAt)}</span>
            </div>
          )}
        </div>

        {/* Bottom action area */}
        <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-b-xl">
          <button className="w-full py-2 px-4 bg-white bg-opacity-20 backdrop-blur-sm font-semibold rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center gap-2 text-gray-600">
            <PlayCircleIcon className="w-4 h-4" />
            {classItem.isLive ? "Join Live Class" : "Watch Class"}
          </button>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
}
