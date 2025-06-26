interface AnnouncementCardProps {
  title: string;
  date: string;
}

export function AnnouncementCard({ title, date }: AnnouncementCardProps) {
  return (
    <div className="p-3 bg-white rounded-lg border border-blue-200 hover:shadow-sm transition-shadow">
      <h4 className="font-medium text-gray-900 text-sm mb-1">{title}</h4>
      <p className="text-xs text-gray-600">{date}</p>
    </div>
  );
}
