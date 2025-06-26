"use client";
import AuthBackground from "@/components/Auth/Background";
import SignInForm from "@/components/Auth/SigninForm";

export default function Signin() {
  return (
    <AuthBackground>
      <div className="relative z-10 flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <SignInForm />
      </div>
    </AuthBackground>
  );
}
