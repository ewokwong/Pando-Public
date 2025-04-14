"use client"

import { motion } from "framer-motion"
import { Lock, Database, Share2, Shield, UserCheck, ChevronDown } from "lucide-react"
import FullPageContainer from "@/components/common/FullPageContainer"
import { useState } from "react"

export default function PrivacyPage() {
  const [expandedSection, setExpandedSection] = useState<number | null>(null)

  const toggleSection = (index: number) => {
    if (expandedSection === index) {
      setExpandedSection(null)
    } else {
      setExpandedSection(index)
    }
  }

  const sections = [
    {
      title: "Information We Collect",
      icon: <Database className="h-5 w-5 text-blue-500" />,
      content: (
        <ul className="list-disc pl-5 space-y-2 text-left">
          <li>Basic account information (such as name, email address).</li>
          <li>Any profile data you voluntarily provide (e.g., UTR, playing preferences).</li>
          <li>Usage data and analytics to improve our service.</li>
        </ul>
      ),
    },
    {
      title: "How We Use Your Information",
      icon: <UserCheck className="h-5 w-5 text-green-500" />,
      content: (
        <ul className="list-disc pl-5 space-y-2 text-left">
          <li>To provide and improve the functionality of the platform.</li>
          <li>To match you with other users based on your preferences.</li>
          <li>To communicate with you regarding your account or our services.</li>
          <li>To analyze usage patterns and optimize user experience.</li>
        </ul>
      ),
    },
    {
      title: "Data Sharing",
      icon: <Share2 className="h-5 w-5 text-amber-500" />,
      content:
        "We do not sell or rent your personal data. We may share data only when required by law or to protect our rights.",
    },
    {
      title: "Data Security",
      icon: <Shield className="h-5 w-5 text-purple-500" />,
      content:
        "We take reasonable steps to protect your information, but no method is 100% secure. Use the service at your own risk.",
    },
    {
      title: "Your Rights",
      icon: <UserCheck className="h-5 w-5 text-red-500" />,
      content: "You may request to delete your account and associated data at any time by contacting us.",
    },
  ]

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  }

  return (
    <FullPageContainer>
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-10 max-w-3xl w-full shadow-xl border border-gray-100"
        >
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-brand-50 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-50 rounded-full opacity-50 blur-xl"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-center mb-2">
                <Lock className="h-8 w-8 text-brand-500 mr-2" />
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight"
                >
                  Privacy Policy
                </motion.h1>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-gray-500 text-center mb-6"
              >
                Last updated: April 14, 2023
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-gray-600 text-center mb-8"
              >
                <p>
                  Pando ("we", "our", or "us") values your privacy. This Privacy Policy explains how we collect, use,
                  and protect your information when you use our platform.
                </p>
              </motion.div>

              <div className="space-y-4">
                {sections.map((section, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleSection(index)}
                      className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <div className="mr-3 flex-shrink-0">{section.icon}</div>
                        <h2 className="text-lg font-semibold text-gray-800">{`${index + 1}. ${section.title}`}</h2>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                          expandedSection === index ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedSection === index ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <div className="p-4 bg-white text-gray-600">{section.content}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500"
              >
                <p>
                  For privacy-related inquiries, please contact us at{" "}
                  <a href="mailto:privacy@pando.com" className="text-brand-500 hover:underline">
                    privacy@pando.com
                  </a>
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </FullPageContainer>
  )
}
