import { useState } from "react";
import Markdown from "react-markdown";

const CreationItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // 🔽 Download handler
  const handleDownload = async (e, url) => {
    e.stopPropagation();

    if (downloading) return; // prevent multiple clicks

    try {
      setDownloading(true);

      const response = await fetch(url);
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `creation-${item._id}.png`;

      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDownloading(false);
    }
  };

  // 📋 Copy handler
  const handleCopy = async (e) => {
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(item.content);
      setCopied(true);
      
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer"
    >
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2>{item.prompt}</h2>
          <p className="text-gray-500">
            {item.type} - {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Type badge */}
          <button className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] py-1 px-4 rounded-full">
            {item.type}
          </button>

          {/* 📥 Download (only for images) */}
          {item.type === "image" && (
            <button
              onClick={(e) => handleDownload(e, item.content)}
              disabled={downloading}
              className={`py-1 px-3 rounded-full text-xs border ${
                downloading
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-purple-100 border-purple-300 text-purple-700"
              }`}
            >
              {downloading ? "Downloading..." : "Download"}
            </button>
          )}

          {/* 📋 Copy (only for non-images) */}
          {item.type !== "image" && (
            <button
              onClick={handleCopy}
              className="bg-green-100 border border-green-300 text-green-700 py-1 px-3 rounded-full text-xs"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {expanded && (
        <div>
          {item.type === "image" ? (
            <div>
              <img
                src={item.content}
                alt="creation content"
                className="mt-3 w-full max-w-md rounded-md"
              />
            </div>
          ) : (
            <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-700">
              <div className="reset-tw">
                <Markdown>{item.content}</Markdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItem;