"use client"

import { Instagram, ExternalLink, Mail, MessageSquare } from "lucide-react"
import FullPageContainer from "@/components/common/FullPageContainer"
import { motion } from "framer-motion"

const ContactUs = () => {
  return (
    <FullPageContainer>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          className="bg-white rounded-xl shadow-md p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-3xl font-bold text-gray-900 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Contact Us
          </motion.h1>

          <motion.section
            className="my-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-6">
              Have questions or want to connect? Reach out to us through any of these channels:
            </p>

            <div className="space-y-6">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/pando_tennis?igsh=MTh5ajdwbnlidThkZw%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 hover:text-pink-600 transition-colors group"
              >
                <div className="bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-500 p-3 rounded-lg text-white mr-4 group-hover:shadow-md transition-all">
                  <Instagram size={24} />
                </div>
                <div>
                  <span className="text-lg font-medium block">Instagram</span>
                  <span className="text-gray-500 text-sm">@pando_tennis</span>
                </div>
                <ExternalLink size={16} className="ml-2 opacity-50" />
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@pando_tennis?_t=ZS-8vKpeTfUFYP&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 hover:text-black transition-colors group"
              >
                <div className="bg-black p-3 rounded-lg text-white mr-4 group-hover:shadow-md transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                    <path d="M15 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                    <path d="M15 8v8a4 4 0 0 1-4 4" />
                    <line x1="15" y1="4" x2="15" y2="12" />
                  </svg>
                </div>
                <div>
                  <span className="text-lg font-medium block">TikTok</span>
                  <span className="text-gray-500 text-sm">@pando_tennis</span>
                </div>
                <ExternalLink size={16} className="ml-2 opacity-50" />
              </a>

              {/* Email */}
              <a
                href="mailto:pandotennis@gmail.com"
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors group"
              >
                <div className="bg-blue-500 p-3 rounded-lg text-white mr-4 group-hover:shadow-md transition-all">
                  <Mail size={24} />
                </div>
                <div>
                  <span className="text-lg font-medium block">Email</span>
                  <span className="text-gray-500 text-sm">pandotennis@gmail.com</span>
                </div>
              </a>
            </div>
          </motion.section>

          <motion.section
            className="my-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Give Feedback</h2>
            <div className="max-w-2xl">
              <p className="text-gray-600 mb-6">
                We value your feedback. Please fill out our feedback form to let us know of any bugs, possible
                improvements, or what new functionality you would like to see!
              </p>

              <a
                href="https://forms.gle/i29f223SgHgJ2isP6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-brand-500 hover:bg-brand-600 text-white px-5 py-3 rounded-md transition-colors shadow-sm hover:shadow-md"
              >
                <MessageSquare size={18} className="mr-2" />
                <span>Feedback Form</span>
                <ExternalLink size={14} className="ml-2" />
              </a>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </FullPageContainer>
  )
}

export default ContactUs

