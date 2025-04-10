"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import AuthPageContainer from "@/components/common/AuthPageContainer"
import GoogleAuthButton from "@/components/common/GoogleAuthButton"
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = (await signup(email, name, dob, password, confirmPassword)) as { status: number } | string

      if (!response) {
        setMessage("No response received from signup.")
        return
      }

      console.log("Response from signup:", response);
      console.log()
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

  return (
    <AuthPageContainer>
      <div className="flex items-center justify-center p-4">
        <div className="auth-container fade-in">
          <div className="auth-inner">
            <div className="auth-header">
              <h1 className="auth-title">Create your account</h1>
              <p className="auth-subtitle">Join the Pando tennis community</p>
            </div>
            {message && <div className="error-message mb-4">{message}</div>}
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
                    Creating account...
                  </span>
                ) : (
                  "Create account"
                )}
              </button>
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
    </AuthPageContainer>
  )
}

export default SignUpPage

