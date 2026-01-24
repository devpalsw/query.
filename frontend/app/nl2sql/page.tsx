"use client";

import { useState, useEffect } from "react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useHistory } from "../../components/hooks/useHistory";
// Using a darker, more vibrant theme for the code block
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Copy,
  Check,
  Zap,
  History,
  Lock,
  ChevronRight,
  ChevronDown,
  Loader2,
  X,
  Database,
  Terminal,
  Trash2,
  Code2,
  Cpu,
  Sparkles,
  Command,
  MousePointer2,
  ArrowRightCircleIcon,
} from "lucide-react";

const GUEST_LIMIT = 2;

// --- Helper Components ---
const Tooltip = ({
  children,
  text,
  side = "right",
}: {
  children: React.ReactNode;
  text: string;
  side?: "right" | "top";
}) => (
  <div className="group relative flex items-center justify-center">
    {children}
    <span
      className={`absolute ${side === "right" ? "left-14 ml-2" : "bottom-full mb-3"} px-2.5 py-1.5 bg-slate-900 text-white text-[10px] font-semibold tracking-wide rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-95 group-hover:scale-100 pointer-events-none z-50 shadow-xl border border-slate-700/50`}
    >
      {text}
      {/* Little arrow tip */}
      <span
        className={`absolute w-2 h-2 bg-slate-900 rotate-45 ${side === "right" ? "-left-1 top-1/2 -translate-y-1/2" : "-bottom-1 left-1/2 -translate-x-1/2"}`}
      />
    </span>
  </div>
);

interface HistoryListProps {
  history: any[];
  loadSession: (item: any) => void;
  removeHistoryItem: (id: string) => void;
  isPro?: boolean;
}

const HistoryList = React.memo(
  ({ history, loadSession, removeHistoryItem, isPro }: HistoryListProps) => (
    <div className="flex flex-col h-full bg-slate-50/50">
      <div className="p-5 shrink-0 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 text-slate-500">
          <History className="w-4 h-4" />
          <h2 className="text-xs font-bold uppercase tracking-widest">
            Timeline
          </h2>
        </div>
        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
          {history.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center p-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <History className="w-5 h-5 text-slate-300" />
            </div>
            <p className="text-sm text-slate-500 font-medium">No history yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Queries you generate will appear here.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {history.map((item) => (
              <motion.div
                layout
                key={item.id}
                onClick={() => loadSession(item)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="group relative p-3.5 rounded-xl bg-white border border-slate-200/60 hover:border-indigo-300 hover:shadow-[0_4px_12px_-4px_rgba(99,102,241,0.1)] cursor-pointer transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ring-2 ring-white ${item.sql ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]" : "bg-amber-400"}`}
                    />
                    <span className="text-[10px] text-slate-400 font-mono font-medium">
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeHistoryItem(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all scale-90 hover:scale-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs font-medium text-slate-700 line-clamp-2 leading-relaxed group-hover:text-indigo-900 transition-colors">
                  {item.query}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {!isPro && (
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
              <span>Guest Usage</span>
              <span>
                {history.length}/{GUEST_LIMIT}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min((history.length / GUEST_LIMIT) * 100, 100)}%`,
                }}
                className={`h-full rounded-full transition-all duration-500 ${history.length >= GUEST_LIMIT ? "bg-red-500" : "bg-linear-to-tr from-indigo-500 to-purple-500"}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  ),
);
HistoryList.displayName = "HistoryList";

// --- 2. EditorPanel (Revamped) ---
interface EditorPanelProps {
  input: string;
  setInput: (val: string) => void;
  schema: string;
  setSchema: (val: string) => void;
  isSchemaOpen: boolean;
  setIsSchemaOpen: (val: boolean) => void;
  handleGenerate: () => void;
  loading: boolean;
}

const EditorPanel = React.memo(
  ({
    input,
    setInput,
    schema,
    setSchema,
    isSchemaOpen,
    setIsSchemaOpen,
    handleGenerate,
    loading,
  }: EditorPanelProps) => (
    <div className="max-w-4xl mx-auto bg-white w-full h-full flex flex-col px-1 md:px-6 py-2 md:py-6">
      <div className="mb-6 md:mb-8 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center justify-center md:justify-start gap-3">
          GETSQL
        </h1>
        <p className="text-slate-500 text-sm md:text-base mt-2 font-medium">
          Turn natural language into optimized SQL instantly.
        </p>
      </div>

      <motion.div
        layout
        className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 flex flex-col flex-1 min-h-0 relative overflow-hidden ring-1 ring-slate-900/5"
      >
        {/* Main Input Area */}
        <div className="flex-1 p-5 md:p-8 flex flex-col min-h-0 relative z-10">
          <div className="absolute top-4 right-4 md:top-6 md:right-6 opacity-20 pointer-events-none">
            <Command className="w-12 h-12 text-slate-300" />
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your data query here..."
            className="w-full flex-1 resize-none outline-none text-base md:text-xl text-slate-700 placeholder:text-slate-300 bg-transparent font-medium leading-relaxed"
            spellCheck={false}
            autoFocus
          />

          {/* Suggestion Chips (Static for visual flair) */}
          {!input && (
            <div className="flex flex-wrap gap-2 mt-4 opacity-60">
              {[
                "Find users active last week",
                "Revenue by product category",
              ].map((hint) => (
                <button
                  key={hint}
                  onClick={() => setInput(hint)}
                  className="text-xs bg-slate-50 border border-slate-100 text-slate-400 px-3 py-1.5 rounded-full hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  {hint}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="px-5 md:px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          {/* Schema Toggle */}
          <button
            onClick={() => setIsSchemaOpen(!isSchemaOpen)}
            className={`group flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors ${!schema ? "text-amber-500" : "text-slate-400 hover:text-indigo-600"}`}
          >
            <div
              className={`p-1.5 rounded-lg transition-colors ${!schema ? "bg-amber-100 text-amber-600" : "bg-white border border-slate-200 group-hover:border-indigo-200"}`}
            >
              <Database className="w-3.5 h-3.5" />
            </div>
            <span className="hidden md:inline">Schema Context</span>
            <span className="md:hidden">Schema</span>
            {!schema && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            )}
            <ChevronDown
              className={`w-3 h-3 transition-transform duration-300 ${isSchemaOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !input}
            className="group relative overflow-hidden flex items-center gap-2.5 bg-slate-900 text-white pl-5 pr-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-slate-900/20 active:scale-95 hover:shadow-xl hover:shadow-slate-900/10"
          >
            <div className="absolute inset-0 bg-linear-to-tr from-indigo-400 to-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center gap-2">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white/70" />
              ) : (
                <ArrowRightCircleIcon className="w-4 h-4  group-hover:text-white transition-colors" />
              )}
              <span>{loading ? "Thinking..." : "Generate"}</span>
            </div>
          </button>
        </div>

        {/* Schema Drawer */}
        <AnimatePresence>
          {isSchemaOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="border-t border-slate-200 bg-slate-50/80 backdrop-blur-sm"
            >
              <div className="p-5 md:p-8">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Database Schema (DDL)
                </label>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                  <textarea
                    value={schema}
                    onChange={(e) => setSchema(e.target.value)}
                    placeholder="CREATE TABLE users (id INT, name TEXT...);"
                    className="w-full min-h-[180px] p-4 bg-transparent resize-none outline-none text-xs font-mono text-slate-600 leading-normal placeholder:text-slate-300"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Schema is stored locally in your browser session.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  ),
);
EditorPanel.displayName = "EditorPanel";

// --- 3. Main Component ---
export default function GetSqlEditor({ isPro }: { isPro?: boolean }) {
  const { history, addToHistory, removeHistoryItem, setHistory } = useHistory();

  // Core State
  const [input, setInput] = useState("");
  const [schema, setSchema] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // UI State
  const [isSchemaOpen, setIsSchemaOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(true); // Default open on larger screens
  const [showLimitModal, setShowLimitModal] = useState(false);

  // Mobile UI State
  const [activeTab, setActiveTab] = useState<"editor" | "output" | "history">(
    "editor",
  );

  // --- Load Logic ---
  useEffect(() => {
    const savedSchema = localStorage.getItem("sql_active_schema");
    if (savedSchema) {
      setSchema(savedSchema);
      setIsSchemaOpen(false); // Keep closed initially for cleaner look
    }
    // Auto-collapse history on small screens
    const handleResize = () => {
      if (window.innerWidth < 1024) setShowHistory(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isPro) {
      fetch("/api/queries/get")
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          setHistory(
            data.map((item: any) => ({
              id: item.id,
              query: item.prompt,
              sql: item.sql,
              schema: item.sourceSchema,
              timestamp: new Date(item.created_at).getTime(),
            })),
          );
        })
        .catch(console.error);
    }
  }, [isPro, setHistory]);

  // --- Handlers ---
  const handleGenerate = async () => {
    if (!input.trim()) return;

    if (!schema.trim()) {
      setIsSchemaOpen(true);
      return;
    }

    setLoading(true);
    localStorage.setItem("sql_active_schema", schema);

    const combinedPrompt = `\n### SCHEMA:\n${schema}\n\n### REQUEST:\n${input}\n`;

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: combinedPrompt }),
      });

      if (!response.ok) throw new Error("Generation failed");
      const data = await response.json();

      if (isPro) {
        fetch("/api/queries/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: input, sql: data.response, schema }),
        }).catch(console.error);
        addToHistory(input, "GENERATE", data.response, schema);
      } else {
        if (history.length < GUEST_LIMIT) {
          addToHistory(input, data.response, schema);
        } else {
          setShowLimitModal(true);
        }
      }

      setOutput(data.response);
      setActiveTab("output");
      // Auto-open output on desktop
      if (window.innerWidth >= 768) {
        // Logic already handled by conditional rendering
      }
    } catch (error) {
      setOutput("-- Error: Ensure backend is running or check connection.");
      setActiveTab("output");
    } finally {
      setLoading(false);
    }
  };

  const loadSession = (item: any) => {
    setInput(item.query);
    setOutput(item.sql);
    setSchema(item.schema || "");
    setIsSchemaOpen(!!item.schema);
    setActiveTab("editor");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- Render ---
  return (
    <div className="flex h-screen w-full bg-[#FAFAFA] text-slate-900 font-sans overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <nav className="hidden md:flex flex-col items-center py-6 w-20 bg-white border-r border-slate-200 z-30 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="mb-8">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Code2 className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="flex flex-col gap-6 w-full px-4">
          <Tooltip text="New Query">
            <button
              onClick={() => {
                setInput("");
                setSchema("");
                setOutput("");
                setActiveTab("editor");
              }}
              className="p-3 bg-indigo-50 text-indigo-600 rounded-xl transition-all duration-300 w-full flex justify-center hover:scale-105 active:scale-95 border border-indigo-100"
            >
              <Zap className="w-5 h-5" />
            </button>
          </Tooltip>
          <Tooltip text="History">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-3 rounded-xl transition-all duration-300 w-full flex justify-center ${
                showHistory
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              <History className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>
        <div className="mt-auto px-4 w-full space-y-4">
          <div className="w-full h-px bg-slate-100"></div>
          <Tooltip text="Logout">
            <button
              onClick={() => (window.location.href = "/auth/logout")}
              className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all w-full flex justify-center"
            >
              <Lock className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>
      </nav>

      {/* ================= HISTORY DRAWER (DESKTOP) ================= */}
      <AnimatePresence>
        {showHistory && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="hidden md:block h-full shrink-0 border-r border-slate-200 z-20 overflow-hidden bg-white shadow-xl shadow-slate-200/50"
          >
            <HistoryList
              history={history}
              loadSession={loadSession}
              removeHistoryItem={removeHistoryItem}
              isPro={isPro}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ================= MAIN AREA ================= */}
      <main className="flex-1 flex flex-col md:flex-row relative z-10 overflow-hidden bg-[#F8FAFC]">
        {/* --- LEFT PANE (Editor) --- */}
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-500 relative">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-100/50 blur-[120px]" />
          </div>

          {/* Mobile Header */}
          <div className="md:hidden h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-4 justify-between shrink-0 sticky top-0 z-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/10">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-800 tracking-tight">
                GETSQL
              </span>
            </div>
            <div
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${isPro ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-slate-100 text-slate-500 border-slate-200"}`}
            >
              {isPro ? "PRO" : "GUEST"}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 custom-scrollbar pb-24 md:pb-0">
            <AnimatePresence mode="wait">
              {activeTab === "editor" && (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col"
                >
                  <EditorPanel
                    input={input}
                    setInput={setInput}
                    schema={schema}
                    setSchema={setSchema}
                    isSchemaOpen={isSchemaOpen}
                    setIsSchemaOpen={setIsSchemaOpen}
                    handleGenerate={handleGenerate}
                    loading={loading}
                  />
                </motion.div>
              )}
              {activeTab === "history" && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="h-full bg-white"
                >
                  <HistoryList
                    history={history}
                    loadSession={loadSession}
                    removeHistoryItem={removeHistoryItem}
                    isPro={isPro}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* --- RIGHT PANE (Output) - "The Terminal" --- */}
        <AnimatePresence>
          {output && (window.innerWidth >= 768 || activeTab === "output") && (
            <motion.div
              initial={
                window.innerWidth >= 768
                  ? { width: 0, opacity: 0 }
                  : { y: "100%" }
              }
              animate={
                window.innerWidth >= 768
                  ? { width: "45%", opacity: 1 }
                  : { y: 0 }
              }
              exit={
                window.innerWidth >= 768
                  ? { width: 0, opacity: 0 }
                  : { y: "100%" }
              }
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`
                fixed inset-0 top-16 md:top-0 md:static bg-[#1E1E1E] flex flex-col 
                md:border-l border-slate-800 shadow-2xl z-40 
                ${activeTab === "output" ? "block" : "hidden md:flex"}
              `}
            >
              {/* Terminal Header */}
              <div className="h-14 shrink-0 border-b border-white/10 flex items-center justify-between px-6 bg-[#1E1E1E] select-none">
                <div className="flex items-center gap-4">
                  {/* Mac-style Window Controls */}
                  <div className="flex gap-2 group">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 group-hover:bg-red-500 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80 group-hover:bg-amber-500 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80 group-hover:bg-emerald-500 transition-colors" />
                  </div>
                  <div className="h-4 w-px bg-white/10 mx-2" />
                  <div className="flex items-center gap-2 text-slate-400">
                    <Terminal className="w-4 h-4" />
                    <span className="text-xs font-mono font-medium tracking-wide">
                      result.sql
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyCode}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${copied ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"}`}
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                  <button
                    onClick={() => {
                      setOutput("");
                      setActiveTab("editor");
                    }}
                    className="md:hidden p-2 text-slate-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Terminal Body */}
              <div className="flex-1 relative overflow-hidden bg-[#1E1E1E]">
                <div className="absolute inset-0 overflow-auto custom-scrollbar p-6">
                  <SyntaxHighlighter
                    language="sql"
                    style={atomDark}
                    customStyle={{
                      background: "transparent",
                      padding: 0,
                      margin: 0,
                      fontSize: "0.95rem",
                      lineHeight: "1.7",
                      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                    }}
                    showLineNumbers={true}
                    wrapLines={true}
                    lineNumberStyle={{
                      minWidth: "2.5em",
                      paddingRight: "1.5em",
                      color: "#4B5563",
                      textAlign: "right",
                    }}
                  >
                    {output}
                  </SyntaxHighlighter>
                </div>
              </div>

              {/* Terminal Footer */}
              <div className="h-10 shrink-0 bg-[#171717] border-t border-white/5 flex items-center px-6 text-[11px] text-slate-500 font-mono gap-6">
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />{" "}
                  Ready
                </span>
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" /> 0.34s
                </span>
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" /> PostgreSQL
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ================= MOBILE NAVIGATION (Bottom Bar) ================= */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-slate-900/90 backdrop-blur-xl border border-white/10 z-50 rounded-2xl shadow-2xl shadow-slate-900/30">
        <div className="flex items-center justify-between px-6 py-3">
          <button
            onClick={() => setActiveTab("editor")}
            className={`relative p-2 transition-all duration-300 ${activeTab === "editor" ? "text-white scale-110" : "text-slate-400 hover:text-slate-200"}`}
          >
            <Code2 className="w-6 h-6" />
            {activeTab === "editor" && (
              <motion.div
                layoutId="nav-dot"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"
              />
            )}
          </button>

          {/* Floating Output Indicator */}
          <div className="relative">
            <button
              onClick={() => setActiveTab("output")}
              disabled={!output}
              className={`relative p-2 transition-all duration-300 ${activeTab === "output" ? "text-white scale-110" : "text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed"}`}
            >
              <Terminal className="w-6 h-6" />
              {output && activeTab !== "output" && (
                <span className="absolute top-2 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
              )}
              {activeTab === "output" && (
                <motion.div
                  layoutId="nav-dot"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                />
              )}
            </button>
          </div>

          <button
            onClick={() => setActiveTab("history")}
            className={`relative p-2 transition-all duration-300 ${activeTab === "history" ? "text-white scale-110" : "text-slate-400 hover:text-slate-200"}`}
          >
            <History className="w-6 h-6" />
            {activeTab === "history" && (
              <motion.div
                layoutId="nav-dot"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"
              />
            )}
          </button>
        </div>
      </div>

      {/* ================= LIMIT MODAL ================= */}
      <AnimatePresence>
        {showLimitModal && !isPro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowLimitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative overflow-hidden border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-indigo-500 to-purple-600" />
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 mx-auto rotate-3">
                <Lock className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">
                Free limit reached
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 text-center">
                You've used your {GUEST_LIMIT} free queries. Upgrade to Pro for
                unlimited SQL generation and history.
              </p>
              <button
                onClick={() => (window.location.href = "/auth/signin")}
                className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20 active:scale-95"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => setShowLimitModal(false)}
                className="w-full mt-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
              >
                Maybe Later
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.4);
        }
      `}</style>
    </div>
  );
}
