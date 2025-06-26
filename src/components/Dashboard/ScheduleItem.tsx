import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ScheduleItemProps {
  title: string;
  instructor: string;
  time: string;
  type: string;
  status: string;
  icon: string;
  hasJoinButton?: boolean;
}

export function ScheduleItem({
  title,
  instructor,
  time,
  type,
  status,
  icon,
  hasJoinButton,
}: ScheduleItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "LIVE SESSION":
        return "bg-green-100 text-green-700";
      case "ASSIGNMENT":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
            <Badge variant="secondary" className={getStatusColor(status)}>
              {status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                {instructor
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <span>{instructor}</span>
            </div>
            <span>📅 {time}</span>
            <span>🏷️ {type}</span>
          </div>
        </div>
      </div>

      {hasJoinButton && (
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          🔗 JOIN
        </Button>
      )}
    </div>
  );
}
