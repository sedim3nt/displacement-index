"use client";
import { useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import { Compass, Loader2, Map } from "lucide-react";

export default function SaferPaths({ slug, title }: { slug: string; title: string }) {
  const [open, setOpen] = useState(false);

  const { completion, isLoading, complete } = useCompletion({
    api: "/api/adjacent",
  });

  const handleClick = () => {
    if (!open && !completion) {
      setOpen(true);
      complete("", { body: { slug } });
    } else {
      setOpen(!open);
    }
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <button
        onClick={handleClick}
        disabled={isLoading}
        style={{
          width: "100%",
          padding: "16px 24px",
          borderRadius: 16,
          background: open ? "rgba(139,92,246,0.06)" : "#111",
          border: open ? "1px solid rgba(139,92,246,0.25)" : "1px solid #222",
          color: "#FFF",
          cursor: isLoading ? "default" : "pointer",
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 14,
          fontWeight: 600,
          textAlign: "left",
          transition: "all 200ms ease",
        }}
      >
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "rgba(139,92,246,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {isLoading ? (
            <Loader2 size={18} color="#8B5CF6" style={{ animation: "spin 1s linear infinite" }} />
          ) : (
            <Map size={18} color="#8B5CF6" />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            {isLoading ? "Finding safer career paths…" : "Find Safer Paths"}
          </div>
          <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
            AI-powered adjacent career analysis for {title}
          </div>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "5px 12px", borderRadius: 100,
          background: "rgba(139,92,246,0.1)",
          border: "1px solid rgba(139,92,246,0.25)",
        }}>
          <Compass size={12} color="#8B5CF6" />
          <span style={{ fontSize: 11, fontWeight: 600, color: "#8B5CF6" }}>Career Geographer</span>
        </div>
      </button>

      {open && (completion || isLoading) && (
        <div className="purple-card" style={{ padding: 24, marginTop: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Compass size={16} color="#8B5CF6" />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#8B5CF6", letterSpacing: "0.04em" }}>
              SAFER ADJACENT CAREERS
            </span>
          </div>
          {completion ? (
            <div style={{ fontSize: 14, color: "#ABABAB", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
              {completion}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "#555" }}>Analyzing skill adjacency and displacement risk…</div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
