"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 400C200 300 400 500 600 400C800 300 1000 500 1200 400V800H0V400Z"
            fill="url(#gradient1)"
          />
          <path
            d="M0 500C200 400 400 600 600 500C800 400 1000 600 1200 500V800H0V500Z"
            fill="url(#gradient2)"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-fade-in">
          Learn Without
          <span className="block text-blue-600">Limits</span>
        </h1>

        <p
          className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          Transform your educational journey with our cutting-edge Learning
          Management System. Create, manage, and deliver exceptional learning
          experiences.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <Button
            size="lg"
            onClick={() => router.push("/signin")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
          >
            Start Learning Today
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg"
          >
            Watch Demo
          </Button>
        </div>

        <div
          className="mt-16 animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          <p className="text-gray-500 text-sm mb-4">
            Trusted by 10,000+ learners worldwide
          </p>
          <div className="flex justify-center space-x-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">Company A</div>
            <div className="text-2xl font-bold text-gray-400">Company B</div>
            <div className="text-2xl font-bold text-gray-400">Company C</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
