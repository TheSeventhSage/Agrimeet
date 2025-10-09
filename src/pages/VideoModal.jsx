import { useEffect, useRef } from "react";
import { X, Play } from "lucide-react"; // or replace with your own icons

/**
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - videoUrl: string (YouTube embed URL or video file URL)
 *  - title?: string
 */
export default function VideoModal({ open, onClose, videoUrl, title = "Watch Success Story" }) {
  const panelRef = useRef(null);

  // close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // trap initial focus
  useEffect(() => {
    if (open && panelRef.current) {
      const closeBtn = panelRef.current.querySelector("button[data-close]");
      closeBtn?.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    // overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      onClick={onClose} // clicking the overlay closes
    >
      {/* green gradient overlay with blur */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a]/90 via-green-800/80 to-[#000000]/85 backdrop-blur-sm"
        style={{ WebkitBackdropFilter: "blur(6px)" }}
      />

      {/* subtle decorative shapes that echo the hero */}
      <div className="absolute top-16 left-12 w-72 h-72 bg-white/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 right-12 w-64 h-64 bg-white/4 rounded-full blur-2xl pointer-events-none" />

      {/* modal panel */}
      <div
        ref={panelRef}
        className="relative z-10 w-[min(1100px,92%)] max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl transform transition-all"
        onClick={(e) => e.stopPropagation()} // prevent overlay click closing when clicking inside panel
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-green-800/90 to-green-700/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white text-lg font-bold">{title}</h3>
              <p className="text-green-100 text-sm">Hear how sellers scale with our platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              data-close
              onClick={onClose}
              aria-label="Close video modal"
              className="rounded-full p-2 bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Body: responsive video */}
        <div className="bg-gradient-to-br from-[green]/90 via-green-800/80 to-[#000000]/85 p-6 md:p-8">
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            {/* Use iframe for YouTube/Vimeo; <video> tag for MP4 */}
            {videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be") ? (
              <iframe
                title="Success story video"
                src={videoUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full rounded-xl border border-white/6 shadow-lg"
              />
            ) : (
              <video
                src={videoUrl}
                controls
                className="absolute inset-0 w-full h-full rounded-xl border border-white/6 shadow-lg bg-black"
              />
            )}
          </div>

          {/* optional transcript / actions */}
          <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="text-green-100 text-sm">
              <strong className="text-white">Tip:</strong> Turn on captions for accessibility.
            </div>

            <div className="flex items-center gap-3">
              <a
                href={videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                Open in new tab
              </a>
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
