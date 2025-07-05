"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useRef, useEffect } from "react";
import { UserState } from "@/types/userstate";
import { useSelector } from "react-redux";

const Hero = () => {
  const router = useRouter();

  const user = useSelector((state: { user: UserState }) => state.user);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const paraRef = useRef<HTMLParagraphElement | null>(null);
  const btnsRef = useRef<HTMLDivElement | null>(null);
  const trustRef = useRef<HTMLParagraphElement | null>(null);


  useEffect(() => {
    const tl = gsap.timeline();

    setTimeout(() => {
      if (
        titleRef.current &&
        paraRef.current &&
        btnsRef.current &&
        trustRef.current
      ) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
        )
          .fromTo(
            paraRef.current,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
            "-=0.5"
          )
          .fromTo(
            btnsRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
            "-=0.5"
          )
          .fromTo(
            trustRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
            "-=0.4"
          );
      }
    }, 0);
  }, []);

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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1
          ref={titleRef}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6"
        >
          Empower Your Learning
          <span className="block text-blue-600">Anytime, Anywhere</span>
        </h1>

        <p
          ref={paraRef}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto"
        >
          Join a powerful LMS platform that helps students and educators connect, collaborate, and succeed. Access courses, assignments, and progress tracking — all in one place.
        </p>

        <div
          ref={btnsRef}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
        >
          <Button
            size="lg"
            onClick={() => {
              if (user?.accessToken) {
                router.push("/Dashboard");
              } else {
                router.push("/Signin");
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
          >
            Start Learning Today
          </Button>
        </div>

        <div className="mt-10 sm:mt-14">
          <p
            ref={trustRef}
            className="text-xs sm:text-sm md:text-base text-gray-500 mb-4"
          >
            Trusted by 10,000+ learners worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-4 opacity-60">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-400">
              Company A
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-400">
              Company B
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-400">
              Company C
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
