import UnderDevelopmentPage from "@/app/under-development";

export default function PrivacyPage() {
  const searchParams = {
    title: "Our team is currently working on this page",
    returnUrl: "/",
    returnText: "Back to Home",
  };

  return <UnderDevelopmentPage searchParams={searchParams} />;
}
