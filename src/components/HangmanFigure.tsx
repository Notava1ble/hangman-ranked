import { motion, AnimatePresence } from "framer-motion";
import React from "react";

const HangmanFigure = ({ wrongGuesses = 0 }: { wrongGuesses?: number }) => {
  const parts = [
    <motion.circle
      key="head"
      cx="140"
      cy="70"
      r="20"
      stroke="black"
      fill="none"
      strokeWidth="4"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.2 }}
    />,
    <motion.line
      key="body"
      x1="140"
      y1="90"
      x2="140"
      y2="150"
      stroke="black"
      strokeWidth="4"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.2 }}
    />,
    <motion.line
      key="leftArm"
      x1="140"
      y1="110"
      x2="110"
      y2="130"
      stroke="black"
      strokeWidth="4"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.2 }}
    />,
    <motion.line
      key="rightArm"
      x1="140"
      y1="110"
      x2="170"
      y2="130"
      stroke="black"
      strokeWidth="4"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.2 }}
    />,
    <motion.line
      key="leftLeg"
      x1="140"
      y1="150"
      x2="110"
      y2="180"
      stroke="black"
      strokeWidth="4"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.2 }}
    />,
    <motion.line
      key="rightLeg"
      x1="140"
      y1="150"
      x2="170"
      y2="180"
      stroke="black"
      strokeWidth="4"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.2 }}
    />,
  ];

  const minGuesses = 0;
  const maxGuesses = parts.length;
  const clampedGuesses = Math.max(
    minGuesses,
    Math.min(wrongGuesses, maxGuesses)
  );

  return (
    <div className="border-4 border-black w-fit rounded-sm pb-4 mx-auto bg-white mt-4 mb-4">
      <svg height="250" width="200" className="mx-auto mt-4">
        {/* Gallows */}
        <line
          x1="20"
          y1="230"
          x2="180"
          y2="230"
          stroke="black"
          strokeWidth="4"
        />
        <line x1="60" y1="230" x2="60" y2="20" stroke="black" strokeWidth="4" />
        <line x1="60" y1="20" x2="140" y2="20" stroke="black" strokeWidth="4" />
        <line
          x1="140"
          y1="20"
          x2="140"
          y2="50"
          stroke="black"
          strokeWidth="4"
        />

        {/* Animated Parts */}
        <AnimatePresence initial={false}>
          {parts.slice(0, clampedGuesses).map((part, i) => (
            <React.Fragment key={i}>{part}</React.Fragment>
          ))}
        </AnimatePresence>
      </svg>
    </div>
  );
};

export default HangmanFigure;
