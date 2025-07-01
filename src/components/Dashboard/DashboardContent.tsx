"use client";
import React, { useState } from "react";
import {
  BookOpen,
  FileText,
  Paperclip,
  Clock,
  TrendingUp,
  Users,
  Play,
  Award,
  Target,
  Activity,
} from "lucide-react";

export default function DashboardContent() {
  // Dummy data - replace with actual API calls
  const [quickStats] = useState({
    courses: 12,
    pendingAssignments: 8,
    attachments: 15,
    liveSessions: 3,
  });

  const [todaySchedule] = useState([
    {
      id: 1,
      title: "Placement Scrum",
      instructor: "Pratha Brahma",
      time: "11:00 AM",
      type: "live",
      subject: "Scrum",
      status: "ongoing",
    },
    {
      id: 2,
      title: "CC BLOCK 2 S2:CSS Box Model",
      instructor: "Santhosh K",
      time: "11:30 AM",
      type: "live",
      subject: "Coding",
      status: "upcoming",
    },
    {
      id: 3,
      title: "CCP_BLOCK2 S2: Introduction to CSS",
      instructor: "Santhosh K",
      time: "11:30 AM",
      type: "assignment",
      subject: "Dsa",
      status: "due",
    },
    {
      id: 4,
      title: "CC_BLOCK_2 S2:Introduction to CSS",
      instructor: "Santhosh K",
      time: "7:00 PM",
      type: "live",
      subject: "Dsa",
      status: "upcoming",
    },
  ]);

  const [recentActivity] = useState([
    {
      id: 1,
      type: "assignment",
      title: "JavaScript Fundamentals Quiz",
      course: "Web Development",
      timestamp: "2 hours ago",
      status: "submitted",
    },
    {
      id: 2,
      type: "note",
      title: "React Hooks Notes",
      course: "Frontend Development",
      timestamp: "5 hours ago",
      status: "created",
    },
    {
      id: 3,
      type: "course",
      title: "Data Structures Module 3",
      course: "Computer Science",
      timestamp: "1 day ago",
      status: "completed",
    },
    {
      id: 4,
      type: "attachment",
      title: "Algorithm Analysis PDF",
      course: "Data Structures",
      timestamp: "2 days ago",
      status: "downloaded",
    },
  ]);

  const [courseProgress] = useState([
    {
      id: 1,
      title: "Data Structures & Algorithms",
      progress: 85,
      nextTopic: "Graph Algorithms",
      dueAssignment: "Binary Tree Implementation",
      dueDays: 3,
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Web Development Bootcamp",
      progress: 60,
      nextTopic: "React Router",
      dueAssignment: "Portfolio Website",
      dueDays: 7,
      color: "bg-green-500",
    },
    {
      id: 3,
      title: "Machine Learning Basics",
      progress: 40,
      nextTopic: "Linear Regression",
      dueAssignment: "Data Analysis Project",
      dueDays: 5,
      color: "bg-purple-500",
    },
  ]);

  const [announcements] = useState([
    {
      id: 1,
      title: "Creator in Residence",
      time: "25 Jun, 2025 4:00 PM",
      priority: "high",
    },
    {
      id: 2,
      title: "Block 2 Sprint 2 Plan",
      time: "23 Jun, 2025 9:20 AM",
      priority: "medium",
    },
    {
      id: 3,
      title: "Sprint 1 Schedule",
      time: "16 Jun, 2025 7:00 PM",
      priority: "low",
    },
  ]);

  const [studyStats] = useState({
    weeklyHours: 28,
    streak: 12,
    completedCourses: 3,
    averageScore: 87,
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case "live":
        return <Play className="w-4 h-4" />;
      case "assignment":
        return <FileText className="w-4 h-4" />;
      case "note":
        return <BookOpen className="w-4 h-4" />;
      case "course":
        return <Users className="w-4 h-4" />;
      case "attachment":
        return <Paperclip className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return "bg-red-100 text-red-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "due":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your learning journey today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Courses</p>
              <p className="text-3xl font-bold text-gray-900">
                {quickStats.courses}
              </p>
              <p className="text-green-600 text-sm">+2 this month</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Tasks</p>
              <p className="text-3xl font-bold text-gray-900">
                {quickStats.pendingAssignments}
              </p>
              <p className="text-red-600 text-sm">Due this week</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Study Hours</p>
              <p className="text-3xl font-bold text-gray-900">
                {studyStats.weeklyHours}
              </p>
              <p className="text-green-600 text-sm">This week</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Avg. Score</p>
              <p className="text-3xl font-bold text-gray-900">
                {studyStats.averageScore}%
              </p>
              <p className="text-green-600 text-sm">+5% from last month</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Schedule */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Today's Schedule
                </h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg">
                    Schedule
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                    Sprint Plan
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                    Support
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {todaySchedule.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-white p-2 rounded-lg">
                        {getTypeIcon(item.type)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {item.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-500">
                            {item.instructor}
                          </span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-500">
                            {item.time}
                          </span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-500">
                            {item.subject}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                      {item.status === "ongoing" && (
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                          JOIN
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Course Progress */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                Course Progress
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {courseProgress.map((course) => (
                  <div
                    key={course.id}
                    className="border border-gray-200 rounded-lg p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">
                        {course.title}
                      </h3>
                      <span className="text-sm font-medium text-gray-600">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div
                        className={`h-2 rounded-full ${course.color}`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Next: {course.nextTopic}
                      </span>
                      <span className="text-red-600">
                        Due: {course.dueAssignment} ({course.dueDays} days)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Activity
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="bg-blue-50 p-2 rounded-lg">
                      {getTypeIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {activity.course} • {activity.timestamp}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        activity.status
                      )}`}
                    >
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                Quick Actions
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Join Live Session</span>
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Submit Assignment</span>
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Create Notes</span>
                </button>
                <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Browse Courses</span>
                </button>
              </div>
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  📢 Announcements
                </h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  VIEW ALL
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="flex items-start space-x-3"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        announcement.priority === "high"
                          ? "bg-red-500"
                          : announcement.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {announcement.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {announcement.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Study Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                Study Statistics
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-700">Study Streak</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {studyStats.streak} days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">Completed Courses</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {studyStats.completedCourses}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700">This Week</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {studyStats.weeklyHours}h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
