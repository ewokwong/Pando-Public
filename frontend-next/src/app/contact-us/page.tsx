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
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19.321 5.562a5.124 5.124 0 0 1-3.414-1.267 5.124 5.124 0 0 1-1.537-3.168h-3.766v13.206c0 1.55-1.257 2.807-2.807 2.807a2.807 2.807 0 0 1-2.807-2.807 2.807 2.807 0 0 1 2.807-2.807c.193 0 .381.019.562.055V7.725a6.641 6.641 0 0 0-.562-.024 6.58 6.58 0 0 0-6.58 6.58A6.58 6.58 0 0 0 7.797 20.86a6.58 6.58 0 0 0 6.58-6.58V9.07a8.726 8.726 0 0 0 4.944 1.525V6.83c-.001 0-.001 0 0 0v-1.27Z" />
                  </svg>
                </div>
                <div>
                  <span className="text-lg font-medium block">TikTok</span>
                  <span className="text-gray-500 text-sm">@pando_tennis</span>
                </div>
                <ExternalLink size={16} className="ml-2 opacity-50" />
              </a>

              {/* X (Twitter) */}
              <a
                href="https://x.com/pandotennis"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors group"
              >
                <div className="bg-black p-3 rounded-lg text-white mr-4 group-hover:shadow-md transition-all">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <div>
                  <span className="text-lg font-medium block">X</span>
                  <span className="text-gray-500 text-sm">@pandotennis</span>
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
                className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-md transition-all shadow-md hover:shadow-lg"
              >
                <MessageSquare size={18} className="mr-2" />
                <span className="font-medium">Share Your Feedback</span>
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
