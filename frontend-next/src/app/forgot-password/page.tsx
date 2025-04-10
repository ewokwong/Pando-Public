import UnderDevelopmentPage from "@/app/under-development";

export default function ForgotPasswordPage() {
  const searchParams = {
    title: "Our team is currently working on this page.",
    returnUrl: "/login",
    returnText: "Back to Login",
  };

  return <UnderDevelopmentPage searchParams={searchParams} />;
}
