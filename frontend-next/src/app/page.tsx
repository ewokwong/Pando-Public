"use client"

import type React from "react"
import { useState, type ChangeEvent, type FormEvent } from "react"
import FullPageContainer from "@/components/common/FullPageContainer"
import Modal from "../components/common/Modal"
import SmallModal from "../components/common/SmallModal"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { useAuth } from "@/context/AuthContext"
import {
  Info,
  Book,
  ExternalLink,
  BookOpenCheck,
  CheckCircle2,
  UserPlus,
  MessageCircle,
  ThumbsUp,
  UserCircle,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

// Define the type for resource data
interface ResourceData {
  title: string
  description: string
  level: string
  tags: Record<string, boolean>
}

const HomePage: React.FC = () => {
  const { isLoggedIn } = useAuth()
  const [isCreateResourceModalOpen, setCreateResourceModalOpen] = useState(false)
  const [isLoginAlertModalOpen, setLoginAlertModalOpen] = useState(false)
  const [resourceData, setResourceData] = useState<ResourceData>({
    title: "",
    description: "",
    level: "",
    tags: {
      fun_social: false,
      training_for_competitions: false,
      fitness: false,
      learning_tennis: false,
    },
  })
  const [errorMessage, setErrorMessage] = useState("")

  const handleCreateResource = () => {
    if (!isLoggedIn) {
      setLoginAlertModalOpen(true)
      return
    }
    setCreateResourceModalOpen(true)
  }

  const closeCreateResourceModal = () => {
    setCreateResourceModalOpen(false)
    setErrorMessage("")
  }

  const closeLoginAlertModal = () => {
    setLoginAlertModalOpen(false)
  }

  const handleCancel = () => {
    resetResourceData()
    closeCreateResourceModal()
  }

  const resetResourceData = () => {
    setResourceData({
      title: "",
      description: "",
      level: "",
      tags: {
        fun_social: false,
        training_for_competitions: false,
        fitness: false,
        learning_tennis: false,
      },
    })
  }

  const handleTagToggle = (tag: string) => {
    setResourceData((prevState) => ({
      ...prevState,
      tags: {
        ...prevState.tags,
        [tag]: !prevState.tags[tag],
      },
    }))
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setResourceData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Check if all fields are filled out
    if (!resourceData.title || !resourceData.description || !resourceData.level) {
      setErrorMessage("All fields must be filled out.")
      return
    }

    // Check if at least one tag is selected
    const isTagSelected = Object.values(resourceData.tags).some((tag) => tag)
    if (!isTagSelected) {
      setErrorMessage("At least one tag must be selected.")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      setErrorMessage("User not authenticated.")
      return
    }

    try {
      const decodedToken = jwtDecode<{ userId: string }>(token)
      const userId = decodedToken.userId
      const response = await axios.post(`http://localhost:5001/api/resource/${userId}/create-resource`, resourceData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log("Resource created:", response.data)
      resetResourceData()
      closeCreateResourceModal()
      window.location.reload() // Reload the page after submission
    } catch (error) {
      console.error("Error creating resource:", error)
      setErrorMessage("Error creating resource. Please try again.")
    }
  }

  const formatTagLabel = (label: string) => {
    return label
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <FullPageContainer>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col w-full h-full pt-6">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
            {/* How to Pando Box */}
            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-colors">
              <div className="flex items-center mb-4">
                <Book size={20} className="text-green-400 mr-3" />
                <h2 className="text-xl font-semibold text-white">How to: Pando</h2>
              </div>
              <p className="text-gray-200 text-sm mb-5">Get started with Pando:</p>

              <div className="mt-4 space-y-4">
                {/* Step 0: Sign Up */}
                <Link href="/sign-up" className="block">
                  <motion.div
                    className="p-4 bg-white rounded-lg border border-indigo-500/30 hover:shadow-md transition-all"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center min-h-[40px]">
                      <div className="bg-indigo-500/20 p-2 rounded-full mr-3 flex-shrink-0">
                        <UserCircle size={18} className="text-indigo-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800 flex items-center">
                          Step 1: Create Your Account
                          <span className="ml-2 text-xs bg-indigo-500 px-2 py-0.5 rounded text-white hover:bg-indigo-600 transition-colors">
                            Sign Up
                          </span>
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {/* Step 1: Complete Profile */}
                <motion.div
                  className="p-4 bg-white rounded-lg border border-green-500/30 hover:shadow-md transition-all"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-start">
                    <div className="bg-green-500/20 p-2 rounded-full mr-3 flex-shrink-0">
                      <CheckCircle2 size={18} className="text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-800 flex items-center">
                        Step 2: Complete Your Profile
                      </h3>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        Look for the yellow banner at the top of the page! If it's not there, you have already completed
                        this step.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Optional Step: Add More Profile Info */}
                <Link href="/edit-profile" className="block">
                  <motion.div
                    className="p-4 bg-white rounded-lg border border-orange-500/30 hover:shadow-md transition-all"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-start">
                      <div className="bg-orange-500/20 p-2 rounded-full mr-3 flex-shrink-0">
                        <UserCircle size={18} className="text-orange-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800 flex items-center">
                          Optional: Add in more profile info
                          <span className="ml-2 text-xs bg-orange-500 px-2 py-0.5 rounded text-white hover:bg-orange-600 transition-colors">
                            Edit Profile
                          </span>
                        </h3>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                          Add in a profile picture, your bio and preferences!
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {/* Step 3: Make Connections */}
                <Link href="/find-friends" className="block">
                  <motion.div
                    className="p-4 bg-white rounded-lg border border-blue-500/30 hover:shadow-md transition-all"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-start">
                      <div className="bg-blue-500/20 p-2 rounded-full mr-3 flex-shrink-0">
                        <UserPlus size={18} className="text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800 flex items-center">
                          Step 3: Make Your First Connection
                          <span className="ml-2 text-xs bg-blue-500 px-2 py-0.5 rounded text-white hover:bg-blue-600 transition-colors">
                            Go Now
                          </span>
                        </h3>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                          You can either match with users by accepting their incoming request, or if you send them a
                          request and they accept!
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {/* Step 4: Chat */}
                <Link href="/messages" className="block">
                  <motion.div
                    className="p-4 bg-white rounded-lg border border-yellow-500/30 hover:shadow-md transition-all"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-start">
                      <div className="bg-yellow-500/20 p-2 rounded-full mr-3 flex-shrink-0">
                        <MessageCircle size={18} className="text-yellow-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800 flex items-center mt-1.5">
                          Step 4: Chat and Arrange Matches
                          <span className="ml-2 text-xs bg-yellow-500 px-2 py-0.5 rounded text-white hover:bg-yellow-600 transition-colors">
                            Messages
                          </span>
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                </Link>

                {/* Step 5: Feedback */}
                <a
                  href="https://forms.gle/i29f223SgHgJ2isP6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <motion.div
                    className="p-4 bg-white rounded-lg border border-pink-500/30 hover:shadow-md transition-all"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-start">
                      <div className="bg-pink-500/20 p-2 rounded-full mr-3 flex-shrink-0">
                        <ThumbsUp size={18} className="text-pink-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800 flex items-center mt-1.5">
                          Step 5: Share Your Feedback
                          <span className="ml-2 text-xs bg-pink-500 px-2 py-0.5 rounded text-white hover:bg-pink-600 transition-colors flex items-center">
                            Feedback <ExternalLink size={10} className="ml-1" />
                          </span>
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                </a>
              </div>
            </div>

            {/* Two Main Boxes */}
            <div className="flex flex-col gap-6 h-[95vh]">
              {/* This Week's Top Users Box */}
              <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Info size={18} className="text-blue-400 mr-2" />
                  <h2 className="text-lg font-semibold text-white">This Week's Top Users</h2>
                </div>
                <div className="flex flex-col items-center justify-center h-[calc(100%-60px)]">
                  <div className="text-center p-4">
                    <h3 className="text-xl font-semibold text-white mb-2">Stay tuned, coming soon!</h3>
                    <p className="text-gray-300">Our leaderboard feature is under development.</p>
                  </div>
                </div>
              </div>

              {/* Resources Box */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 h-[95vh]">
                <div className="flex items-center mb-4">
                  <div className="mb-2 flex items-center pl-1 h-full">
                    <BookOpenCheck size={18} className="text-blue-500 mr-2" />
                    <h2 className="text-lg font-semibold text-white">Tennis Resources</h2>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center h-[calc(100%-60px)]">
                  <div className="text-center p-8">
                    <h3 className="text-xl font-semibold text-white mb-2">Stay tuned, coming soon!</h3>
                    <p className="text-gray-300">We're working on bringing you the best tennis resources.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Resource Modal */}
        <Modal isOpen={isCreateResourceModalOpen} onClose={closeCreateResourceModal} title="Create Resource">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Resource Name:</label>
              <input
                type="text"
                name="title"
                value={resourceData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Resource Name"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Resource Description:</label>
              <textarea
                name="description"
                value={resourceData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Please place as much detail as possible, e.g., Setup, Scoring, Rules, any links to existing Videos or Diagrams, etc..."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Recommended Level:</label>
              <select
                name="level"
                value={resourceData.level}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Level</option>
                <option value="Unsure">Unsure</option>
                <option value="For Beginners (UTR 1 - 4)">For Beginners (UTR 1 - 4)</option>
                <option value="For Intermediate (UTR 4 - 8)">For Intermediate (UTR 4 - 8)</option>
                <option value="For Competitive (UTR 8 - 12)">For Competitive (UTR 8 - 12)</option>
                <option value="For Professional (UTR 12 - 16)">For Professional (UTR 12 - 16)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tags:</label>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(resourceData.tags).map((tag) => (
                  <div
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`
                                        px-4 py-2 rounded-full text-sm font-medium text-center cursor-pointer transition-colors duration-200
                                        ${
                                          resourceData.tags[tag]
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }
                                    `}
                  >
                    {formatTagLabel(tag)}
                  </div>
                ))}
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </div>
          </form>
        </Modal>

        {/* Login Alert Modal */}
        <SmallModal isOpen={isLoginAlertModalOpen} onClose={closeLoginAlertModal}>
          <div className="text-center p-4">
            <p className="mb-4">Only Pando members can perform this action.</p>
            <div className="flex justify-center space-x-4">
              <a
                href="/sign-up"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </a>
              <a
                href="/login"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Login
              </a>
            </div>
          </div>
        </SmallModal>
      </motion.div>
    </FullPageContainer>
  )
}

export default HomePage
