// TS File Defining Component for Displaying Top Users
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart, Trophy, MapPin } from "lucide-react";
import { calculateAge } from "@/utils/dateUtils";
import { DEFAULT_PROFILE_PHOTO } from "@/constants/defaults";
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { AdvancedVideo } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { focusOn, Gravity } from "@cloudinary/url-gen/qualifiers/gravity";

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

  // For videos
  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, // Replace with your Cloudinary cloud name
    },
  });

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
            alert("You need to create an account first to send a connection request to this player!");
            window.location.href = "/sign-up"
        }

      // Replace this with actual functionality, such as an API call
    //   console.log(`Connect request sent to ${user.name} (ID: ${user.userId})`);
    //   alert(`Connect request sent to ${user.name}`);
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
        <div className="flex flex-col items-center mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-brand-100 mb-3">
            <img
              src={user.profilePhoto || DEFAULT_PROFILE_PHOTO}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {user.name}
            {user.dob ? `, ${calculateAge(user.dob)}` : ""}
          </h3>
          {user.location?.displayName && (
            <div className="flex items-center text-sm text-gray-500">
              <MapPin size={16} className="mr-1" />
              {user.location.displayName}
            </div>
          )}
        </div>

        {user.bio && (
          <div className="bg-gray-50 rounded-lg p-3 text-center mb-4">
            <p className="text-sm text-gray-600">{user.bio}</p>
          </div>
        )}

        {user.UTR && (
          <div className="flex items-center justify-center mb-4">
            <div className="inline-flex items-center px-3 py-1.5 bg-tennis-yellow/20 text-gray-700 rounded-md text-sm">
              <Trophy size={16} className="mr-2" />
              UTR: {user.UTR}
            </div>
          </div>
        )}



        {user.media?.length > 0 && (
        <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Media</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {user.media.map((mediaUrl, index) => {
                // Extract public ID from the media URL
                const publicId = mediaUrl.split("/").pop()?.split(".")[0];

                // Generate video thumbnail
                const videoThumbnail = cld.video(publicId).resize(
                thumbnail().width(300).height(200).gravity(Gravity.autoGravity())
                );

                return (
                <div
                    key={index}
                    className="relative border border-gray-200 rounded-lg overflow-hidden h-48 group"
                >
                    <div className="relative w-full h-full">
                    {/* Thumbnail for the video */}
                    <img
                        src={videoThumbnail.toURL()} // Cloudinary-generated thumbnail URL
                        alt={`Thumbnail for video ${index}`}
                        className="w-full h-full object-cover"
                    />
                    {/* Play button overlay */}
                    <button
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-lg transition-opacity duration-300 group-hover:opacity-100"
                        onClick={(e) => {
                        const videoElement = e.currentTarget.parentElement?.querySelector(
                            "video"
                        ) as HTMLVideoElement;
                        const thumbnailElement = e.currentTarget.parentElement?.querySelector(
                            "img"
                        );
                        if (videoElement && thumbnailElement) {
                            thumbnailElement.classList.add("hidden"); // Hide the thumbnail
                            videoElement.classList.remove("hidden"); // Show the video
                            videoElement.play(); // Play the video
                            e.currentTarget.classList.add("hidden"); // Hide the play button
                        }
                        }}
                    >
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-5.197-3.013A1 1 0 008 9.05v5.9a1 1 0 001.555.832l5.197-3.013a1 1 0 000-1.664z"
                        />
                        </svg>
                    </button>
                    {/* Video element hidden initially */}
                    <AdvancedVideo
                        cldVid={cld.video(publicId)} // Cloudinary video instance
                        className="w-full h-full object-cover hidden"
                        controls
                        preload="none" // Prevent preloading
                    />
                    </div>
                </div>
                );
            })}
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
};

export default TopUsers;