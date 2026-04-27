"use client";

import { useEffect, useRef, useState } from "react";

const DeferredVideo = ({
  source,
  type = "video/mp4",
  poster,
  ariaLabel,
  className = "",
  containerClassName = "",
  autoPlay = true,
  controls = false,
  loop = true,
  muted = true,
  playsInline = true,
  preload = "metadata",
  placeholder = null,
}) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;

    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.15 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={containerClassName}>
      {!isVisible ? (
        placeholder || <div className="h-full w-full bg-slate-100" aria-hidden="true" />
      ) : (
        <video
          className={className}
          autoPlay={autoPlay}
          controls={controls}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          preload={preload}
          poster={poster}
          aria-label={ariaLabel}
        >
          <source src={source} type={type} />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default DeferredVideo;