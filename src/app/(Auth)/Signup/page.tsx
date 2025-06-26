import AuthBackground from "@/components/Auth/Background";
import SignupForm from "@/components/Auth/SignupForm";

export default function Signup() {
  return (
    <AuthBackground>
      <div className="relative z-10 flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <SignupForm />
      </div>
    </AuthBackground>
  );
}
