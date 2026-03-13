"use client";

import React, { useRef, useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import TimelineStep from "@/components/ui/TimelineStep";
import { ArrowRight } from "lucide-react";

import { useAuthStore } from "../lib/store/useAuthStore";

const QuickTrialChat = () => {
  const [prompt, setPrompt] = React.useState("");
  const [activeTool, setActiveTool] = React.useState("nl2sql");

  const tools = [
    { id: "nl2sql", name: "NL2SQL", path: "/nl2sql" },
    { id: "querycorrector", name: "Corrector", path: "/querycorrector" },
    { id: "queryexplainer", name: "Explainer", path: "/queryexplainer" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mx-auto mt-12 max-w-2xl w-full px-4"
    >
      <div className="relative rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl shadow-2xl">
        {/* Tool Selector Tabs */}
        <div className="flex gap-1 mb-2 p-1">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTool === tool.id
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tool.name}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="relative flex items-center">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Ask our ${activeTool} agent...`}
            className="w-full bg-transparent px-4 py-4 text-sm text-white outline-hidden placeholder:text-gray-600"
          />
          <Link
            href={`${tools.find((t) => t.id === activeTool)?.path}?prompt=${encodeURIComponent(prompt)}`}
            className="absolute right-2 p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
          >
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-gray-500">
        Try: "Find all users who joined in the last 30 days"
      </p>
    </motion.div>
  );
};

// --- Components ---

const ToolCard = ({
  title,
  description,
  href,
  delay,
}: {
  title: string;
  description: string;
  href: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300"
  >
    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl group-hover:bg-blue-500/30 transition-all" />

    <h3 className="mb-3 text-xl font-semibold text-white">{title}</h3>
    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
      {description}
    </p>

    <div className="mt-6 flex items-center text-sm font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2.5 group-hover:translate-x-0">
      <Link
        href={href}
        className="mt-6 inline-flex items-center text-sm font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2.5 group-hover:translate-x-0 cursor-pointer"
      >
        Try now <ArrowRight size={16} className="ml-2" />
      </Link>
    </div>
  </motion.div>
);

const FeatureItem = ({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: any;
}) => (
  <div className="flex flex-col p-6 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/5 transition-colors">
    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
      <Icon size={20} />
    </div>
    <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
    <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
  </div>
);

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auth state
  const { user, isLoading, fetchUser, logout } = useAuthStore();

  useEffect(() => {
    if (isLoading) {
      fetchUser();
    }
    // Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true, // Replaces 'smooth' for mouse wheel
      syncTouch: true, // Use this if you want to smooth touch scrolling
      // direction: "vertical",
      // gestureDirection: "vertical",
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, [isLoading, fetchUser]);

  // Timeline scroll animation
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"],
  });
  return (
    <div
      className="min-h-screen bg-[#05050A] text-white selection:bg-blue-500/30 overflow-x-hidden font-sans overflow-hidden  inset-0 h-full w-full 
bg-[radial-gradient(circle,#73737350_1px,transparent_1px)] 
bg-size-[20px_20px]"
    >
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#05050A]/80 backdrop-blur-md ">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center tracking-widest font-bold text-xl ">
            {/* <Database className="text-blue-500" /> */}
            GET<span className="text-blue-500 ">SQL</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400"></div>
          {/* Auth-aware nav button */}
          {isLoading ? (
            <div className="rounded-full bg-white/20 px-5 py-2 text-sm font-semibold text-gray-400 animate-pulse">
              Loading...
            </div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/80">
                Hi, {user.full_name || user.email}
              </span>
              <button
                className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition-colors"
                onClick={logout}
              >
                Sign out
              </button>
            </div>
          ) : (
            <button className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-gray-200 transition-colors">
              <a href="/auth/signin"> Get Started</a>
            </button>
          )}
        </div>
      </nav>
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative pt-16 pb-15 lg:pt-36 lg:pb-20 ">
        {/* --- START BACKGROUND GRAPHICS --- */}
        <div className="absolute inset-0 -z-10">
          {/* 1. The Main Deep Blue Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-900/30 via-[#05050A] to-[#05050A]" />

          {/* 2. The Subtle Grid (Fades out at the bottom) */}
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px), 
                          linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
              backgroundSize: "4rem 4rem",
              maskImage:
                "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
            }}
          />

          {/* 3. The Animated Soft Orb */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-1/2 top-[-10%] -translate-x-1/2 h-[600px] w-[1000px] rounded-full bg-blue-600/10 blur-[120px]"
          />
        </div>
        {/* --- END BACKGROUND GRAPHICS --- */}

        <div className="mx-auto max-w-7xl px-6 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto p-2 max-w-4xl text-5xl font-bold tracking-tight md:text-7xl bg-clip-text text-transparent bg-linear-to-b from-white to-white/60"
          >
            Stop Hallucinating.
            <br /> Start Querying.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-shadow-white tracking-wide leading-relaxed"
          >
            The schema-aware SQL agent that actually understands your database
            structure.
            <br /> Zero friction, zero hallucinations.
          </motion.p>
        </div>
      </section>
      <QuickTrialChat />
      {/* How It Works Timeline Section */}
      <section
        ref={timelineRef}
        className="relative py-32 bg-transparent flex flex-col items-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center bg-linear-to-b from-blue-400 to-white bg-clip-text text-transparent">
          How It Works
        </h2>
        <div className="relative w-full max-w-3xl mx-auto">
          {/* Timeline vertical line */}
          {/* <motion.div
            className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-1 bg-linear-to-b from-blue-500/60 to-blue-900/10 rounded-full z-0"
            style={{ scaleY: timelineProgress }}
          /> */}
          <div className="flex flex-col gap-32 relative z-10">
            {/* Step 1 */}
            <TimelineStep
              step={1}
              title="Ask in Natural Language"
              description="Type your question about your data in plain English. No SQL knowledge needed!"
              icon={
                <ArrowRight size={28} className="rotate-180 text-blue-400" />
              }
              progress={timelineProgress}
            />
            {/* Step 2 */}
            <TimelineStep
              step={2}
              title="Get SQL Instantly"
              description="Our agent reads your schema and generates a valid, ready-to-run SQL query tailored to your database."
              icon={<ArrowRight size={28} className="text-blue-400" />}
              progress={timelineProgress}
            />
            {/* Step 3 */}
            <TimelineStep
              step={3}
              title="Correct or Explain"
              description="Paste any SQL to get instant corrections or a plain English explanation."
              icon={<ArrowRight size={28} className="text-blue-400" />}
              progress={timelineProgress}
            />
            {/* Step 4 */}
            <TimelineStep
              step={4}
              title="Copy & Use"
              description="Copy the result and use it in your app, dashboard, or anywhere you need."
              icon={<ArrowRight size={28} className="text-blue-400" />}
              progress={timelineProgress}
            />
          </div>
        </div>
      </section>

      {/* Tools Orchestration Section */}
      <section
        className="py-24 bg-[#05050A] overflow-hidden  inset-0 h-full w-full 
bg-[radial-gradient(circle,#73737350_1px,transparent_1px)] 
bg-size-[20px_20px]"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Convert • Correct • Explain
            </h2>
            {/* <p className="mt-4 text-gray-400">
              Everything you need to interact with your data, orchestrated into
              one seamless workflow.
            </p> */}
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <ToolCard
              title="NL2SQL Generator"
              description="Transforms natural language into precise SQL queries. It doesn't just guess; it reads your schema to ensure valid table and column references every time."
              href="/nl2sql"
              delay={0.1}
            />
            <ToolCard
              title="Query Corrector"
              description="Have a broken query? Paste it here. We identify syntax errors, logical flaws, and schema mismatches, then auto-fix them in milliseconds."
              href="/querycorrector"
              delay={0.2}
            />
            <ToolCard
              title="Query Explainer"
              description="Demystify complex JOINs and subqueries. Get a plain English breakdown of what any SQL snippet is actually doing to your database."
              href="/queryexplainer"
              delay={0.3}
            />
          </div>
        </div>
      </section>
      {/* Metrics / 
      {/* Footer */}
      <footer className=" bg-radial-[#05050A] rounded-t-4xl py-12 ">
        <div className="mx-auto max-w-7xl px-6 text-center text-gray-500 text-sm">
          <p>&copy; KrishCodesW</p>
        </div>
      </footer>
    </div>
  );
}
