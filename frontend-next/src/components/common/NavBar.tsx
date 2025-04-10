"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react"

interface UserObject {
  profilePhoto?: string
}

const NavBar: React.FC = () => {
  const { isLoggedIn, userObject, logout } = useAuth() as {
    isLoggedIn: boolean
    userObject: UserObject | null
    logout: () => void
  }

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleDropdown = () => setDropdownVisible(!dropdownVisible)

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center" legacyBehavior>
              <img
                src="https://res.cloudinary.com/dsnrydwvc/image/upload/v1742612869/Pando/mzmqqozsnnlip70xwlef.svg"
                alt="Pando Logo"
                className="h-10 w-auto rounded-md"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-blue-400 transition-colors px-3 py-2 text-sm font-medium">
              Home
            </Link>
            <Link
              href="/find-friends"
              className="text-white hover:text-blue-400 transition-colors px-3 py-2 text-sm font-medium"
            >
              Find Friends
            </Link>
            <Link
              href="/messages"
              className="text-white hover:text-blue-400 transition-colors px-3 py-2 text-sm font-medium"
            >
              Messages
            </Link>

            {/* Profile or Login */}
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-white hover:text-blue-400 transition-colors"
                >
                  {userObject?.profilePhoto ? (
                    <img
                      src={userObject.profilePhoto || "/placeholder.svg"}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover border-2 border-white"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                  <ChevronDown
                    size={16}
                    className={`ml-1 transition-transform duration-200 ${dropdownVisible ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownVisible && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-fadeIn">
                    <Link
                      href="/edit-profile"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownVisible(false)}
                    >
                      <div className="flex items-center">
                        <User size={16} className="mr-2" />
                        Edit Profile
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setDropdownVisible(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-white hover:text-blue-400 focus:outline-none">
              {isMenuOpen ? (
                <X size={24} className="transition-transform duration-200 rotate-90" />
              ) : (
                <Menu size={24} className="transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md animate-slideDown">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block text-white hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/find-friends"
              className="block text-white hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Friends
            </Link>
            <Link
              href="/messages"
              className="block text-white hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Messages
            </Link>

            {/* Profile or Login for mobile */}
            {isLoggedIn ? (
              <>
                <Link
                  href="/edit-profile"
                  className="w-full text-left text-white hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <User size={18} className="mr-2" />
                    Edit Profile
                  </div>
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-left text-white hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium"
                >
                  <div className="flex items-center">
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </div>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavBar

