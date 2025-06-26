// components/ui/auth-background.tsx
import { ReactNode } from "react";

interface AuthBackgroundProps {
  children: ReactNode;
}

const AuthBackground = ({ children }: AuthBackgroundProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
      {/* Background Pattern - Light Mode Version */}
      <div className="absolute inset-0 opacity-20">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Flowing curves similar to the dark version but lighter */}
          <path
            d="M-100 200C100 100 300 300 500 200C700 100 900 300 1100 200C1300 100 1500 300 1700 200V0H-100V200Z"
            stroke="url(#lightGradient1)"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M-100 250C100 150 300 350 500 250C700 150 900 350 1100 250C1300 150 1500 350 1700 250V0H-100V250Z"
            stroke="url(#lightGradient2)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M-100 300C100 200 300 400 500 300C700 200 900 400 1100 300C1300 200 1500 400 1700 300V0H-100V300Z"
            stroke="url(#lightGradient3)"
            strokeWidth="2"
            fill="none"
          />

          {/* Bottom curves */}
          <path
            d="M-100 600C100 500 300 700 500 600C700 500 900 700 1100 600C1300 500 1500 700 1700 600V800H-100V600Z"
            stroke="url(#lightGradient1)"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M-100 650C100 550 300 750 500 650C700 550 900 750 1100 650C1300 550 1500 750 1700 650V800H-100V650Z"
            stroke="url(#lightGradient2)"
            strokeWidth="2"
            fill="none"
          />

          <defs>
            <linearGradient
              id="lightGradient1"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient
              id="lightGradient2"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient
              id="lightGradient3"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {children}
    </div>
  );
};

export default AuthBackground;
