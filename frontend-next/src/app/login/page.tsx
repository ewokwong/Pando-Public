"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import AuthPageContainer from "@/components/common/AuthPageContainer"
import GoogleAuthButton from "@/components/common/GoogleAuthButton"
import "../auth/auth-forms.css"

const LoginPage: React.FC = () => {
  const { login, errorMessage } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(email, password); // Capture the return value
      if (!result) {
        window.location.href = "/"; // Redirect only if login is successful
      } else {
        setMessage(result); // Display the error message
      }
    } catch (error) {
      setMessage(errorMessage || "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthPageContainer>
      <div className="flex items-center justify-center p-4">
        <div className="auth-container fade-in" style={{ height: "80vh" }}>
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
    </AuthPageContainer>
  )
}

export default LoginPage

