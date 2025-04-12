"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { jwtDecode } from "jwt-decode"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Camera,
  Upload,
  Trash2,
  Edit2,
  Save,
  X,
  Heart,
  Calendar,
  MapPin,
  Award,
  ImageIcon,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { calculateAge } from "@/utils/dateUtils"
import { DEFAULT_PROFILE_PHOTO } from "@/constants/defaults"
import { Dialog } from "@mui/material"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Select from "react-select"

const GEO_DB_API_KEY = process.env.NEXT_PUBLIC_GEO_DB_API_KEY
const GEO_DB_API_HOST = process.env.NEXT_PUBLIC_GEO_DB_API_HOST

const EditProfilePage = () => {
  // User data state
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")

  // Media upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const profilePhotoInputRef = useRef<HTMLInputElement>(null)

  // Edit states
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [newBio, setNewBio] = useState("")
  const [isEditingLocation, setIsEditingLocation] = useState(false)
  const [newLocation, setNewLocation] = useState("")
  const [updatedPreferences, setUpdatedPreferences] = useState<Record<string, boolean> | null>(null)
  const [newProfilePhoto, setNewProfilePhoto] = useState<File | null>(null)
  const [newProfilePhotoUrl, setNewProfilePhotoUrl] = useState<string | null>(null)
  const [isBuffering, setIsBuffering] = useState(false)

  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [mediaToDelete, setMediaToDelete] = useState<string | null>(null)
  const [hoveredDelete, setHoveredDelete] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const [cityOptions, setCityOptions] = useState<any[]>([])
  const [isLoadingCities, setIsLoadingCities] = useState(false)
  const [selectedCity, setSelectedCity] = useState<any | null>(null)

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const decodedToken = jwtDecode<{ userId: string }>(token)
        const userId = decodedToken.userId

        if (!userId) {
          console.error("No userId found in decoded token")
          setLoading(false)
          return
        }

        const response = await axios.get(`http://localhost:5001/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(response.data.user)

        // Initialize updatedPreferences with the user's current preferences
        if (response.data.user?.userPreferences) {
          setUpdatedPreferences({ ...response.data.user.userPreferences })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        setErrorMessage("Failed to load your profile. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Calculate user age
  const age = user?.dob ? calculateAge(user.dob) : null
  const utr = user?.UTR || "No UTR"

  // Handle file selection for media upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const maxImageSize = 10 * 1024 * 1024 // 10MB
      const maxVideoSize = 100 * 1024 * 1024 // 100MB

      if (file.type.startsWith("image/") && file.size > maxImageSize) {
        setErrorMessage("Image files must be under 10MB")
        setSelectedFile(null)
        return
      }

      if (file.type.startsWith("video/") && file.size > maxVideoSize) {
        setErrorMessage("Video files must be under 100MB")
        setSelectedFile(null)
        return
      }

      setSelectedFile(file)
    }
  }

  // Upload media to user profile
  const handleUpload = async () => {
    if (!selectedFile || !user) return

    setIsUploading(true)
    setErrorMessage("")

    const formData = new FormData()
    formData.append("media", selectedFile)

    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const response = await axios.post(`http://localhost:5001/api/cloudinary/${user.userId}/upload-media`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      setUser((prevUser: any) => ({
        ...prevUser,
        media: [...(prevUser.media || []), response.data.mediaUrl],
      }))

      setSelectedFile(null)
      setSuccessMessage("Media uploaded successfully!")

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message || "Error uploading media")
      } else {
        console.error("Error uploading media:", error)
        setErrorMessage("Failed to upload media. Please try again.")
      }
    } finally {
      setIsUploading(false)
    }
  }

  // Delete media confirmation modal
  const openDeleteModal = (mediaUrl: string) => {
    setMediaToDelete(mediaUrl)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setMediaToDelete(null)
  }

  // Delete media from user profile
  const confirmDelete = async () => {
    if (!mediaToDelete || !user) return

    const token = localStorage.getItem("token")
    if (!token) return

    try {
      await axios.delete(`http://localhost:5001/api/cloudinary/${user.userId}/delete-media`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { mediaUrl: mediaToDelete },
      })

      setUser((prevUser: any) => ({
        ...prevUser,
        media: prevUser.media.filter((url: string) => url !== mediaToDelete),
      }))

      setSuccessMessage("Media deleted successfully")
    } catch (error) {
      console.error("Error deleting media:", error)
      setErrorMessage("Failed to delete media. Please try again.")
    } finally {
      closeDeleteModal()
    }
  }

  // Handle profile photo change
  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewProfilePhoto(file)
      // Create a temporary URL for the new profile photo
      const tempUrl = URL.createObjectURL(file)
      setNewProfilePhotoUrl(tempUrl)
    }
  }

  // Upload new profile photo
  const handleProfilePhotoUpload = async () => {
    if (!newProfilePhoto || !user) return

    const formData = new FormData()
    formData.append("profilePhoto", newProfilePhoto)

    const token = localStorage.getItem("token")
    if (!token) return

    try {
      setIsBuffering(true)
      setErrorMessage("")

      const response = await axios.post(
        `http://localhost:5001/api/cloudinary/${user.userId}/upload-profile-photo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      )

      setUser((prevUser: any) => ({
        ...prevUser,
        profilePhoto: response.data.profilePhotoUrl,
      }))

      setSuccessMessage("Profile photo updated successfully!")
      setNewProfilePhoto(null)
      setNewProfilePhotoUrl(null)

      // Reset file input
      if (profilePhotoInputRef.current) {
        profilePhotoInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error uploading profile photo:", error)
      setErrorMessage("Failed to update profile photo. Please try again.")
    } finally {
      setIsBuffering(false)
    }
  }

  // Bio editing functions
  const handleBioClick = () => {
    setNewBio(user?.bio || "")
    setIsEditingBio(true)
  }

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewBio(e.target.value)
  }

  const handleBioSave = async () => {
    if (!user) return

    const token = localStorage.getItem("token")
    if (!token) return

    try {
      setErrorMessage("")
      const response = await axios.put(
        `http://localhost:5001/api/user/${user.userId}/update-bio`,
        { bio: newBio },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setUser((prevUser: any) => ({
        ...prevUser,
        bio: response.data.bio,
      }))

      setIsEditingBio(false)
      setSuccessMessage("Bio updated successfully!")
    } catch (error) {
      console.error("Error updating bio:", error)
      setErrorMessage("Failed to update bio. Please try again.")
    }
  }

  // Location editing functions
  const handleLocationClick = () => {
    setNewLocation(user?.location || "")
    setIsEditingLocation(true)
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLocation(e.target.value)
  }

  // Load city options for React Select
  const loadCityOptions = async (inputValue: string) => {
    if (inputValue.length < 3) return []

    setIsLoadingCities(true)

    try {
      const options = {
        method: "GET",
        url: `https://${GEO_DB_API_HOST}/v1/geo/cities`,
        params: {
          namePrefix: inputValue,
          limit: "10",
          sort: "-population",
        },
        headers: {
          "X-RapidAPI-Key": GEO_DB_API_KEY,
          "X-RapidAPI-Host": GEO_DB_API_HOST,
        },
      }

      const response = await axios.request(options)

      if (response.data && response.data.data) {
        const cities = response.data.data.map((city: any) => ({
          value: `${city.name}, ${city.country}`,
          label: `${city.name}${city.region ? `, ${city.region}` : ""}, ${city.country}`,
        }))

        setCityOptions(cities)
        return cities
      }
      return []
    } catch (error) {
      console.error("Error searching for cities:", error)
      return []
    } finally {
      setIsLoadingCities(false)
    }
  }

  // Handle city selection
  const handleCitySelect = (option: any | null) => {
    if (option) {
      setSelectedCity(option)
      setNewLocation(option.value)
    } else {
      setSelectedCity(null)
      setNewLocation("")
    }
  }

  const handleLocationSave = async () => {
    if (!user || !selectedCity) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setErrorMessage("");
      const response = await axios.put(
        `http://localhost:5001/api/user/${user.userId}/update-location`,
        {
          displayName: selectedCity.value, // Human-readable name
          latitude: selectedCity.city.latitude, // Latitude coordinate
          longitude: selectedCity.city.longitude, // Longitude coordinate
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUser((prevUser: any) => ({
        ...prevUser,
        location: selectedCity.value,
      }));

      setIsEditingLocation(false);
      setSuccessMessage("Location updated successfully!");
    } catch (error) {
      console.error("Error updating location:", error);
      setErrorMessage("Failed to update location. Please try again.");
    }
  }

  // Preferences functions
  const handlePreferenceToggle = (key: string) => {
    // Always create a new object to ensure state update
    setUpdatedPreferences((prev) => {
      const newPreferences = { ...(prev || user?.userPreferences || {}) }
      newPreferences[key] = !newPreferences[key]
      return newPreferences
    })
  }

  // Fix the handlePreferencesSave function
  const handlePreferencesSave = async () => {
    if (!user || !updatedPreferences) return

    const token = localStorage.getItem("token")
    if (!token) return

    try {
      setErrorMessage("")
      const response = await axios.put(
        `http://localhost:5001/api/user/${user.userId}/submit-preferences`,
        { userPreferences: updatedPreferences },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Update the user state with the new preferences
      setUser((prevUser: any) => ({
        ...prevUser,
        userPreferences: { ...response.data.preferences },
      }))

      // Make sure to create a new object for updatedPreferences
      setUpdatedPreferences({ ...response.data.preferences })

      setSuccessMessage("Your preferences have been updated successfully!")
    } catch (error) {
      console.error("Error updating preferences:", error)
      setErrorMessage("Failed to update preferences. Please try again.")
    }
  }

  // Format preference label
  const formatPreferenceLabel = (label: string): string => {
    return label
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Get preference color
  const getPreferenceColor = (key: string, isSelected: boolean): string => {
    if (!isSelected) return "bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"

    switch (key) {
      case "fun_social":
        return "bg-blue-500 text-white shadow-md hover:bg-blue-600 transition-colors"
      case "training_for_competitions":
        return "bg-blue-500 text-white shadow-md hover:bg-blue-600 transition-colors"
      case "fitness":
        return "bg-blue-500 text-white shadow-md hover:bg-blue-600 transition-colors"
      case "learning_tennis":
        return "bg-blue-500 text-white shadow-md hover:bg-blue-600 transition-colors"
      default:
        return "bg-green-500 text-white shadow-md hover:bg-green-600 transition-colors"
    }
  }

  // Clear success/error messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage])

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (newProfilePhotoUrl) {
        URL.revokeObjectURL(newProfilePhotoUrl)
      }
    }
  }, [newProfilePhotoUrl])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="flex flex-col items-center">
          <Loader2 size={40} className="text-blue-500 animate-spin mb-4" />
          <p className="text-white text-lg">Loading your profile...</p>
        </div>
      </div>
    )
  }

  // Determine which profile photo URL to display
  const displayProfilePhotoUrl = newProfilePhotoUrl || user?.profilePhoto || DEFAULT_PROFILE_PHOTO

  return (
    <TooltipProvider>
      <div className="min-h-screen py-10 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Success and Error Messages */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                className="mb-6 p-4 bg-green-500 text-white rounded-lg shadow-lg flex items-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CheckCircle className="mr-2" size={20} />
                <p>{successMessage}</p>
                <button onClick={() => setSuccessMessage("")} className="ml-auto text-white hover:text-green-100">
                  <X size={18} />
                </button>
              </motion.div>
            )}

            {errorMessage && (
              <motion.div
                className="mb-6 p-4 bg-red-500 text-white rounded-lg shadow-lg flex items-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <X className="mr-2" size={20} />
                <p>{errorMessage}</p>
                <button onClick={() => setErrorMessage("")} className="ml-auto text-white hover:text-red-100">
                  <X size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Page Header */}
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">Edit Your Profile</h1>
            <p className="text-gray-300">Customize your profile to connect with the perfect tennis partners</p>
          </motion.div>

          {/* Profile Content */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {/* Profile Header */}
            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-indigo-600">
              {/* Update the profile photo section in the return statement */}
              <div className="absolute -bottom-12 left-8 flex">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white">
                    <img
                      src={displayProfilePhotoUrl || "/placeholder.svg"}
                      alt={user?.name || "Profile"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => profilePhotoInputRef.current?.click()}
                  >
                    <Camera size={20} className="text-white" />
                  </div>
                  <input
                    type="file"
                    ref={profilePhotoInputRef}
                    onChange={handleProfilePhotoChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                {newProfilePhoto && (
                  <div className="ml-4 mt-auto mb-4">
                    <div className="flex items-center mb-2">
                      <Button
                        onClick={handleProfilePhotoUpload}
                        disabled={isBuffering}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        {isBuffering ? (
                          <Loader2 size={16} className="mr-2 animate-spin" />
                        ) : (
                          <Save size={16} className="mr-2" />
                        )}
                        Save Photo
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setNewProfilePhoto(null)
                          setNewProfilePhotoUrl(null)
                          if (profilePhotoInputRef.current) {
                            profilePhotoInputRef.current.value = ""
                          }
                        }}
                        className="ml-2 bg-white"
                      >
                        <X size={16} className="mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Name */}
              <div className="absolute bottom-1 left-40 text-left">
                <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                <div className="flex items-center justify-start text-blue-100">
                  {age && (
                    <span className="flex items-center mr-4">
                      <Calendar size={14} className="mr-1" />
                      {age} years
                    </span>
                  )}
                  {user?.location && (
                    <span className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {user.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="pt-20 px-8">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-8">
                  <TabsTrigger value="profile" className="text-sm sm:text-base">
                    <User size={16} className="mr-2 hidden sm:inline" />
                    Profile Info
                  </TabsTrigger>
                  <TabsTrigger value="preferences" className="text-sm sm:text-base">
                    <Heart size={16} className="mr-2 hidden sm:inline" />
                    Preferences
                  </TabsTrigger>
                  <TabsTrigger value="media" className="text-sm sm:text-base">
                    <ImageIcon size={16} className="mr-2 hidden sm:inline" />
                    Media
                  </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="focus:outline-none">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                  >
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Bio</h3>
                        {!isEditingBio && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleBioClick}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit2 size={16} className="mr-2" />
                            Edit
                          </Button>
                        )}
                      </div>

                      {isEditingBio ? (
                        <div className="space-y-3">
                          <textarea
                            value={newBio}
                            onChange={handleBioChange}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleBioSave()
                              }
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none min-h-[120px]"
                            placeholder="Tell others about yourself, your tennis experience, and what you're looking for in a tennis partner... (Press Enter to save)"
                          />
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsEditingBio(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleBioSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                              <Save size={16} className="mr-2" />
                              Save Bio
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          {user?.bio ? (
                            <p className="text-gray-700">{user.bio}</p>
                          ) : (
                            <p className="text-gray-400 italic">No bio added yet. Click edit to add your bio.</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Tennis Level</h3>
                      <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                        <Award size={20} className="text-blue-600 mr-2" />
                        <span className="text-gray-700">UTR: {utr}</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                        {!isEditingLocation && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLocationClick}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit2 size={16} className="mr-2" />
                            Edit
                          </Button>
                        )}
                      </div>

                      {isEditingLocation ? (
                        <div className="space-y-3">
                          <div className="relative">
                            <MapPin
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={18}
                            />
                            <Select
                              styles={{
                                control: (provided) => ({
                                  ...provided,
                                  padding: "0.5rem",
                                  paddingLeft: "2.5rem",
                                  borderColor: "#e5e7eb",
                                  boxShadow: "none",
                                  "&:hover": {
                                    borderColor: "#d1d5db",
                                  },
                                }),
                                menuPortal: (provided) => ({
                                  ...provided,
                                  zIndex: 9999,
                                }),
                              }}
                              className="w-full"
                              classNamePrefix="react-select"
                              placeholder="Search for your city..."
                              isClearable
                              isSearchable
                              isLoading={isLoadingCities}
                              options={cityOptions}
                              value={selectedCity}
                              onChange={(option) => handleCitySelect(option)}
                              onInputChange={(newValue) => {
                                if (newValue.length >= 3) {
                                  loadCityOptions(newValue)
                                }
                              }}
                              filterOption={() => true} // Disable client-side filtering
                              noOptionsMessage={({ inputValue }) =>
                                inputValue.length < 3
                                  ? "Type at least 3 characters to search"
                                  : isLoadingCities
                                  ? "Loading..."
                                  : "No cities found"
                              }
                              menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                              menuPlacement="auto"
                              maxMenuHeight={200}
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsEditingLocation(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleLocationSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                              <Save size={16} className="mr-2" />
                              Save Location
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                          <MapPin size={20} className="text-blue-600 mr-2" />
                          <span className="text-gray-700">{user?.location || "No location set"}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent value="preferences" className="focus:outline-none">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                  >
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Tennis Preferences</h3>
                        {updatedPreferences && (
                          <Button
                            onClick={handlePreferencesSave}
                            className="bg-green-500 text-white shadow-md hover:bg-green-600 transition-colors"
                          >
                            <Save size={16} className="mr-2" />
                            Save Changes
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user?.userPreferences &&
                          Object.entries(user.userPreferences).map(([key, value]) => {
                            // Use updatedPreferences if available, otherwise fall back to user preferences
                            const isSelected = updatedPreferences ? Boolean(updatedPreferences[key]) : Boolean(value)

                            return (
                              <div
                                key={key}
                                className={`px-4 py-3 rounded-lg cursor-pointer flex items-center ${getPreferenceColor(key, isSelected)}`}
                                onClick={() => handlePreferenceToggle(key)}
                              >
                                <Heart size={18} className={`mr-2 ${isSelected ? "fill-current" : ""}`} />
                                <span className="font-medium">{formatPreferenceLabel(key)}</span>
                              </div>
                            )
                          })}
                      </div>

                      <p className="text-sm text-gray-500 mt-4">
                        Select your tennis preferences to help us match you with compatible players
                      </p>
                    </div>
                  </motion.div>
                </TabsContent>

                {/* Media Tab */}
                <TabsContent value="media" className="focus:outline-none">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                  >
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Your Media</h3>
                        <div className="flex items-center">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*,video/*"
                            className="hidden"
                          />
                          <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="mr-2">
                            <Upload size={16} className="mr-2" />
                            Select File
                          </Button>
                          {selectedFile && (
                            <Button
                              onClick={handleUpload}
                              disabled={isUploading}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              {isUploading ? (
                                <Loader2 size={16} className="mr-2 animate-spin" />
                              ) : (
                                <Upload size={16} className="mr-2" />
                              )}
                              Upload
                            </Button>
                          )}
                        </div>
                      </div>

                      {selectedFile && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center mb-2">
                            <ImageIcon size={20} className="text-blue-500 mr-2" />
                            <span className="text-blue-700 text-sm">{selectedFile.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedFile(null)
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = ""
                                }
                              }}
                              className="ml-auto text-red-500 hover:text-red-700"
                            >
                              <X size={16} />
                            </Button>
                          </div>
                          <div className="mt-2 border rounded-lg overflow-hidden max-h-48 flex justify-center bg-gray-100">
                            {selectedFile.type.startsWith("image/") ? (
                              <img
                                src={URL.createObjectURL(selectedFile) || "/placeholder.svg"}
                                alt="Preview"
                                className="max-h-48 object-contain"
                              />
                            ) : selectedFile.type.startsWith("video/") ? (
                              <video src={URL.createObjectURL(selectedFile)} controls className="max-h-48 w-full" />
                            ) : (
                              <div className="p-4 text-gray-500">No preview available</div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {user?.media && user.media.length > 0 ? (
                          user.media.map((mediaUrl: string, index: number) => (
                            <div
                              key={index}
                              className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square"
                              onMouseEnter={() => setHoveredDelete(mediaUrl)}
                              onMouseLeave={() => setHoveredDelete(null)}
                            >
                              {mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".webm") ? (
                                <video src={mediaUrl} controls className="w-full h-full object-cover" />
                              ) : (
                                <img
                                  src={mediaUrl || "/placeholder.svg"}
                                  alt={`Media ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              )}

                              <AnimatePresence>
                                {hoveredDelete === mediaUrl && (
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                                  >
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => openDeleteModal(mediaUrl)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          <Trash2 size={16} className="mr-2" />
                                          Delete
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Delete this media</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full p-8 text-center bg-gray-50 rounded-lg">
                            <ImageIcon size={40} className="mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-500">No media uploaded yet</p>
                            <p className="text-sm text-gray-400 mt-2">
                              Upload photos or videos to showcase your tennis skills
                            </p>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-gray-500 mt-4">
                        You can upload up to 4 photos or videos. Images must be under 10MB and videos under 100MB.
                      </p>
                    </div>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <Button variant="outline" onClick={() => window.history.back()}>
                Back to Profile
              </Button>

              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  setSuccessMessage("All changes have been saved!")
                  setTimeout(() => {
                    window.location.href = "/"
                  }, 1500)
                }}
              >
                Done Editing
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Media Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onClose={closeDeleteModal} aria-labelledby="delete-media-dialog-title">
        <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
          <h3 id="delete-media-dialog-title" className="text-lg font-semibold text-gray-900 mb-4">
            Delete Media
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this media? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={closeDeleteModal}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              <Trash2 size={16} className="mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </TooltipProvider>
  )
}

export default EditProfilePage
