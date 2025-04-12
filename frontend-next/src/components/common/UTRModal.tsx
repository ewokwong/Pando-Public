"use client"

import type React from "react"
import axios from "axios"
import { ExternalLink, CheckCircle, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog } from "@mui/material"
import { useEffect } from "react"

interface FindFriendsModalProps {
  open: boolean
  onClose: () => void
  userId: string
}

const FindFriendsModal: React.FC<FindFriendsModalProps> = ({ open, onClose, userId }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSubmit = () => {
    // Submit verification request
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user/verify-user`, { userId })
      .then((response) => {
        console.log("User verified successfully:", response.data)
      })
      .catch((error) => {
        console.error("Error verifying user:", error)
      })

    // Close modal and reload page
    onClose()
    window.location.reload()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        },
      }}
    >
      <div className="relative bg-white rounded-xl shadow-xl w-full max-h-[95vh] overflow-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X size={20} className="text-gray-500" />
        </button>

        {/* Header */}
        <div className="text-center pt-8 px-6 pb-4">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={28} className="text-brand-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
          <p className="text-gray-600 mb-6">
            Tell us more about your tennis experience so we can accurately match you with players in our system!
          </p>
          <a
            href="https://forms.gle/qYkeESNqfkK61w847"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors font-medium"
          >
            <ExternalLink size={18} />
            Link to Form
          </a>
        </div>

        {/* Info Box */}
        <div className="bg-green-50 mt-6 px-6 mb-4 mx-6 rounded-lg border border-green-100">
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-green-700 text-sm">
              After submitting the form, our team will review your information, assign you a rating, and verify your
              account on the Pando network. You'll receive an email confirmation when the process is complete.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 px-6 pb-6 border-t border-gray-100">
          <Button variant="outline" onClick={handleSubmit} className="px-4 py-2 bg-brand-500 hover:bg-brand-600">
            I've Completed the Form
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default FindFriendsModal

