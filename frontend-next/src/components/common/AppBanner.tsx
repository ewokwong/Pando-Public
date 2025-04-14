"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Users, Percent, Trophy, Sparkles } from "lucide-react"

interface AppBannerProps {
  className?: string
}

const AppBanner: React.FC<AppBannerProps> = ({ className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-brand-500/90 via-brand-600/90 to-brand-700/90 backdrop-blur-sm shadow-lg ${className}`}
    >
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
      <div className="absolute h-32 w-32 rounded-full bg-white/10 blur-2xl -top-10 -left-10"></div>
      <div className="absolute h-32 w-32 rounded-full bg-white/10 blur-2xl -bottom-10 -right-10"></div>

      <div className="relative px-4 py-6 md:px-8 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <Sparkles className="h-5 w-5 mr-2 text-yellow-300" />
              <h2 className="text-sm font-medium text-yellow-300">TENNIS PARTNER MATCHING</h2>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Find Your Perfect Tennis Match</h1>

            <p className="text-white/80 text-sm md:text-base mb-4 md:mb-0 max-w-2xl">
              Our smart algorithm matches you with compatible tennis partners based on your UTR rating, playing
              preferences, and other metrics to create meaningful connections on the court.
            </p>
          </div>

          {/* <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0 md:ml-6">
            <Link href="/search" passHref>
              <Button className="w-full md:w-auto bg-white text-brand-600 hover:bg-white/90 hover:text-brand-700">
                Find Players
              </Button>
            </Link>
            <Link href="/sign-up" passHref>
              <Button variant="outline" className="w-full md:w-auto border-white/30 text-white hover:bg-white/10">
                Sign Up
              </Button>
            </Link>
          </div> */}
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap gap-3 mt-5">
          <div className="flex items-center bg-white/10 rounded-full px-3 py-1.5">
            <Trophy className="h-4 w-4 text-yellow-300 mr-1.5" />
            <span className="text-xs text-white">UTR-Based Matching</span>
          </div>
          <div className="flex items-center bg-white/10 rounded-full px-3 py-1.5">
            <Percent className="h-4 w-4 text-green-300 mr-1.5" />
            <span className="text-xs text-white">Compatibility Score</span>
          </div>
          <div className="flex items-center bg-white/10 rounded-full px-3 py-1.5">
            <Users className="h-4 w-4 text-blue-300 mr-1.5" />
            <span className="text-xs text-white">Preference Matching</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AppBanner
