"use client"

import type React from "react"
import FullPageContainer from "@/components/common/FullPageContainer"
import { FaCheckCircle, FaUsers, FaChartLine } from "react-icons/fa"
import { motion } from "framer-motion"

interface ValueCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

const ValueCard: React.FC<ValueCardProps> = ({ icon, title, description }) => {
  return (
    <motion.div
      className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:bg-white/15"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-5xl mb-4 text-blue-500">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 italic">{title}</h3>
      <p className="text-center text-gray-200 text-sm">{description}</p>
    </motion.div>
  )
}

const OurMission: React.FC = () => {
  return (
    <FullPageContainer>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-6 text-white">Our Mission</h1>
          <div className="space-y-4 text-gray-200">
            <p className="text-lg">
              Our mission is to make tennis more accessible for <span className="font-bold">everyone</span>, from
              complete beginners to professionals.
            </p>
            <p className="text-lg">
              After taking a few years off from tennis, I found it challenging to get back into the game. I was unsure about the skill levels at local clubs and, honestly, wasn’t too keen on practicing against a wall.
            </p>
            <p className="text-xl font-bold text-gray-300">
                and so, Pando was born!
              </p>
            <div className="text-lg">
              <p>
                Our solution is <span className="font-bold">two-fold</span>:
              </p>
              <ol className="list-decimal pl-6 mt-2 space-y-2">
                <li>Provide a platform which will efficiently match users taking into account level, location and playing preferences</li>
                <li>Giving our community the chance to connect and have the autonomy to decide who they play with</li>
              </ol>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-white">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ValueCard
              icon={<FaUsers />}
              title="Community Driven"
              description="We prioritize the needs and feedback of our community in all our initiatives."
            />
            <ValueCard
              icon={<FaChartLine />}
              title="Growth Comes First"
              description="Everything we do is to learn and help others learn."
            />
            <ValueCard
              icon={<FaCheckCircle />}
              title="Inclusivity"
              description="We embrace diversity and ensure everyone feels welcome."
            />
          </div>
        </motion.section>

        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <p className="text-lg text-gray-200">
              If you agree with our mission and want to join us in making a difference to the Tennis Community,{" "}
              <a
                href="https://forms.gle/LA51P9TLGP25vwZ97"
                className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                join the Team!
              </a>
            </p>
          </div>
        </motion.section>
      </div>
    </FullPageContainer>
  )
}

export default OurMission

