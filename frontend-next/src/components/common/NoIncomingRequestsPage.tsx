import Link from "next/link"
import MainPageContainer from "@/components/common/MainPageContainer"
import { Button } from "@/components/ui/button"
import { Search, UserPlus } from "lucide-react"

const NoIncomingRequestsPage = () => {
  return (
    <MainPageContainer>
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserPlus size={32} className="text-brand-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">No Connection Requests</h2>

          <p className="text-gray-600 mb-6">
            You don't have any incoming connection requests at the moment. Start expanding your tennis network!
          </p>

          <Link href="/search" legacyBehavior>
            <Button className="bg-brand-500 hover:bg-brand-600 inline-flex items-center gap-2">
              <Search size={16} />
              <span>Find Tennis Players</span>
            </Button>
          </Link>
        </div>
      </div>
    </MainPageContainer>
  );
}

export default NoIncomingRequestsPage

