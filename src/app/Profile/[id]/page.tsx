"use client";
import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  Shield,
  Calendar,
  BookOpen,
  Users,
  Monitor,
} from "lucide-react";
import axios from "axios";
import { User } from "@/types/DataTypes";
import { useParams } from "next/navigation";

export default function UserProfilePage() {
  const param = useParams();
  // Mock user data based on the User model
  const [currentUser, setCurrentUser] = useState<User>();

  useEffect(() => {
    async function getUserData() {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}user/${param.id}`
      );
      console.log(response.data);
      setCurrentUser(response.data);
    }
    getUserData();
  }, [param]);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "INSTRUCTOR":
        return "bg-blue-100 text-blue-800";
      case "STUDENT":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={currentUser?.profileImage}
                  alt={currentUser?.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                />
                {currentUser?.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                    <Shield className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {currentUser?.name}
                  </h1>
                  <p className="text-gray-600">@{currentUser?.username}</p>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      currentUser?.role && getRoleBadgeColor(currentUser?.role)
                    }`}
                  >
                    {currentUser?.role}
                  </span>
                  {currentUser?.isVerified && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{currentUser?.email}</span>
            </div>
            {currentUser?.phoneNumber && (
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  {currentUser?.phoneNumber}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Account Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="text-gray-700">
                  {formatDate(currentUser?.createdAt || "")}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Monitor className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Device Limit</p>
                <p className="text-gray-700">
                  {currentUser?.devices.length}/{currentUser?.deviceLimit}{" "}
                  devices
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Devices */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Connected Devices
          </h2>
          <div className="space-y-3">
            {currentUser?.devices.map((device, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Monitor className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {device.browserName}
                    </p>
                    <p className="text-sm text-gray-500">{device.osName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Last Active</p>
                  <p className="text-sm font-medium text-gray-700">
                    {formatDate(device.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Courses Section */}
        <div className=" flex flex-col md:flex-row  gap-6">
          {/* Enrolled Courses */}
          <div className="bg-white rounded-lg shadow-sm p-6 flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Enrolled Courses ({currentUser?.enrolledCourses.length})
            </h2>
            <div className="space-y-3">
              {currentUser?.enrolledCourses.map((course, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">
                    {course.course?.title}
                  </h3>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>
                        Enrolled on{" "}
                        {course.enrolledAt && formatDate(course.enrolledAt)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.course?.price}%` }} // it is a progress bar use course.course.progress in v2
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Created Content */}
          {currentUser?.role !== "STUDENT" && (
            <div className="bg-white rounded-lg shadow-sm p-6 flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Created Content
              </h2>

              {currentUser?.createdCourses &&
                currentUser.createdCourses.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-700 mb-2">
                      Courses ({currentUser.createdCourses.length})
                    </h3>
                    <div className="space-y-2">
                      {currentUser.createdCourses.map((course) => (
                        <div
                          key={course.id}
                          className="flex items-center justify-between p-2 bg-green-50 rounded"
                        >
                          <span
                            className="text-sm text-gray-700" // include students in the course number below this span in v2
                          >
                            {course.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
          {currentUser?.createdClasses &&
            currentUser.createdClasses.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">
                  Classes ({currentUser.createdClasses.length})
                </h3>
                <div className="space-y-2">
                  {currentUser.createdClasses.map((class_) => (
                    <div
                      key={class_.id}
                      className="flex items-center justify-between p-2 bg-blue-50 rounded"
                    >
                      <span className="text-sm text-gray-700">
                        {class_.title}
                      </span>
                      <span className="text-xs text-blue-600">
                        {class_.attendanceCount} students
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* 
        { currentUser?.enrollmentRequests > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
          <span className="font-medium">
          {currentUser?.enrollmentRequests}
          </span>{" "}
          pending enrollment requests
          </p>
          </div>
        )}
        </div>
        */}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Last updated:{" "}
            {currentUser?.updatedAt && formatDate(currentUser?.updatedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
