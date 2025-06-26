import CourseCard from "@/components/Courses/CourseCard";

export default function CoursesPage() {
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 items-center">
      <div className="w-full max-w-7xl flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 justify-items-center md:justify-items-stretch">
          <CourseCard
            title="first"
            description="description"
            thumbnailurl="https://res.cloudinary.com/dyktjldc4/image/upload/v1750934017/jtsv9xq5fra1qzyx5q32.png"
          />
          <CourseCard
            title="first"
            description="description"
            thumbnailurl="https://res.cloudinary.com/dyktjldc4/image/upload/v1750934017/jtsv9xq5fra1qzyx5q32.png"
          />
          <CourseCard
            title="first"
            description="description"
            thumbnailurl="https://res.cloudinary.com/dyktjldc4/image/upload/v1750934017/jtsv9xq5fra1qzyx5q32.png"
          />
        </div>
      </div>
    </div>
  );
}
