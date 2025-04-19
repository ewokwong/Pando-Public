// TS File Defining Component for Displaying Top Users
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart, Trophy, MapPin } from "lucide-react";
import { calculateAge } from "@/utils/dateUtils";
import { DEFAULT_PROFILE_PHOTO } from "@/constants/defaults";
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import VideoPlayer from "./VideoPlayer";
import { getPreferenceLabel } from "@/utils/preferenceUtils";

interface User {
  userId: string;
  email: string;
  name: string;
  profilePhoto: string;
  UTR?: string;
  dob?: string;
  bio?: string;
  location?: {
    displayName: string;
  };
  media: string[];
  userPreferences?: {
    fun_social?: boolean;
    training_for_competitions?: boolean;
    fitness?: boolean;
    learning_tennis?: boolean;
  };
}

const TopUsers: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { isLoggedIn } = useAuth(); // Ensure this is imported correctly}

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = "67fdd0c62fd2126024003ac9"; // Replace with the actual user ID
        const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
        const response = await axios.get(`${BACKEND_BASE_URL}/user/${userId}`);

        setUser(response.data.user);

        console.log("Media:", response.data.user.media);
      } catch (err: any) {
        console.error("Error fetching user:", err.message);
        setError("Failed to load user. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleConnect = () => {
    if (user) {
        if (isLoggedIn) { 
            window.location.href = "/search";
        } else {
            alert("You need to create an account first before you can send a connection request to this player!");
            window.location.href = "/sign-up"
        }
    }
  };

  if (loading) {
    return <div>Loading user...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!user) {
    return <div>No user data available.</div>;
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden w-full mx-auto shadow-md pb-5">
      <div className="p-6">

        {/* Profile Header */}
        <div className="flex items-center mb-4">
            {/* Profile Photo */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-brand-100 mr-4">
                <img
                src={user.profilePhoto || DEFAULT_PROFILE_PHOTO}
                alt={user.name}
                className="w-full h-full object-cover"
                />
            </div>

            {/* Name, Location, and UTR */}
            <div>
                <h3 className="text-xl font-bold text-gray-900">
                {user.name}
                {user.dob ? `, ${calculateAge(user.dob)}` : ""}
                </h3>
                {user.location?.displayName && (
                <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin size={16} className="mr-1" />
                    {user.location.displayName}
                </div>
                )}
                {user.UTR && (
                    <div className="flex items-center text-sm text-gray-700 mt-1">
                        <Trophy size={16} className="mr-1 text-tennis-yellow" />
                        UTR: {user.UTR}
                    </div>
                )}
            </div>
        </div>
  
        {/* Bio */}
        {user.bio && (
          <div className="bg-gray-50 rounded-lg p-3 text-left mb-3">
            <p className="text-sm text-gray-600">{user.bio}</p>
          </div>
        )}
  
        {/* User Preferences Section */}
        {user.userPreferences && (
            <div className="mb-3">
                <h3 className="text-base font-semibold text-gray-900 mb-2">Looking for</h3>
                {Object.values(user.userPreferences).some((value) => value) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(user.userPreferences).map(
                    ([key, value]) =>
                        value && (
                        <div
                            key={key}
                            className="px-3 py-2 rounded-md text-center text-xs font-medium bg-blue-100 text-blue-700"
                        >
                            {getPreferenceLabel(key)}
                        </div>
                        )
                    )}
                </div>
                ) : (
                <p className="text-gray-500 text-sm">User has not yet added their preferences :(</p>
                )}
            </div>
            )}
  
        {user.media?.length > 0 && (
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Media</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {user.media.map((mediaUrl, index) => (
                <div
                  key={index}
                  className="relative border border-gray-200 rounded-lg overflow-hidden"
                >
                  <VideoPlayer id={`video-${index}`} publicId={mediaUrl} />
                </div>
              ))}
            </div>
          </div>
        )}
  
        <div className="mt-6">
          <motion.div
            className="p-4 bg-blue-500 rounded-lg border border-blue-500 hover:shadow-md transition-all"
            whileHover={{ x: 5 }}
            onClick={handleConnect}
          >
            <div className="flex items-start">
              <div className="bg-blue-600 p-2 rounded-full mr-3 mt-1 flex-shrink-0">
                <Heart size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white flex items-center">
                  Connect with this player!
                </h3>
                <p className="text-xs text-white mt-1 leading-relaxed">
                  Send a connection request to start interacting with this player.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
export default TopUsers;