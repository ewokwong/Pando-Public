"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { X, Check, AlertCircle, Award, ExternalLink, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog } from "@mui/material"

interface ProfileCompletionModalProps {
  open: boolean
  onClose: () => void
  userId?: string
}

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({ open, onClose, userId: propUserId }) => {
  // State
  const [activeTab, setActiveTab] = useState("utr")
  const [userId, setUserId] = useState<string | null>(propUserId || null)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [utrAcknowledged, setUtrAcknowledged] = useState(false)
  const [location, setLocation] = useState("")

  // Completion status
  const [utrCompleted, setUtrCompleted] = useState(false)
  const [locationCompleted, setLocationCompleted] = useState(false)

  // Get user ID from token if not provided as prop
  useEffect(() => {
    if (!userId) {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const decoded: any = jwtDecode(token)
          setUserId(decoded.userId)
        } catch (err) {
          console.error("Error decoding token:", err)
          setError("Authentication error. Please log in again.")
        }
      }
    }
  }, [userId])

  // Load user data when modal opens
  useEffect(() => {
    if (open && userId) {
      loadUserData()
    }
  }, [open, userId])

  // Load user data from API
  const loadUserData = async () => {
    if (!userId) return

    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`http://localhost:5001/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const userData = response.data.user
      setUserInfo(userData)

      if (userData.verified) {
        setUtrAcknowledged(true)
        setUtrCompleted(true)
      }

      if (userData.location) {
        setLocation(userData.location)
        setLocationCompleted(true)
      }

      // Set active tab based on what's not completed yet
      if (!utrCompleted) {
        setActiveTab("utr")
      } else if (!locationCompleted) {
        setActiveTab("location")
      } else {
        setActiveTab("summary")
      }
    } catch (err) {
      console.error("Error loading user data:", err)
      setError("Failed to load your profile data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Save UTR acknowledgment
  const saveUtrAcknowledgment = async () => {
    if (!userId) return

    setSaving(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `http://localhost:5001/api/user/${userId}/verify-user`,
        { utrAcknowledged: true },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      setUtrCompleted(true)
      setSuccess("UTR level acknowledged successfully!")

      // Check if all sections are complete after this one is saved
      if (locationCompleted) {
        setActiveTab("summary")
      } else {
        setActiveTab("location")
      }
    } catch (err) {
      console.error("Error saving UTR acknowledgment:", err)
      setError("Failed to save UTR acknowledgment. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const saveLocation = async () => {
    if (!location.trim() || !userId) return

    setSaving(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `http://localhost:5001/api/user/${userId}/update-location`,
        { city: location },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      setLocationCompleted(true)
      setSuccess("Location saved successfully!")

      // Check if all sections are complete after this one is saved
      if (utrCompleted) {
        setActiveTab("summary")
      } else {
        setActiveTab("utr")
      }
    } catch (err) {
      console.error("Error saving location:", err)
      setError("Failed to save location. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  // Check if profile is complete
  const isProfileComplete = utrCompleted && locationCompleted

  // Handle final completion
  const handleCompletion = async () => {
    if (!userId) return

    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `http://localhost:5001/api/user/${userId}/mark-profile-complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )

      setSuccess("Your profile is now complete!")
      setTimeout(() => {
        onClose()
        window.location.href = "/find-friends" // Navigate to /find-friends page
      }, 1500)
    } catch (err) {
      console.error("Error marking profile as complete:", err)
      setError("Failed to complete profile. Please try again.")
    }
  }

  // Add this useEffect to check completion status whenever any of the completion flags change
  useEffect(() => {
    // Check if all required sections are complete
    if (utrCompleted && locationCompleted) {
      // If everything is complete, show the summary tab
      setActiveTab("summary")
    }
  }, [utrCompleted, locationCompleted])

  if (!open) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        },
      }}
    >
      <div className="relative bg-white rounded-xl shadow-xl w-full max-h-[95vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Complete Your Profile</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Success message - Moved to top */}
        {success && (
          <div className="mx-6 mt-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-start">
            <Check size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{success}</p>
          </div>
        )}

        {/* Error message - Moved to top */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start">
            <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading your profile...</p>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="utr" className={`relative ${utrCompleted ? "text-green-600 font-medium" : ""}`}>
                  {utrCompleted ? (
                    <span className="flex items-center">
                      <Check size={14} className="mr-1 text-green-600" />
                      UTR
                    </span>
                  ) : (
                    "UTR"
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="location"
                  className={`relative ${locationCompleted ? "text-green-600 font-medium" : ""}`}
                >
                  {locationCompleted ? (
                    <span className="flex items-center">
                      <Check size={14} className="mr-1 text-green-600" />
                      Location
                    </span>
                  ) : (
                    "Location"
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="summary"
                  className={`relative ${isProfileComplete ? "text-green-600 font-medium" : ""}`}
                >
                  Summary
                </TabsTrigger>
              </TabsList>

              {/* UTR Level Tab */}
              <TabsContent value="utr" className="mt-0">
                <div className="flex flex-col">
                  <div className="mb-6 bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Your UTR Level</h3>
                    <p className="text-gray-600 mb-4 text-center">
                      Please fill out the form to submit your UTR level. This helps us match you with players of similar
                      skill.
                    </p>
                    <div className="flex justify-center mb-4">
                      <a
                        href="https://forms.gle/qYkeESNqfkK61w847"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-brand-500 hover:text-brand-600 font-medium"
                      >
                        Fill out the UTR form
                        <ExternalLink size={14} className="ml-1" />
                      </a>
                    </div>
                    <div className="flex items-center mt-4 bg-yellow-50 p-3 rounded-lg">
                      <input
                        type="checkbox"
                        id="utrAcknowledge"
                        checked={utrAcknowledged}
                        onChange={() => setUtrAcknowledged(!utrAcknowledged)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            if (utrAcknowledged) {
                              saveUtrAcknowledgment()
                            }
                          }
                        }}
                        className="h-4 w-4 text-brand-500 focus:ring-brand-500 border-gray-300 rounded"
                      />
                      <label htmlFor="utrAcknowledge" className="ml-2 block text-sm text-gray-700">
                        I acknowledge that I have submitted the form
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-between w-full">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActiveTab("location")
                      }}
                      className="px-6"
                    >
                      Skip for now
                    </Button>

                    <Button
                      onClick={saveUtrAcknowledgment}
                      disabled={!utrAcknowledged || saving}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 font-medium"
                    >
                      {saving ? "Saving..." : "Confirm"}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Location Tab */}
              <TabsContent value="location" className="mt-0">
                <div className="flex flex-col">
                  <div className="mb-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Where Are You Located?</h3>
                    <p className="text-gray-600">Your location helps us connect you with nearby players</p>
                  </div>

                  <div className="mb-6">
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            if (location.trim()) {
                              saveLocation()
                            }
                          }
                        }}
                        placeholder="Enter your city"
                        className="w-full p-4 pl-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 justify-between w-full">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActiveTab("utr")
                      }}
                      className="px-6"
                    >
                      Skip for now
                    </Button>

                    <Button
                      onClick={saveLocation}
                      disabled={!location.trim() || saving}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 font-medium"
                    >
                      {saving ? "Saving..." : "Save Location"}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Summary Tab */}
              <TabsContent value="summary" className="mt-0">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    {isProfileComplete ? (
                      <Check size={40} className="text-green-600" />
                    ) : (
                      <AlertCircle size={40} className="text-yellow-600" />
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {isProfileComplete ? "Profile Complete!" : "Almost There!"}
                  </h3>
                  <p className="text-gray-600 mb-8">
                    {isProfileComplete
                      ? "You're all set to connect with tennis players in your area."
                      : "Complete all sections to fully activate your profile."}
                  </p>

                  <div className="grid grid-cols-2 gap-4 w-full mb-8">
                    <div
                      className={`p-4 rounded-lg ${utrCompleted ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}`}
                    >
                      <div className="flex items-center">
                        <Award size={16} className="mr-2" />
                        <span className="font-medium">UTR Level</span>
                      </div>
                      {utrCompleted ? (
                        <span className="text-xs flex items-center mt-1">
                          <Check size={12} className="mr-1" /> Acknowledged
                        </span>
                      ) : (
                        <span className="text-xs flex items-center mt-1">
                          <X size={12} className="mr-1" /> Not Acknowledged
                        </span>
                      )}
                    </div>

                    <div
                      className={`p-4 rounded-lg ${locationCompleted ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}`}
                    >
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-2" />
                        <span className="font-medium">Location</span>
                      </div>
                      {locationCompleted ? (
                        <span className="text-xs flex items-center mt-1">
                          <Check size={12} className="mr-1" /> Completed
                        </span>
                      ) : (
                        <span className="text-xs flex items-center mt-1">
                          <X size={12} className="mr-1" /> Missing
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <Button
                      onClick={handleCompletion}
                      className={`px-8 py-6 text-lg font-medium ${
                        isProfileComplete
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                      disabled={!isProfileComplete}
                    >
                      {isProfileComplete ? "Start Finding Tennis Partners" : "Complete Your Profile"}
                    </Button>

                    {!isProfileComplete && (
                      <p className="text-sm text-gray-500 mt-2">Please complete all sections to continue</p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </Dialog>
  )
}

export default ProfileCompletionModal
