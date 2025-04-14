"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import AuthPageContainer from "@/components/common/AuthPageContainer"
import GoogleAuthButton from "@/components/common/GoogleAuthButton"
import Toast from "@/components/common/Toast"
import ServerWakingUpMessage from "@/components/common/ServerWakingUpMessage"
import { isInAppBrowser } from "@/utils/isInAppBrowser"
import "../auth/auth-forms.css"

const SignUpPage: React.FC = () => {
  const { signup } = useAuth()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [dob, setDob] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
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
      const response = (await signup(email, name, dob, password, confirmPassword)) as { status: number } | string

      if (!response) {
        setMessage("No response received from signup.")
        return
      }

      if (response && typeof response === "string" && response.includes("User created successfully")) {
        window.location.href = "/"
      } else {
        setMessage(`${response}`)
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.")
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
    // This function would ideally open the default browser
    // But since we can't directly do that from a web app,
    // we'll just provide instructions
    setToastMessage("Please open this link in your default browser")
    setShowToast(true)
  }

  if (isRestricted) {
    return (
      <AuthPageContainer>
        <div className="flex items-center justify-center p-4">
          <div className="auth-container fade-in">
            <div className="auth-inner">
              <div className="auth-header">
                <h1 className="auth-title">Open in Browser</h1>
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
      {/* Existing sign-up form code */}
      <div className="flex items-center justify-center p-4">
        <div className="auth-container fade-in">
          <div className="auth-inner">
            <div className="auth-header">
              <h1 className="auth-title">Create your account</h1>
              <p className="auth-subtitle">Join the Pando tennis community</p>
            </div>
            {message && <div className="error-message mb-4">{message}</div>}
            <form onSubmit={handleSubmit} className="auth-form">
              {/* Form fields */}
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
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  placeholder="Full name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="dob" className="form-label">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="form-input"
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
              <div className="form-group">
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                  placeholder="Confirm password"
                  required
                />
              </div>
              <button type="submit" className="form-button" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </button>

              {/* Server waking up message */}
              <ServerWakingUpMessage isVisible={showServerMessage} />
            </form>
            <div className="separator">
              <span>OR</span>
            </div>
            <GoogleAuthButton />
            <div className="auth-footer">
              Already have an account?{" "}
              <Link href="/login" className="auth-link">
                Sign in
              </Link>
            </div>
            <div className="mt-4 text-xs text-center text-gray-500">
              By creating an account, you agree to our{" "}
              <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Privacy Policy
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

export default SignUpPage
