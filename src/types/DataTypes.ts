export interface User {
  id: string;
  profileImage: string;
  email: string;
  phoneNumber?: string;
  isVerified: boolean;
  username: string;
  name: string;
  role: Role;
  devices: Devices[];
  deviceLimit: 2;
  createdCourses: Course[];
  enrolledCourses: CourseEnrollment[];
  createdClasses: Classes[];
  createdAt: string;
  updatedAt: string;
}
export interface Devices {
  id: string;
  user: User;
  userId: string;
  osName: string;
  browserName: string;
  deviceIp: string;
  refreshToken: string;
  createdAt: string;
}
enum Role {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}
export interface CourseEnrollment {
  id: string;
  student?: User;
  studentId?: string;
  course?: Course;
  courseId?: string;
  enrolledAt?: string; //Date and time
  completedAt?: string; //Date and time
  lastAccessedAt?: string; //Date and time
}
export interface CourseEnrollmentRequest {
  id: string;
  student?: User;
  studentId?: string;
  course?: Course;
  courseId?: string;
  status: RequestStatus;
}
enum RequestStatus {
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  ACCEPTED = "ACCEPTED",
}
export interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  isActive?: boolean;
  price?: number;
  category?: string;
  creator?: User;
  creatorId: string;
  enrollments?: CourseEnrollment[];
  classes?: Classes[];
  _count?: { classes: number };
  createdAt?: string;
  updatedAt?: string;
  Note?: Note[];
  Assignment?: Assignment[];
  Attachments?: Attachment[];
}
export interface Note {
  id: string;
  notesHtml: string;
  class: Classes;
  classId: string;
  course: Course;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}
export interface Attachment {
  id: string;
  attachment: string;
  class: Classes;
  classId: string;
  course: Course;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}
export interface Assignment {
  id: string;
  assignments: string;
  class: Classes;
  classId: string;
  course: Course;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Classes {
  id: string;
  title: string;
  description: string;
  videoLink?: string;
  zoomLink?: string;
  attachments: Attachment[];
  notes: Note[];
  assignments: Assignment[];
  course: Course;
  courseId: string;
  creator: User;
  creatorId: string;
  scheduledAt?: string; //date and time
  attendanceCount: number;
  isLive: boolean;
  isRecorded: boolean;
  isActive: boolean;
  createdAt: string; //date and time
  updatedAt: string; //date and time
}
export interface PaginationData {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
