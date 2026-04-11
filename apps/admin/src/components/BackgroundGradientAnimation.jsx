import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

const pointerColors = ["255, 0, 0", "0, 255, 0", "255, 255, 255"];

export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(0, 0, 0)",
  gradientBackgroundEnd = "rgb(10, 0, 20)",
  firstColor = "18, 113, 255",
  secondColor = "221, 74, 255",
  thirdColor = "100, 220, 255",
  fourthColor = "200, 50, 50",
  fifthColor = "180, 180, 50",
  size = "80%",
  blendingValue = "hard-light",
  interactive = true,
  children,
}) => {
  const interactiveRef = useRef(null);
  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);
  const [activeColorIndex, setActiveColorIndex] = useState(0);

  useEffect(() => {
    document.body.style.setProperty("--gradient-background-start", gradientBackgroundStart);
    document.body.style.setProperty("--gradient-background-end", gradientBackgroundEnd);
    document.body.style.setProperty("--first-color", firstColor);
    document.body.style.setProperty("--second-color", secondColor);
    document.body.style.setProperty("--third-color", thirdColor);
    document.body.style.setProperty("--fourth-color", fourthColor);
    document.body.style.setProperty("--fifth-color", fifthColor);
    document.body.style.setProperty("--size", size);
    document.body.style.setProperty("--blending-value", blendingValue);
  }, [gradientBackgroundStart, gradientBackgroundEnd, firstColor, secondColor, thirdColor, fourthColor, fifthColor, size, blendingValue]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveColorIndex((prevIndex) => (prevIndex + 1) % pointerColors.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function move() {
      if (!interactiveRef.current) return;
      setCurX(curX + (tgX - curX) / 35);
      setCurY(curY + (tgY - curY) / 35);
      interactiveRef.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
    }
    const animationFrame = requestAnimationFrame(move);
    return () => cancelAnimationFrame(animationFrame);
  }, [tgX, tgY, curX, curY]);

  const handleMouseMove = (event) => {
    setTgX(event.clientX);
    setTgY(event.clientY);
  };

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  const commonBlobStyles = {
    position: 'absolute', mixBlendMode: 'var(--blending-value)', width: 'var(--size)',
    height: 'var(--size)', top: 'calc(50% - var(--size) / 2)', left: 'calc(50% - var(--size) / 2)',
    opacity: 1, borderRadius: '50%',
  };

  return (
    <Box
      onMouseMove={handleMouseMove}
      sx={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(40deg, var(--gradient-background-start), var(--gradient-background-end))',
        zIndex: 1,
      }}
    >
      <svg style={{ display: "none" }}>
        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      
      <Box sx={{ position: 'relative', zIndex: 10, height: '100%', width: '100%' }}>
        {children}
      </Box>

      <Box sx={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        filter: isSafari ? 'blur(35px)' : 'url(#blurMe)',
        // --- THE FINAL, DEFINITIVE FIX ---
        // This doubles the size of the animation canvas, creating a massive
        // off-screen margin that guarantees the clipped edges will never be visible.
        transform: 'scale(2)',
      }}>
        
        {/* The complete and correct static blobs */}
        <Box sx={{ ...commonBlobStyles, background: 'radial-gradient(circle at center, var(--first-color) 0, rgba(var(--first-color), 0) 50%) no-repeat', transformOrigin: 'center center', animation: 'moveVertical 30s ease infinite' }} />
        <Box sx={{ ...commonBlobStyles, background: 'radial-gradient(circle at center, rgba(var(--second-color), 0.8) 0, rgba(var(--second-color), 0) 50%) no-repeat', transformOrigin: 'calc(50% - 400px)', animation: 'moveInCircle 20s reverse infinite' }} />
        <Box sx={{ ...commonBlobStyles, background: 'radial-gradient(circle at center, rgba(var(--third-color), 0.8) 0, rgba(var(--third-color), 0) 50%) no-repeat', transformOrigin: 'calc(50% + 400px)', animation: 'moveInCircle 40s linear infinite' }} />
        <Box sx={{ ...commonBlobStyles, opacity: 0.7, background: 'radial-gradient(circle at center, rgba(var(--fourth-color), 0.8) 0, rgba(var(--fourth-color), 0) 50%) no-repeat', transformOrigin: 'calc(50% - 200px)', animation: 'moveHorizontal 40s ease infinite' }} />
        <Box sx={{ ...commonBlobStyles, background: 'radial-gradient(circle at center, rgba(var(--fifth-color), 0.8) 0, rgba(var(--fifth-color), 0) 50%) no-repeat', transformOrigin: 'calc(50% - 800px) calc(50% + 800px)', animation: 'moveInCircle 20s ease infinite' }} />

        {/* The complete and correct interactive blob */}
        {interactive && (
          <Box
            ref={interactiveRef}
            sx={{
              position: 'absolute', width: 'var(--size)', height: 'var(--size)',
              top: '-50%', left: '-50%',
            }}
          >
            {pointerColors.map((color, index) => (
              <Box
                key={index}
                sx={{
                  position: 'absolute',
                  background: `radial-gradient(circle at center, rgba(${color}, 0.8) 0, rgba(${color}, 0) 50%) no-repeat`,
                  mixBlendMode: 'var(--blending-value)',
                  width: '100%', height: '100%',
                  opacity: activeColorIndex === index ? 0.7 : 0,
                  borderRadius: '50%',
                  transition: 'opacity 2.5s ease-in-out',
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};