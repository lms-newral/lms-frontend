"use client";
import React, { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  AlertCircle,
  UserPen,
} from "lucide-react";
import axios from "axios";
import { CourseEnrollmentRequest, User } from "@/types/DataTypes";
import { FaChalkboardTeacher } from "react-icons/fa";
type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
};
type StatCardProps = {
  title: string;
  value: number | string;
  icon: React.ElementType;
  trend?: string;
  color?: string;
};
export default function AdminDashboard() {
  const [students, setStudents] = useState<User[]>();
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [teachers, setTeachers] = useState<User[]>();
  const [totalTeachers, setTotalTeachers] = useState<number>(0);
  const [users, setUsers] = useState<User[]>();
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [enrollmentRequests, setEnrollmentRequests] =
    useState<CourseEnrollmentRequest[]>();
  const [pendingEnrollmentRequests, setPendingEnrollmentRequests] =
    useState<number>(0);
  useEffect(() => {
    async function getStudents() {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}user/filter?role=STUDENT`
      );
      setStudents(response.data);
      setTotalStudents(response.data.length);
    }
    async function getTeachers() {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}user/filter?role=TEACHER`
      );
      setTeachers(response.data);
      setTotalTeachers(response.data.length);
    }
    async function getAllUsers() {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}user/filter`
      );
      setUsers(response.data);
      setTotalUsers(response.data.length);
    }
    async function getAllCourses() {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}course`
      );
      setTotalCourses(response.data.data.length);
    }
    async function getEnrollmentRequests() {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}request-enrollment/`
      );
      setPendingEnrollmentRequests(response.data.length);
    }
    async function getPendingEnrollmentRequests() {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}request-enrollment/all`
      );
      setEnrollmentRequests(response.data);
    }
    getAllUsers();
    getTeachers();
    getStudents();
    getAllCourses();
    getEnrollmentRequests();
    getPendingEnrollmentRequests();
  }, []);

  // Mock data - in real app, this would come from your backend
  const dashboardStats = {
    activeCourses: 28,
    totalClasses: 156,
    liveClasses: 8,
    deviceSessions: 1854,
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    color = "blue",
  }: StatCardProps) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && <p className="text-sm text-green-600 mt-1">↗ {trend}</p>}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const Badge = ({ children, variant = "default" }: BadgeProps) => {
    const variants = {
      default: "bg-gray-100 text-gray-800",
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      danger: "bg-red-100 text-red-800",
      info: "bg-blue-100 text-blue-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${variants[variant]}`}
      >
        {children}
      </span>
    );
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          trend="+12%"
          color="blue"
        />
        <StatCard
          title="Total students"
          value={totalStudents}
          icon={UserPen}
          trend="+12%"
          color="blue"
        />
        <StatCard
          title="Total Teachers"
          value={totalTeachers}
          icon={FaChalkboardTeacher}
          trend="+12%"
          color="blue"
        />
        <StatCard
          title="Active Courses"
          value={totalCourses}
          icon={BookOpen}
          trend="+5%"
          color="green"
        />
        <StatCard
          title="Live Classes"
          value={dashboardStats.liveClasses}
          icon={Activity}
          color="purple"
        />
        <StatCard
          title="Pending Requests"
          value={pendingEnrollmentRequests}
          icon={AlertCircle}
          color="orange"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
          <div className="space-y-3">
            {users &&
              users.slice(0, 5).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={user.role === "TEACHER" ? "info" : "default"}
                    >
                      {user.role}
                    </Badge>
                    {user.isVerified ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Students</h3>
          <div className="space-y-3">
            {students &&
              students.slice(0, 5).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={user.role === "TEACHER" ? "info" : "default"}
                    >
                      {user.role}
                    </Badge>
                    {user.isVerified ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Teachers</h3>
          <div className="space-y-3">
            {teachers &&
              teachers.slice(0, 5).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={user.role === "TEACHER" ? "info" : "default"}
                    >
                      {user.role}
                    </Badge>
                    {user.isVerified ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Enrollment Requests</h3>
          <div className="space-y-3 overflow-y">
            {enrollmentRequests &&
              enrollmentRequests.map((request: CourseEnrollmentRequest) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium">{request.student?.username}</p>
                    <p className="text-sm text-gray-600">
                      {request.course?.title}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        request.status === "PENDING"
                          ? "warning"
                          : request.status === "ACCEPTED"
                          ? "success"
                          : "danger"
                      }
                    >
                      {request.status}
                    </Badge>
                    {request.status === "PENDING" && (
                      <div className="flex space-x-1">
                        <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen  bg-gray-100 flex">
      {/* Main Content */}
      <div className="flex-1 lg:max-w-7xl max-w-5xl mx-auto overflow-hidden">
        {/* Content */}
        <div className="p-6 overflow-y-auto h-full">{<OverviewTab />}</div>
      </div>
    </div>
  );
}
