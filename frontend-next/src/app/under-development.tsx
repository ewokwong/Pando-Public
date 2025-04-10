"use client"
import { useRouter } from "next/navigation";
import { ArrowLeft, Construction } from "lucide-react";
import MainPageContainer from "@/components/common/MainPageContainer";

interface PageProps {
  searchParams: {
    title?: string;
    returnUrl?: string;
    returnText?: string;
  };
}

export default function UnderDevelopmentPage({ searchParams }: PageProps) {
  const router = useRouter();

  // Default values that can be overridden with URL parameters
  const title = searchParams.title || "This Page is Under Development";
  const returnUrl = searchParams.returnUrl || "/";
  const returnText = searchParams.returnText || "Return to Home";

  return (
    <MainPageContainer>
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12 text-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 max-w-2xl w-full shadow-xl">
          <div className="mb-8">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Construction className="w-10 h-10 text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
            <p className="text-lg text-gray-600">We're currently working on this feature. Please check back soon!</p>
          </div>

          <button
            onClick={() => router.push(returnUrl)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md border border-blue-700 hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {returnText}
          </button>
        </div>
      </div>
    </MainPageContainer>
  );
}

