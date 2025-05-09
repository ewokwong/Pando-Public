"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import AuthPageContainer from "@/components/common/AuthPageContainer"
import GoogleAuthButton from "@/components/common/GoogleAuthButton"
import Toast from "@/components/common/Toast"
import ServerWakingUpMessage from "@/components/common/ServerWakingUpMessage"
import "../auth/auth-forms.css"
import { isInAppBrowser } from "@/utils/isInAppBrowser"

const LoginPage: React.FC = () => {
  const { login, errorMessage } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRestricted, setIsRestricted] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [showServerMessage, setShowServerMessage] = useState(false)

  useEffect(() => {
    setIsRestricted(isInAppBrowser())
  }, [])

  useEffect(() => {
    let serverMessageTimer: NodeJS.Timeout | null = null

    if (isLoading) {
      // Show server waking up message after 5 seconds of loading
      serverMessageTimer = setTimeout(() => {
        setShowServerMessage(true)
      }, 5000)
    } else {
      setShowServerMessage(false)
    }

    return () => {
      if (serverMessageTimer) {
        clearTimeout(serverMessageTimer)
      }
    }
  }, [isLoading])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setShowServerMessage(false)

    try {
      const result = await login(email, password)
      if (!result) {
        window.location.href = "/"
      } else {
        setMessage(result)
      }
    } catch (error) {
      setMessage(errorMessage || "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      const url = window.location.href
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setToastMessage("Link copied! Open it in your browser")
          setShowToast(true)
        })
        .catch(() => {
          setToastMessage("Failed to copy link. Please try again")
          setShowToast(true)
        })
    }
  }

  const openInBrowser = () => {
    const userAgent = navigator.userAgent || navigator.vendor;
  
    let browserUrl = "https://pandotennis.vercel.app/login"; // Default URL
  
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
      // iOS device detected
      browserUrl = `x-safari-${browserUrl}`;
    } else if (/Android/i.test(userAgent)) {
      // Android device detected
      browserUrl = `googlechromes://${browserUrl}`;
    }
  
    setToastMessage("Please open this link in your default browser");
    setShowToast(true);
    window.location.href = browserUrl;
  };

  if (isRestricted) {
    return (
      <AuthPageContainer>
        <div className="flex items-center justify-center p-4">
          <div className="auth-container fade-in">
            <div className="auth-inner">
              <div className="auth-header">
                <h1 className="auth-title">Please open Pando in your browser</h1>
                <p className="auth-subtitle">
                  It looks like you're using an app that restricts sign-in. Please open this page in your browser to
                  continue.
                </p>
              </div>
              <button onClick={handleCopyLink} className="form-button">
                Copy Link to Open in Browser
              </button>
            </div>
          </div>
        </div>
        <Toast
          message={toastMessage}
          type="info"
          isVisible={showToast}
          onClose={() => setShowToast(false)}
          action={{
            label: "Open Browser",
            onClick: openInBrowser,
          }}
        />
      </AuthPageContainer>
    )
  }

  return (
    <AuthPageContainer>
      <div className="flex items-center justify-center p-4">
        <div className="auth-container fade-in" style={{ height: "auto", minHeight: "80vh" }}>
          <div className="auth-inner">
            <div className="auth-header">
              <h1 className="auth-title">Welcome back</h1>
              <p className="auth-subtitle">Sign in to your Pando account</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="Email address"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="Password"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" className="form-button" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>

              {/* Server waking up message */}
              <ServerWakingUpMessage isVisible={showServerMessage} />
            </form>

            <div className="separator">
              <span>OR</span>
            </div>

            <GoogleAuthButton />

            {message && <div className="error-message">{message}</div>}

            <div className="auth-footer">
              Don't have an account?{" "}
              <Link href="/sign-up" className="auth-link">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Toast
        message={toastMessage}
        type="info"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        action={{
          label: "Open Browser",
          onClick: openInBrowser,
        }}
      />
    </AuthPageContainer>
  )
}

export default LoginPage
