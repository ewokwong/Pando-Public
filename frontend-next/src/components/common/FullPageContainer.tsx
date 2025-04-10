"use client"

import type React from "react"
import type { ReactNode } from "react"
import MainPageContainer from "./MainPageContainer"
import Navbar from "./NavBar"
import Footer from "./Footer"
import ProfileCompletionHeader from "./ProfileCompletionHeader"

interface FullPageContainerProps {
  children: ReactNode
  [key: string]: any
}

const FullPageContainer: React.FC<FullPageContainerProps> = ({ children, ...props }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="mt-16 md:mt-20 w-full">
        <ProfileCompletionHeader />
      </div>
      <MainPageContainer {...props}>{children}</MainPageContainer>
      <Footer />
    </div>
  )
}

export default FullPageContainer

