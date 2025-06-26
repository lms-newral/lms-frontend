import { Search, Bell, Bookmark, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScheduleItem } from "./ScheduleItem";
import { AnnouncementCard } from "./AnnouncementCard";

const scheduleData = [
  {
    title: "Placement Scrum",
    instructor: "Pratha Brahma",
    time: "25 Jun, 2025, 11:00 AM",
    type: "Scrum",
    status: "LIVE SESSION",
    icon: "📚",
  },
  {
    title: "CC_BLOCK_2_S2:CSS Box Model",
    instructor: "Santhosh K",
    time: "25 Jun, 2025, 11:30 AM",
    type: "Coding",
    status: "LIVE SESSION",
    icon: "📚",
  },
  {
    title: "CCP_BLOCK2_S2: Introduction to CSS",
    instructor: "Santhosh K",
    time: "25 Jun, 2025, 11:30 AM",
    type: "Dsa",
    status: "ASSIGNMENT",
    icon: "📝",
  },
  {
    title: "CC_BLOCK_2_S2:Introduction to CSS",
    instructor: "Santhosh K",
    time: "25 Jun, 2025, 7:00 PM",
    type: "Dsa",
    status: "LIVE SESSION",
    icon: "📚",
    hasJoinButton: true,
  },
];

const announcements = [
  {
    title: "Creator in Residence",
    date: "25 Jun, 2025 4:00 PM",
  },
  {
    title: "Block 2 Sprint 2 Plan",
    date: "23 Jun, 2025 9:20 AM",
  },
  {
    title: "Sprint 1 Schedule",
    date: "16 Jun, 2025 7:00 PM",
  },
];

const whatsNew = [
  {
    title:
      "Product Update | Get access to all platforms of Masai at one place !",
    date: "6 Apr, 2024 8:41 PM",
  },
];

export function DashboardContent() {
  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="flex gap-6 p-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Schedule Tabs */}
          <Tabs defaultValue="schedule" className="mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-white">
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="sprint">Sprint Plan</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>

            <TabsContent value="schedule">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Today&apos;s Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scheduleData.map((item, index) => (
                    <ScheduleItem key={index} {...item} />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 space-y-6">
          {/* Announcements */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  📢 Announcements
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {announcements.map((announcement, index) => (
                <AnnouncementCard key={index} {...announcement} />
              ))}
              <Button
                variant="link"
                className="text-blue-600 p-0 h-auto font-medium"
              >
                VIEW ALL
              </Button>
            </CardContent>
          </Card>

          {/* What's New */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                🔔 What&apos;s New?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {whatsNew.map((item, index) => (
                <AnnouncementCard key={index} {...item} />
              ))}
              <Button
                variant="link"
                className="text-blue-600 p-0 h-auto font-medium"
              >
                VIEW ALL
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
