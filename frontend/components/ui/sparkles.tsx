"use client";

import React, { useId } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { cn } from "@/lib/utils";

export const SparklesCore = (props: {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
}) => {
  const {
    id,
    className,
    background = "transparent",
    minSize = 0.4,
    maxSize = 1,
    speed = 1,
    particleColor = "#ffffff",
    particleDensity = 120,
  } = props;
  
  const generatedId = useId();

  // Bulletproof initialization using 'any' to bypass strict TS engine requirements
  const particlesInit = async (engine: any) => {
    await loadSlim(engine);
  };

  return (
    <Particles
      id={id || generatedId}
      className={cn("h-full w-full", className)}
      init={particlesInit}
      options={{
        background: { color: { value: background } },
        fullScreen: { enable: false, zIndex: 1 },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: { enable: false, mode: "push" },
            onHover: { enable: false, mode: "repulse" },
            resize: true,
          },
        },
        particles: {
          color: { value: particleColor },
          move: {
            enable: true,
            direction: "none",
            outModes: { default: "bounce" },
            random: true,
            speed: speed,
            straight: false,
          },
          number: {
            density: { enable: true, area: 800 },
            value: particleDensity,
          },
          opacity: {
            value: { min: 0.1, max: 1 },
            animation: { enable: true, speed: speed * 2, sync: false },
          },
          size: {
            value: { min: minSize, max: maxSize },
          },
        },
        detectRetina: true,
      }}
    />
  );
};