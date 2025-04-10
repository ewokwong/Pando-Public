"use client"

import type React from "react"
import { useState } from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VoteButtonProps {
  type: "upvote" | "downvote" // Use `type` for vote type
  initialCount?: number
  initialVoted?: boolean
  onVote?: (type: "upvote" | "downvote", voted: boolean) => void
  size?: "sm" | "md" | "lg"
  className?: string
  disabled?: boolean // Add a disabled prop
  onLoginRequired?: () => void // Callback for login requirement
  isLoggedIn?: boolean // Indicates if the user is logged in
}

const VoteButton: React.FC<VoteButtonProps> = ({
  type,
  initialCount = 0,
  initialVoted = false,
  onVote,
  size = "md",
  className = "",
  disabled = false, // Default to false
  onLoginRequired,
  isLoggedIn = true, // Default to true
}) => {
  const [count, setCount] = useState(initialCount)
  const [voted, setVoted] = useState(initialVoted)

  const handleVote = () => {
    if (disabled) return // Prevent voting if disabled

    if (!isLoggedIn) {
      if (onLoginRequired) onLoginRequired() // Trigger login modal if not logged in
      return
    }

    const newVoted = !voted
    setVoted(newVoted)
    setCount((prevCount) => (newVoted ? prevCount + 1 : prevCount - 1))

    if (onVote) {
      onVote(type, newVoted)
    }
  }

  const Icon = type === "upvote" ? ThumbsUp : ThumbsDown

  return (
    <div className={`flex items-center ${className}`}>
      <Button
        variant={voted ? "default" : "outline"}
        size={size === "md" ? "default" : size}
        onClick={handleVote}
        aria-label={type === "upvote" ? "Upvote" : "Downvote"}
        disabled={disabled} // Disable the button if disabled is true
        className={`transition-all ${
          voted
            ? type === "upvote"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
            : ""
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`} // Add styles for disabled state
      >
        <Icon className="mr-1" />
        <span className="ml-1">{count}</span>
      </Button>
    </div>
  )
}

export default VoteButton

