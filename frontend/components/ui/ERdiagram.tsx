"use client";
import { useState } from "react";
import Diagram from "./Diagram";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
function SQLtoER() {
  const [sqlInput, setSqlInput] = useState(""); // State for the textarea
  const [erData, setErData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        setErData(data);
        setError(null);
      } catch {
        setError(null);
      }
    };

    reader.readAsText(file);

    // allow re-importing same file
    e.target.value = "";
  };

  const exportPDF = async () => {
    const node = document.getElementById("diagram-container");
    if (!node) return;

    const img = await toPng(node, { pixelRatio: 3 });

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [node.clientWidth, node.clientHeight],
    });

    pdf.addImage(img, "PNG", 0, 0, node.clientWidth, node.clientHeight);

    pdf.save("er-diagram.pdf");
  };

  const exportPNG = async () => {
    const node = document.getElementById("diagram-container");
    if (!node) return;

    const dataUrl = await toPng(node, {
      pixelRatio: 3,
    });

    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "er-diagram.png";
    a.click();
  };

  const exportSVG = () => {
    const svg = document.querySelector("#diagram-container svg");

    if (!svg) {
      alert("SVG diagram not found.");
      return;
    }

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);

    const blob = new Blob([source], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "er-diagram.svg";
    a.click();

    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    if (!erData) return;

    const blob = new Blob([JSON.stringify(erData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "er-diagram.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleGenerateDiagram = async () => {
    if (!sqlInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/structure_sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // The backend expects { "sql_ddl": "string" }
        body: JSON.stringify({ sql_ddl: sqlInput }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();
      // result matches your SQLStructureResponse model
      setErData(result.conceptual_er_model);
    } catch (err: any) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">SQL to ER Diagram</h2>

      <div className="flex flex-col gap-4 mb-8">
        <textarea
          className="w-full h-48 p-4 border rounded-md font-mono text-sm bg-slate-50 text-black"
          placeholder="Paste your CREATE TABLE statements here..."
          value={sqlInput}
          onChange={(e) => setSqlInput(e.target.value)}
        />

        <button
          onClick={handleGenerateDiagram}
          disabled={loading || !sqlInput}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? "Processing..." : "Generate Diagram"}
        </button>
      </div>
      <div className="flex gap-3 mb-4">
        <label className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
          Import JSON
          <input
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            className="hidden"
          />
        </label>

        <button
          onClick={exportJSON}
          disabled={!erData}
          className="px-4 py-2 bg-gray-700 text-white rounded"
        >
          Export JSON
        </button>

        <button
          onClick={exportSVG}
          disabled={!erData}
          className="px-4 py-2 bg-purple-600 text-white rounded"
        >
          Export SVG
        </button>

        <button
          onClick={exportPNG}
          disabled={!erData}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Export PNG
        </button>

        <button
          onClick={exportPDF}
          disabled={!erData}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Export PDF
        </button>
      </div>
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md border border-red-200">
          Error: {error}
        </div>
      )}

      {/* Rendering Section */}
      <div
        id="diagram-container"
        className="border rounded-xl bg-white min-h-[500px] overflow-hidden shadow-inner"
      >
        {erData ? (
          <Diagram data={erData} />
        ) : (
          <div className="flex items-center justify-center h-[500px] text-gray-400 italic">
            {loading
              ? "AI is generating the schema structure..."
              : "Diagram will appear here"}
          </div>
        )}
      </div>
    </div>
  );
}

export default SQLtoER;
