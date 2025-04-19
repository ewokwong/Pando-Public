"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    cloudinary: any;
  }
}

interface VideoPlayerProps {
  id: string;
  publicId: string;
  width?: number;
  height?: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ id, publicId, width = 16, height = 9, ...props }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cloudinaryRef = useRef<any>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    console.log("Initializing Cloudinary...");
    if (cloudinaryRef.current) return;
  
    cloudinaryRef.current = window.cloudinary;
  
    if (cloudinaryRef.current && videoRef.current) {
      console.log("Cloudinary and videoRef are ready.");
      console.log("Video Ref:", videoRef.current)
      playerRef.current = cloudinaryRef.current.videoPlayer(videoRef.current, {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        secure: true,
      });
      console.log("Player initialized:", playerRef.current);
      console.log("Cloudinary Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
    }
  }, []);

  return (
    <div style={{ width: "100%", aspectRatio: `${width} / ${height}` }}>
      <video
        ref={videoRef}
        id={id}
        className="cld-video-player cld-fluid"
        controls
        data-cld-public-id={publicId}
        {...props}
      />
    </div>
  );
};

export default VideoPlayer;