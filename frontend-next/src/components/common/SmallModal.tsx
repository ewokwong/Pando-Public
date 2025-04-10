"use client"

import type React from "react"
import { type ReactNode, type MouseEvent, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import styles from "./Modal.module.css"

interface SmallModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

const SmallModal: React.FC<SmallModalProps> = ({ isOpen, onClose, children }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Don't render anything on the server
  if (!mounted || !isOpen) return null

  // Create portal content
  const modalContent = (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={`${styles.modalContent} ${styles.smallModalContent}`}>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  )

  // Use document.body as the portal container if modal-root doesn't exist
  const portalContainer = document.getElementById("modal-root") || document.body

  return createPortal(modalContent, portalContainer)
}

export default SmallModal

