"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, EyeOff, Upload, User, X } from "lucide-react";

import { setUser } from "@/store/slices/userSlice";
import calculatePasswordStrength from "@/lib/PasswordStrength";
import Link from "next/link";

// Constants
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_PFP;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const PASSWORD_ERROR_MESSAGE =
  "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";

// Types
interface FormData {
  code: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  profileImage: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export default function SignupForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    code: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    profileImage: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Validation state
  const [otp, setOtp] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Helper functions
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validatePassword = (password: string) => {
    if (password.length === 0) {
      setPasswordError("");
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      setPasswordError(PASSWORD_ERROR_MESSAGE);
    } else {
      setPasswordError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    handleInputChange("password", password);
    setPasswordStrength(calculatePasswordStrength(password));
    validatePassword(password);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  // API calls
  const checkEmailExists = async (email: string): Promise<boolean> => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/check-email`,
      { email }
    );
    return response.data === true;
  };

  const checkUsernameExists = async (username: string): Promise<boolean> => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/check-username`,
      { username }
    );
    return response.data === true;
  };

  const sendOtpRequest = async (email: string) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/request-otp`,
      { email }
    );
    return response;
  };

  const submitSignup = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/signup-student`,
      {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        username: formData.username,
        profileImage: formData.profileImage,
        code: otp,
      }
    );
    return response;
  };

  // Event handlers
  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!PASSWORD_REGEX.test(formData.password)) {
      toast.error(PASSWORD_ERROR_MESSAGE);
      return;
    }

    try {
      // Check if email already exists
      const emailExists = await checkEmailExists(formData.email);
      if (emailExists) {
        toast.error("Email already exists");
        return;
      }

      // Check if username already exists
      const usernameExists = await checkUsernameExists(formData.username);
      if (usernameExists) {
        toast.error("Username already exists, please select another username");
        return;
      }

      // Send OTP
      const response = await sendOtpRequest(formData.email);
      if (response.status === 201) {
        toast.success("OTP sent to your email");
        setShowOtpDialog(true);
      }
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      const errorMessage =
        error?.response?.data?.message || "Error sending OTP";
      toast.error(errorMessage);
    }
  };

  const handleSubmitSignup = async () => {
    if (otp.length !== 6) {
      toast.error("Please provide valid 6-digit OTP");
      return;
    }

    setIsVerifyingOtp(true);

    try {
      const response = await submitSignup();

      // Store tokens and user data
      localStorage.setItem("refreshToken", response.data.refreshToken);
      dispatch(
        setUser({
          accessToken: response.data.accessToken,
          user: response.data.user,
        })
      );

      toast.success("Account created successfully!");
      router.push("/");
    } catch (error: any) {
      console.error("Signup error:", error);
      const errorMessage = error?.response?.data?.message || "Signup failed";
      toast.error(errorMessage);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setUploadingImage(true);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      handleInputChange("profileImage", data.secure_url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await sendOtpRequest(formData.email);
      toast.success("OTP has been resent to your email");
    } catch (error) {
      console.error("Error resending OTP:", error);

      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  // Computed values
  const isFormValid =
    formData.agreeToTerms &&
    !uploadingImage &&
    passwordError.length === 0 &&
    formData.password === formData.confirmPassword &&
    formData.password.length > 0 &&
    formData.confirmPassword.length > 0;

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const passwordsDontMatch =
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Logo */}
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-900 mb-8">
          lms<span className="text-blue-600">.</span>
        </div>
      </div>

      {/* Sign Up Form */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        </div>

        <form className="space-y-6" onSubmit={handleSendOtp}>
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {formData.profileImage ? (
                <div className="relative">
                  <img
                    src={formData.profileImage}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleInputChange("profileImage", "")}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-gray-200 flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImage}
              />
              <label
                htmlFor="profileImage"
                className={`flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  uploadingImage ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Upload className="h-4 w-4" />
                <span className="text-sm">
                  {uploadingImage ? "Uploading..." : "Upload Photo"}
                </span>
              </label>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-gray-700 font-medium">
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="John"
                className="mt-2 bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-gray-700 font-medium">
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Doe"
                className="mt-2 bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <Label htmlFor="username" className="text-gray-700 font-medium">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="johntech"
              className="mt-2 bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="name@gmail.com"
              className="mt-2 bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Password
            </Label>
            <div className="relative mt-2">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handlePasswordChange}
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

            {/* Password Strength & Validation */}
            {formData.password.length > 0 && (
              <div className="mt-1 text-xs text-gray-500">
                <div className="flex items-center">
                  <span>Strength: </span>
                  <div className="flex ml-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 w-4 mx-px rounded-sm ${
                          i <= passwordStrength
                            ? i <= 2
                              ? "bg-red-500"
                              : i === 3
                              ? "bg-yellow-500"
                              : "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label
              htmlFor="confirmPassword"
              className="text-gray-700 font-medium"
            >
              Confirm Password
            </Label>
            <div className="relative mt-2">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className="bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {passwordsDontMatch && (
              <p className="mt-1 text-xs text-red-500">Passwords don't match</p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) =>
                handleInputChange("agreeToTerms", checked)
              }
            />
            <Label htmlFor="terms" className="text-sm text-gray-600 leading-5">
              I agree to the{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
              >
                Terms and Conditions
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
              >
                Privacy Policy
              </button>
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
            disabled={!isFormValid}
          >
            Send OTP
          </Button>
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href={"/Signin"}
              className="text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
            >
              Sign In
            </Link>
          </span>
        </div>
      </div>

      {/* OTP Verification Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Your Email</DialogTitle>
            <DialogDescription>
              We've sent a 6-digit verification code to{" "}
              <span className="font-semibold">{formData.email}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="otp" className="text-gray-700 font-medium">
                Enter OTP
              </Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="000000"
                className="mt-2 text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleSubmitSignup}
                disabled={otp.length !== 6 || isVerifyingOtp}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isVerifyingOtp ? "Verifying..." : "Verify"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleResendOtp}
                className="flex-1"
              >
                Resend OTP
              </Button>
            </div>

            <p className="text-sm text-gray-500 text-center">
              Didn't receive the code? Check your spam folder or click resend.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <div className="text-center text-sm text-gray-500">© 2024 by LMS</div>
    </div>
  );
}
