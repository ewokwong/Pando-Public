"use client"

import type React from "react"
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react"
import { jwtDecode } from "jwt-decode"
import axios from "axios"
import { useAuth } from "@/context/AuthContext"
import Modal from "@/components/common/Modal"
import SmallModal from "@/components/common/SmallModal"
import { ThumbsUp, ThumbsDown, Edit, Trash, AlertCircle } from "lucide-react"

// Define the type for a single resource
interface Resource {
  _id: string
  title: string
  description: string
  level: string
  tags: Record<string, boolean>
  created_by: string
  upvoted_by: string[]
  downvoted_by: string[]
  [key: string]: any
}

// Define the props for the ResourceBox component
interface ResourceBoxProps {
  resource: Resource
}

const ResourceBox: React.FC<ResourceBoxProps> = ({ resource }) => {
  const { isLoggedIn } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCreatedByUser, setIsCreatedByUser] = useState(false)
  const [upvoteCount, setUpvoteCount] = useState(0)
  const [downvoteCount, setDownvoteCount] = useState(0)
  const [userVote, setUserVote] = useState<"upvote" | "downvote" | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [editedResource, setEditedResource] = useState<Resource>(resource)
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoginAlertModalOpen, setLoginAlertModalOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      const decodedToken = jwtDecode<{ userId: string }>(token)
      setUserId(decodedToken.userId)
      setIsCreatedByUser(decodedToken.userId === resource.created_by)
      if (resource.upvoted_by.includes(decodedToken.userId)) {
        setUserVote("upvote")
      } else if (resource.downvoted_by.includes(decodedToken.userId)) {
        setUserVote("downvote")
      }
    }
    setUpvoteCount(resource.upvoted_by.length)
    setDownvoteCount(resource.downvoted_by.length)
  }, [resource])

  const getLevelColor = (level: string): string => {
    switch (level) {
      case "Unsure":
        return "bg-gray-600 text-white"
      case "For Beginners (UTR 1 - 4)":
        return "bg-blue-600 text-white"
      case "For Intermediate (UTR 4 - 8)":
        return "bg-green-600 text-white"
      case "For Competitive (UTR 8 - 12)":
        return "bg-orange-600 text-white"
      case "For Professional (UTR 12 - 16)":
        return "bg-red-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  const formatTagLabel = (tag: string): string => {
    switch (tag) {
      case "fun_social":
        return "Fun & Social"
      case "training_for_competitions":
        return "Training for Competitions"
      case "fitness":
        return "Fitness"
      case "learning_tennis":
        return "Learning Tennis"
      default:
        return tag.replace("_", " ")
    }
  }

  const truncateDescription = (description: string): string => {
    const maxLength = 100
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "..."
    }
    return description
  }

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setEditedResource(resource)
    setIsEditModalOpen(true)
  }

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/resource/${resource._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setIsDeleteModalOpen(false)
      setIsModalOpen(false)
      window.alert("Resource deleted successfully")
      window.location.reload()
    } catch (error) {
      console.error("Error deleting resource:", error)
    }
  }

  const handleUpvote = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (!isLoggedIn) {
      setLoginAlertModalOpen(true)
      return
    }
    try {
      const token = localStorage.getItem("token")
      if (userVote === "upvote") {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/resource/${resource._id}/${userId}/remove-vote`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
        setUpvoteCount(upvoteCount - 1)
        setUserVote(null)
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/resource/${resource._id}/${userId}/upvote`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
        setUpvoteCount(upvoteCount + 1)
        if (userVote === "downvote") {
          setDownvoteCount(downvoteCount - 1)
        }
        setUserVote("upvote")
      }
    } catch (error) {
      console.error("Error upvoting resource:", error)
    }
  }

  const handleDownvote = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (!isLoggedIn) {
      setLoginAlertModalOpen(true)
      return
    }
    try {
      const token = localStorage.getItem("token")
      if (userVote === "downvote") {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/resource/${resource._id}/${userId}/remove-vote`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
        setDownvoteCount(downvoteCount - 1)
        setUserVote(null)
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/resource/${resource._id}/${userId}/downvote`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
        setDownvoteCount(downvoteCount + 1)
        if (userVote === "upvote") {
          setUpvoteCount(upvoteCount - 1)
        }
        setUserVote("downvote")
      }
    } catch (error) {
      console.error("Error downvoting resource:", error)
    }
  }

  const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedResource({ ...editedResource, [name]: value })
  }

  const handleTagChange = (tag: string) => {
    setEditedResource((prevResource) => ({
      ...prevResource,
      tags: {
        ...prevResource.tags,
        [tag]: !prevResource.tags[tag],
      },
    }))
  }

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Check if all fields are filled out
    if (!editedResource.title || !editedResource.description || !editedResource.level) {
      setErrorMessage("All fields must be filled out.")
      return
    }

    // Check if at least one tag is selected
    const isTagSelected = Object.values(editedResource.tags).some((tag) => tag)
    if (!isTagSelected) {
      setErrorMessage("At least one tag must be selected.")
      return
    }

    try {
      const token = localStorage.getItem("token")
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/resource/${resource._id}`, editedResource, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setIsEditModalOpen(false)
      window.location.reload()
    } catch (error) {
      console.error("Error updating resource:", error)
    }
  }

  const handleEditCancel = () => {
    setEditedResource(resource)
    setIsEditModalOpen(false)
  }

  const closeLoginAlertModal = () => {
    setLoginAlertModalOpen(false)
  }

  return (
    <>
      {/* Main Resource Box */}
      <div
        className="relative p-4 rounded-lg shadow-md cursor-pointer transition-transform hover:shadow-lg bg-white/20 backdrop-blur-sm"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Title and Banner */}
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-base font-semibold text-white">{resource.title}</h3>
          {isCreatedByUser && <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs">Added by you</span>}
        </div>

        {/* Edit and Delete Buttons */}
        {isCreatedByUser ? (
          <>
            <button
              className="absolute top-2 right-2 flex items-center gap-1 bg-white/30 hover:bg-white/40 px-2 py-1 rounded shadow-sm transition-colors"
              onClick={handleEdit}
            >
              <Edit size={14} className="text-white" /> <span className="text-xs text-white">Edit</span>
            </button>
            <button
              className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/30 hover:bg-white/40 px-2 py-1 rounded shadow-sm transition-colors"
              onClick={handleDelete}
            >
              <Trash size={14} className="text-white" /> <span className="text-xs text-white">Delete</span>
            </button>
          </>
        ) : (
          <div
            className="absolute top-1/2 right-2 -translate-y-1/2 flex flex-col gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={`flex items-center gap-1 px-2 py-1 rounded shadow-sm transition-colors ${
                userVote === "upvote" ? "bg-green-600" : "bg-white/30 hover:bg-white/40"
              }`}
              onClick={handleUpvote}
            >
              <ThumbsUp size={14} className="text-white" />
              <span className="text-xs text-white">{upvoteCount}</span>
            </button>
            <button
              className={`flex items-center gap-1 px-2 py-1 rounded shadow-sm transition-colors ${
                userVote === "downvote" ? "bg-red-600" : "bg-white/30 hover:bg-white/40"
              }`}
              onClick={handleDownvote}
            >
              <ThumbsDown size={14} className="text-white" />
              <span className="text-xs text-white">{downvoteCount}</span>
            </button>
          </div>
        )}

        {/* Description and Level */}
        <p className="text-gray-200 text-sm mb-2">{truncateDescription(resource.description)}</p>
        <div className="mb-2">
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(resource.level)}`}
          >
            {resource.level}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {Object.keys(resource.tags).map(
            (tag) =>
              resource.tags[tag] && (
                <span key={tag} className="px-2 py-0.5 bg-green-600/70 text-white rounded-md text-xs">
                  {formatTagLabel(tag)}
                </span>
              ),
          )}
        </div>
      </div>

      {/* Resource Detail Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={resource.title}>
        <div className="p-4">
          <p className="text-gray-700 whitespace-pre-line mb-4">{resource.description}</p>
          <div className="mb-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(resource.level)}`}
            >
              {resource.level}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.keys(resource.tags).map(
              (tag) =>
                resource.tags[tag] && (
                  <span key={tag} className="px-3 py-1 bg-green-500 text-white rounded-md text-sm">
                    {formatTagLabel(tag)}
                  </span>
                ),
            )}
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            <AlertCircle size={20} />
            <p>Are you sure you want to delete this resource?</p>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              onClick={confirmDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Resource Modal */}
      <Modal isOpen={isEditModalOpen} onClose={handleEditCancel} title="Edit Resource">
        <form onSubmit={handleEditSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
            <input
              type="text"
              name="title"
              value={editedResource.title}
              onChange={handleEditChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
            <textarea
              name="description"
              value={editedResource.description}
              onChange={handleEditChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Level:</label>
            <select
              name="level"
              value={editedResource.level}
              onChange={handleEditChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Unsure">Unsure</option>
              <option value="For Beginners (UTR 1 - 4)">For Beginners (UTR 1 - 4)</option>
              <option value="For Intermediate (UTR 4 - 8)">For Intermediate (UTR 4 - 8)</option>
              <option value="For Competitive (UTR 8 - 12)">For Competitive (UTR 8 - 12)</option>
              <option value="For Professional (UTR 12 - 16)">For Professional (UTR 12 - 16)</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags:</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(resource.tags).map((tag) => (
                <div
                  key={tag}
                  onClick={() => handleTagChange(tag)}
                  className={`px-3 py-2 rounded-md text-center cursor-pointer transition-colors ${
                    editedResource.tags[tag] ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {formatTagLabel(tag)}
                </div>
              ))}
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleEditCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Save Changes
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
    </>
  )
}

export default ResourceBox

