'use client'
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';

const DiagonalHeroSection = () => {
  const [videoError, setVideoError] = useState(false);
  const [mainVideoError, setMainVideoError] = useState(false);
  const backgroundVideoRef = useRef(null);
  const mainVideoRef = useRef(null);

  useEffect(() => {
    const playVideos = async () => {
      try {
        if (backgroundVideoRef.current) {
          await backgroundVideoRef.current.play();
        }
        
        // Small delay for main video
        setTimeout(async () => {
          if (mainVideoRef.current && !mainVideoError) {
            try {
              await mainVideoRef.current.play();
            } catch (error) {
              console.log('Main video autoplay prevented, but video is loaded');
            }
          }
        }, 200);
      } catch (error) {
        console.log('Video autoplay prevented:', error);
      }
    };

    playVideos();
  }, [mainVideoError]);

  return (
    <div className="relative h-screen lg:h-[500px] md:h-[700px] xl:h-[650px] bg-white w-full overflow-hidden">
      {/* Animation Video Background Layer */}
      <div className="absolute top-0 left-0 w-full h-screen md:h-[700px] xl:h-[650px] lg:h-[500px] z-0 overflow-hidden">
        {!videoError ? (
          <video
            ref={backgroundVideoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full lg:h-full h-screen object-cover lg:object-fill"
            onError={() => setVideoError(true)}
          >
            <source src="https://d21vkevu6wrni5.cloudfront.net/cardnest%20new%204k.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
            <p className="text-gray-500">Loading video...</p>
          </div>
        )}
        <div className="absolute inset-0 bg-white/5"></div>
      </div>
      {/* You can add your hero content here, similar to copyHero.js */}
    </div>
  );
};

export default DiagonalHeroSection;