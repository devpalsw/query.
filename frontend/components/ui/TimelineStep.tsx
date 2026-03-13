"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface TimelineStepProps {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress?: any;
}

const TimelineStep: React.FC<TimelineStepProps> = ({
  step,
  title,
  description,
  icon,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "start 60%"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);
  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className="relative flex items-center gap-8 px-4"
    >
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-2 border-2 border-blue-400 text-blue-400 text-xl font-bold">
          {step}
        </div>
        <div className="h-12 flex items-center">{icon}</div>
      </div>
      <div className="bg-white/5 rounded-2xl p-6 shadow-lg w-full">
        <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
        <p className="text-gray-300 text-base">{description}</p>
      </div>
    </motion.div>
  );
};

export default TimelineStep;
