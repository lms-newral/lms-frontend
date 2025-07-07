"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import Link from "next/link";
import { toast } from "sonner";

export default function SigninForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const checkEmailExists = async (email: string): Promise<boolean> => {
    console.log(email);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/check-email`,
      { email }
    );
    return response.data === true;
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const emailExists = await checkEmailExists(email);
      if (!emailExists) {
        toast.error("User does not exist");
        return;
      }

      const loginUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/login`;
      console.log(loginUrl);
      const res = await axios.post(loginUrl, { email, password });

      localStorage.setItem("refreshToken", res.data.refreshToken);
      dispatch(
        setUser({
          accessToken: res.data.accessToken,
          user: res.data.user,
        })
      );
      router.push("/");
    } catch (e: any) {
      console.log(e);
      toast.error(e.response.data.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Logo */}
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-900 mb-8">
          lms<span className="text-blue-600">.</span>
        </div>
      </div>

      {/* Sign In Form */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Your email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@gmail.com"
              className="mt-2 bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Your password
            </Label>
            <div className="relative mt-2">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
            >
              Forgot your password?
            </button>
          </div>

          <Button
            type="submit"
            disabled={!email || !password || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
          >
            SIGN IN
          </Button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href={"/Signup"}
              className="text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
            >
              Sign Up
            </Link>
          </span>
        </div>
      </div>

      {/* Footer Links */}
      <div className="text-center space-x-4 text-sm text-gray-600">
        <button
          type="button"
          className="hover:text-blue-600 focus:outline-none focus:underline"
        >
          Privacy Policy
        </button>
        <span>•</span>
        <button
          type="button"
          className="hover:text-blue-600 focus:outline-none focus:underline"
        >
          Terms and Conditions
        </button>
      </div>

      <div className="text-center text-sm text-gray-500">© 2024 by LMS</div>
    </div>
  );
}
