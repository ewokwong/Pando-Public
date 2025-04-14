"use client"

import { motion } from "framer-motion"
import { Shield, CheckCircle, AlertTriangle, XCircle, RefreshCw, ChevronDown } from "lucide-react"
import FullPageContainer from "@/components/common/FullPageContainer"
import { useState } from "react"

export default function TermsPage() {
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
      title: "Eligibility",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      content:
        "You must be at least 18 years old to use this service. By signing up, you confirm that you meet this requirement.",
    },
    {
      title: "Acceptable Use",
      icon: <Shield className="h-5 w-5 text-blue-500" />,
      content: (
        <ul className="list-disc pl-5 space-y-2 text-left">
          <li>Use the platform responsibly and respectfully.</li>
          <li>Not misuse the service or harm other users.</li>
        </ul>
      ),
    },
    {
      title: "No Liability",
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      content: (
        <>
          <p className="mb-2">We provide this service "as-is." We are not responsible or liable for:</p>
          <ul className="list-disc pl-5 space-y-2 text-left">
            <li>Any interactions or meetups arranged through the platform.</li>
            <li>Any damages, injuries, or issues that arise from your use of the service.</li>
          </ul>
        </>
      ),
    },
    {
      title: "Termination",
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      content: "We may suspend or terminate your account if you violate these terms.",
    },
    {
      title: "Changes to These Terms",
      icon: <RefreshCw className="h-5 w-5 text-purple-500" />,
      content:
        "We may update these terms or our Privacy Policy at any time. Continued use of the platform indicates your acceptance of the updated policies.",
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
                <Shield className="h-8 w-8 text-brand-500 mr-2" />
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight"
                >
                  Terms of Service
                </motion.h1>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-gray-500 text-center mb-6"
              >
                Last updated: April 14, 2025
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-gray-600 text-center mb-8"
              >
                By using Pando, you agree to the following terms:
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
                  If you have any questions about these Terms, please contact us at{" "}
                  <a href="pandotennis@gmail.com" className="text-brand-500 hover:underline">
                    support@pando.com
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
