"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CameraCaptureProps {
  onCapture: (base64Image: string) => void;
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);

  // Initialize camera
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Camera access denied or unavailable:", err);
        setHasPermission(false);
      }
    }

    startCamera();

    // Cleanup: stop all tracks when the component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    // Trigger flash animation
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 300);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video videoWidth/Height for highest quality
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Draw the current video frame onto the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Compress and export to base64 jpeg
    const base64Image = canvas.toDataURL("image/jpeg", 0.8);
    
    // Slight delay so the user sees the flash before it unmounts
    setTimeout(() => onCapture(base64Image), 300);
  }, [onCapture]);

  // If permission is explicitly denied or broken
  if (hasPermission === false) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-surface-container-highest rounded-[2.5rem] border border-red-500/20 text-center px-6">
        <span className="material-symbols-outlined text-red-400 text-4xl mb-4" data-icon="no_photography">no_photography</span>
        <p className="font-headline font-bold text-on-surface">Camera Access Required</p>
        <p className="font-label text-xs text-on-surface-variant mt-2">Please enable camera permissions in your browser settings to scan crops.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-black group">
      {/* Hidden Canvas for Image Processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Video Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      {/* Shutter Overlay / UI Elements */}
      <div className="absolute inset-x-0 bottom-6 flex justify-center items-center z-20">
        <button
          onClick={handleCapture}
          className="w-16 h-16 rounded-full bg-primary flex items-center justify-center border-4 border-black/20 shadow-[0_0_20px_rgba(107,254,156,0.5)] active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-background text-3xl" data-icon="camera">camera</span>
        </button>
      </div>

      {/* Flash Animation Overlay */}
      <AnimatePresence>
        {isFlashing && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-white z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
