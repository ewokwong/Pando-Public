"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { GoogleAuthProvider, getAuth, signInWithPopup, type User } from "firebase/auth"
import { app } from "@/firebaseConfig"
import { useAuth } from "@/context/AuthContext"
import axios from "axios"
import ServerWakingUpMessage from "@/components/common/ServerWakingUpMessage"
import "./GoogleAuthButton.css" // Import your CSS file

interface GoogleAuthButtonProps {
  className?: string
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ className }) => {
  const { setUserObject, setIsLoggedIn } = useAuth() // Ensure these are destructured correctly
  const [isLoading, setIsLoading] = useState(false) // Add loading state
  const [showServerMessage, setShowServerMessage] = useState(false)
  const [loadingStage, setLoadingStage] = useState<"initial" | "google" | "server">("initial")

  // Set up timer for server message
  useEffect(() => {
    let serverMessageTimer: NodeJS.Timeout | null = null

    if (isLoading && loadingStage === "server") {
      // Show server waking up message after 3 seconds of server processing
      serverMessageTimer = setTimeout(() => {
        setShowServerMessage(true)
      }, 3000)
    } else {
      setShowServerMessage(false)
    }

    return () => {
      if (serverMessageTimer) {
        clearTimeout(serverMessageTimer)
      }
    }
  }, [isLoading, loadingStage])

  // Function to handle sign-in and update AuthContext
  const handleSignIn = (token: string, user: any) => {
    // Store token in localStorage
    localStorage.setItem("token", token)

    // Set the logged-in state
    setIsLoggedIn(true)

    // Set user object
    setUserObject(user)

    // Navigate to the homepage
    window.location.href = "/" // Use window.location.href for navigation
  }

  // To create a new user in the database when they sign in using Google Auth
  const createNewFirebaseUser = async (user: User) => {
    setLoadingStage("server") // Update loading stage to server processing
    const apiBaseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth` // Update API base URL
    console.log("Adding a firebase user to DB")
    try {
      // Create a new user in the database
      const response = await axios.post(`${apiBaseUrl}/add-firebase-user`, {
        firebaseUID: user.uid,
        email: user.email,
        displayName: user.displayName,
        profilePhoto: user.photoURL || "",
      })

      // Extract the JWT token from the response
      const newUserToken = response.data.token
      console.log("New user created:", response.data)

      // Call handleSignIn to update AuthContext and navigate
      handleSignIn(newUserToken, response.data.user) // Use the custom JWT token from the backend
    } catch (error: any) {
      console.error("Error creating new user:", error.message)
      alert("Error creating new user. Please try again.")
    }
  }

  const handleGoogleSignIn = async () => {
    console.log("Google Sign In")
    setIsLoading(true) // Set loading to true
    setLoadingStage("google") // Set initial loading stage to Google authentication

    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: "select_account" })
      const auth = getAuth(app)

      const result = await signInWithPopup(auth, provider)

      // User will be assigned based on the Google account
      const user = result.user

      // Get Token and Sign with JWT
      const idToken = await user.getIdToken()
      console.log("Firebase ID Token:", idToken)

      // Update loading stage to server processing
      setLoadingStage("server")

      const apiBaseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user` // Update API base URL

      console.log("User previously signed-in:", user.uid)

      try {
        // Retrieve user details from the database
        const userDetailsResponse = await axios.get(`${apiBaseUrl}/firebase/${user.uid}`, {
          headers: { Authorization: `Bearer ${idToken}` }, // Pass the Firebase ID token to the backend
        })
        console.log("User exists, retrieving details...")
        const userDetails = userDetailsResponse.data
        const userToken = userDetails.token // Correctly extract the token from the response
        console.log("User details:", userDetails)

        // Call handleSignIn to update AuthContext and navigate
        handleSignIn(userToken, userDetails.user) // Use the custom JWT token from the backend
      } catch (apiError: any) {
        if (apiError.response && apiError.response.status === 404) {
          console.log("User does not exist in the database. Creating a new user...")
          await createNewFirebaseUser(user) // Call the function to create a new user
        } else {
          console.error("Error retrieving user from the database:", apiError.message)
          alert("Error retrieving user from the database. Please try again later.")
        }
      }
    } catch (error: any) {
      console.error("Error during Google Sign-In:", error)
      // Optionally, show a fallback message or log the error
      // if (error.code === "auth/popup-closed-by-user") {
      //   // User closed the popup, no need to show an error
      //   console.log("Sign-in popup closed by user")
      // } else {
      //   alert("Error signing in with Google. Please give it a few seconds for the server to start up and try again.")
      // }
    } finally {
      setIsLoading(false) // Set loading to false
    }
  }

  const getLoadingText = () => {
    if (loadingStage === "google") {
      return "Authenticating with Google..."
    } else if (loadingStage === "server") {
      return "Processing your account..."
    }
    return "Signing in..."
  }

  return (
    <div>
      <button
        onClick={handleGoogleSignIn}
        className={`google-auth-button ${className || ""}`.trim()}
        disabled={isLoading} // Disable button while loading
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {getLoadingText()}
          </span>
        ) : (
          <>
            <img
              src="https://res.cloudinary.com/dsnrydwvc/image/upload/v1743320517/png-transparent-google-company-text-logo-removebg-preview_jry9iw.png"
              alt="Google Logo"
              className="google-logo"
            />
            Sign in with Google
          </>
        )}
      </button>

      {/* Show server waking up message when appropriate */}
      {isLoading && <ServerWakingUpMessage isVisible={showServerMessage} />}
    </div>
  )
}

export default GoogleAuthButton
