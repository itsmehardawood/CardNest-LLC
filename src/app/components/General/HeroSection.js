'use client'
import Link from 'next/link';
import React, { useState } from 'react';

const DiagonalHeroSection = () => {
  const [videoError, setVideoError] = useState(false);

  return (
    <div className="relative h-screen lg:h-[500px] md:h-[700px] xl:h-[650px] bg-white w-full overflow-hidden">
      {/* Animation Video Background Layer */}
      <div className="absolute top-0 left-0 w-full h-screen md:h-[700px] xl:h-[650px] lg:h-[500px] z-0 overflow-hidden">
        {!videoError ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster='/images/nss.jpg'
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