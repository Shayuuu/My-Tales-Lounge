"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Bookmark, BookmarkCheck, Sun, Moon, Coffee, Maximize, Minimize, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEndStoryMagic, EndStoryMagicMessage } from "./end-story-magic";
import { JournalPrompt } from "./journal-prompt";
import { useAuth } from "./auth/auth-provider";
import { createClient } from "@/lib/supabase-client";

type Story = {
  id: string;
  title: string;
  pdf_url: string;
  author_name: string | null;
};

type ChapterMeta = {
  id?: string;
  title: string;
  page_start: number;
  page_end: number;
};

type Theme = "night" | "sepia" | "light";

export function BookReader({
  story,
  initialPage = 0,
  chapters = [],
}: {
  story: Story;
  initialPage?: number;
  chapters?: ChapterMeta[];
}) {
  const router = useRouter();
  const bookRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>("night");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [bookmarked, setBookmarked] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showMagicOverride, setShowMagicOverride] = useState(false);
  const [showJournalPrompt, setShowJournalPrompt] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [showGoodbye, setShowGoodbye] = useState(false);
  const { user } = useAuth();
  const supabase = createClient();
  
  // Always call the hook; handle single-page case via page count
  const showMagicAuto = useEndStoryMagic(
    currentPage,
    Math.max(pages.length, 1),
    true
  );
  const showMagic = showMagicOverride || (pages.length > 1 && showMagicAuto);

  // Load PDF and convert to images
  useEffect(() => {
    let mounted = true;

    async function loadPDF() {
      try {
        // Dynamically import pdfjs-dist
        const pdfjsLib = await import("pdfjs-dist");
        
        // Set worker source - use jsdelivr CDN with correct version
        if (typeof window !== "undefined") {
          // Use the actual installed version
          const version = pdfjsLib.version || "4.10.38";
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
        }

        // Handle both absolute URLs and relative paths
        let pdfUrl = story.pdf_url;
        if (pdfUrl.startsWith("/")) {
          pdfUrl = window.location.origin + pdfUrl;
        }

        const loadingTask = pdfjsLib.getDocument({
          url: pdfUrl,
          httpHeaders: {},
          withCredentials: false,
          verbosity: 0, // Reduce console noise
        });
        
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;

        const pageImages: string[] = [];
        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2.0 });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) {
            throw new Error("Could not get canvas context");
          }
          
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;

          pageImages.push(canvas.toDataURL("image/png"));
        }

        if (mounted) {
          setPages(pageImages);
          setLoading(false);
          const savedBookmark = localStorage.getItem(`bookmark-${story.id}`);
          const savedLast = localStorage.getItem(`last-page-${story.id}`);
          const startFrom =
            typeof initialPage === "number" ? initialPage : undefined;
          const resolved =
            startFrom ??
            (savedBookmark ? parseInt(savedBookmark) : savedLast ? parseInt(savedLast) : 0);
          if (savedBookmark) setBookmarked(true);
          setCurrentPage(Math.min(resolved || 0, pageImages.length - 1));
        }
      } catch (error: any) {
        console.error("Error loading PDF:", error);
        console.error("PDF URL:", story.pdf_url);
        console.error("Error name:", error?.name);
        console.error("Error message:", error?.message);
        setLoading(false);
        
        // Show user-friendly error
        alert(`Failed to load PDF: ${error?.message || "Unknown error"}. Please check the browser console for details.`);
      }
    }

    loadPDF();

    return () => {
      mounted = false;
    };
  }, [story.pdf_url]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isFlipping) return;

      if (e.key === "ArrowLeft" && currentPage > 0) {
        flipPage(-1);
      } else if (e.key === "ArrowRight" && currentPage < pages.length - 1) {
        flipPage(1);
      } else if (e.key === "Escape") {
        router.back();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPage, pages.length, router, isFlipping]);

  // Touch/swipe support
  useEffect(() => {
    if (!bookRef.current) return;

    let startX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isFlipping) return;

      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;

      if (Math.abs(diffX) > 50) {
        if (diffX > 0 && currentPage < pages.length - 1) {
          flipPage(1);
        } else if (diffX < 0 && currentPage > 0) {
          flipPage(-1);
        }
      }
    };

    bookRef.current.addEventListener("touchstart", handleTouchStart);
    bookRef.current.addEventListener("touchend", handleTouchEnd);

    return () => {
      if (bookRef.current) {
        bookRef.current.removeEventListener("touchstart", handleTouchStart);
        bookRef.current.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [currentPage, pages.length, isFlipping]);

  const flipPage = async (direction: number) => {
    if (isFlipping) return;
    setIsFlipping(true);
    
    setTimeout(() => {
      setCurrentPage((prev) => {
        const newPage = prev + direction;
        const finalPage = Math.max(0, Math.min(pages.length - 1, newPage));
        
        // Save reading progress
        if (user && pages.length > 0) {
          const progress = ((finalPage + 1) / pages.length) * 100;
          supabase.from("reading_progress").upsert({
            user_id: user.id,
            story_id: story.id,
            progress_percent: progress,
            last_page: finalPage,
            updated_at: new Date().toISOString(),
          });
        }
        
        return finalPage;
      });
      setIsFlipping(false);
    }, 300);
  };

  // Persist last read page for auto-resume
  useEffect(() => {
    if (pages.length > 0) {
      localStorage.setItem(`last-page-${story.id}`, currentPage.toString());
    }

    if (chapters.length > 0) {
      const ch = chapters.find(
        (c) => currentPage >= c.page_start && currentPage <= c.page_end
      );
      if (ch) {
        localStorage.setItem(`last-chapter-${story.id}`, ch.id || `${ch.page_start}`);
        localStorage.setItem(
          `chapter-progress-${story.id}-${ch.id || ch.page_start}`,
          (currentPage - ch.page_start).toString()
        );
      }
    }
  }, [currentPage, pages.length, story.id]);

  const toggleBookmark = () => {
    if (bookmarked) {
      localStorage.removeItem(`bookmark-${story.id}`);
      setBookmarked(false);
    } else {
      localStorage.setItem(`bookmark-${story.id}`, currentPage.toString());
      setBookmarked(true);
    }
  };

  const toggleFullscreen = () => {
    const el: any = bookRef.current || document.documentElement;
    const requestFs =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen;
    const exitFs =
      document.exitFullscreen ||
      (document as any).webkitExitFullscreen ||
      (document as any).mozCancelFullScreen ||
      (document as any).msExitFullscreen;

    if (!document.fullscreenElement && requestFs) {
      requestFs.call(el);
      setIsFullscreen(true);
    } else if (exitFs) {
      exitFs.call(document);
      setIsFullscreen(false);
    }
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.max(0.5, Math.min(2, prev + delta)));
  };

  const progress =
    pages.length > 0 ? ((currentPage + 1) / pages.length) * 100 : 0;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const showDoublePage = false; // force single-page view

  // Exit fullscreen on Escape
  useEffect(() => {
    const exitFs =
      document.exitFullscreen ||
      (document as any).webkitExitFullscreen ||
      (document as any).mozCancelFullScreen ||
      (document as any).msExitFullscreen;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && document.fullscreenElement && exitFs) {
        exitFs.call(document);
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const themeClasses = {
    night: "bg-black text-neutral-200",
    sepia: "bg-amber-50 text-amber-900",
    light: "bg-white text-gray-900",
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-lounge-accent mx-auto"></div>
          <p className="text-lounge-accent text-lg">Loading your book...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 ${themeClasses[theme]} z-50 overflow-hidden`}>
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowMagicOverride(false);
              setShowGoodbye(true);
              setTimeout(() => router.back(), 1400);
            }}
            className="text-lounge-accent"
          >
            <X size={20} />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">{story.title}</h2>
            <p className="text-xs text-neutral-400">
              by {story.author_name || "Unknown"}
            </p>
          </div>
        </div>

        {!isMobile && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBookmark}
              className={bookmarked ? "text-lounge-accent" : ""}
            >
              {bookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentPage(0);
                localStorage.setItem(`last-page-${story.id}`, "0");
                if (user && pages.length > 0) {
                  const progress = pages.length > 0 ? (1 / pages.length) * 100 : 0;
                  supabase.from("reading_progress").upsert({
                    user_id: user.id,
                    story_id: story.id,
                    progress_percent: progress,
                    last_page: 0,
                    updated_at: new Date().toISOString(),
                  });
                }
              }}
              className="text-sm"
            >
              Restart
            </Button>

            <div className="flex items-center gap-1 bg-black/30 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme("night")}
                className={theme === "night" ? "bg-lounge-accent/20" : ""}
              >
                <Moon size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme("sepia")}
                className={theme === "sepia" ? "bg-lounge-accent/20" : ""}
              >
                <Coffee size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme("light")}
                className={theme === "light" ? "bg-lounge-accent/20" : ""}
              >
                <Sun size={16} />
              </Button>
            </div>

            <Button variant="ghost" size="sm" onClick={() => handleZoom(-0.1)}>
              <ZoomOut size={20} />
            </Button>
            <span className="text-sm text-neutral-400 min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button variant="ghost" size="sm" onClick={() => handleZoom(0.1)}>
              <ZoomIn size={20} />
            </Button>

            <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </Button>

            {chapters.length > 0 && (
              <select
                className="bg-black/40 border border-white/10 rounded-md text-sm px-2 py-1 text-neutral-200"
                defaultValue=""
                onChange={(e) => {
                  const target = parseInt(e.target.value, 10);
                  if (!isNaN(target)) {
                    setCurrentPage(Math.min(target, pages.length - 1));
                  }
                }}
              >
                <option value="" disabled>
                  Jump to chapter
                </option>
                {chapters.map((c) => (
                  <option key={c.id || c.page_start} value={c.page_start}>
                    {c.title} (p. {c.page_start + 1})
                  </option>
                ))}
              </select>
            )}

            {chapters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTocOpen((p) => !p)}
                className="ml-1"
              >
                TOC
              </Button>
            )}
          </div>
        )}

        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMenuOpen(true)}
            className="bg-black/40 border border-white/10"
          >
            <Menu size={20} />
          </Button>
        )}
      </div>

      {/* Mobile side drawer */}
      {isMobile && menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 z-50 w-64 bg-black/85 border-l border-white/10 p-4 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-neutral-200">Reader Controls</h3>
              <Button variant="ghost" size="sm" onClick={() => setMenuOpen(false)}>
                <X size={18} />
              </Button>
            </div>
            <div className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setCurrentPage(0);
                  localStorage.setItem(`last-page-${story.id}`, "0");
                  if (user && pages.length > 0) {
                    const progress = pages.length > 0 ? (1 / pages.length) * 100 : 0;
                    supabase.from("reading_progress").upsert({
                      user_id: user.id,
                      story_id: story.id,
                      progress_percent: progress,
                      last_page: 0,
                      updated_at: new Date().toISOString(),
                    });
                  }
                  setMenuOpen(false);
                }}
              >
                Restart
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={bookmarked ? "text-lounge-accent w-full justify-start" : "w-full justify-start"}
                onClick={() => {
                  toggleBookmark();
                  setMenuOpen(false);
                }}
              >
                {bookmarked ? <BookmarkCheck size={18} className="mr-2" /> : <Bookmark size={18} className="mr-2" />}
                {bookmarked ? "Bookmarked" : "Bookmark"}
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex-1 ${theme === "night" ? "bg-lounge-accent/20" : ""}`}
                  onClick={() => setTheme("night")}
                >
                  <Moon size={16} className="mr-2" />
                  Night
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex-1 ${theme === "sepia" ? "bg-lounge-accent/20" : ""}`}
                  onClick={() => setTheme("sepia")}
                >
                  <Coffee size={16} className="mr-2" />
                  Sepia
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex-1 ${theme === "light" ? "bg-lounge-accent/20" : ""}`}
                  onClick={() => setTheme("light")}
                >
                  <Sun size={16} className="mr-2" />
                  Light
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => handleZoom(-0.1)}>
                  <ZoomOut size={18} />
                </Button>
                <span className="text-sm text-neutral-300">{Math.round(zoom * 100)}%</span>
                <Button variant="ghost" size="sm" onClick={() => handleZoom(0.1)}>
                  <ZoomIn size={18} />
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="w-full justify-start">
                {isFullscreen ? (
                  <>
                    <Minimize size={18} className="mr-2" /> Exit Fullscreen
                  </>
                ) : (
                  <>
                    <Maximize size={18} className="mr-2" /> Fullscreen
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-red-200"
                onClick={() => {
                  setShowMagicOverride(false);
                  setShowGoodbye(true);
                  setMenuOpen(false);
                  setTimeout(() => router.back(), 1400);
                }}
              >
                <X size={16} className="mr-2" /> Close
              </Button>
            </div>
          </div>
        </>
      )}

      {/* TOC sidebar */}
      {chapters.length > 0 && (
        <div
          className={`absolute top-0 bottom-0 right-0 w-72 bg-black/70 backdrop-blur-sm border-l border-white/10 z-20 transform transition-transform duration-200 ${
            tocOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-100">Table of Contents</h3>
            <Button variant="ghost" size="sm" onClick={() => setTocOpen(false)}>
              <X size={16} />
            </Button>
          </div>
          <div className="p-3 space-y-2 overflow-y-auto h-[calc(100%-56px)]">
            {chapters.map((c) => {
              const active = currentPage >= c.page_start && currentPage <= c.page_end;
              const progressKey = `chapter-progress-${story.id}-${c.id || c.page_start}`;
              const saved = parseInt(localStorage.getItem(progressKey) || "0", 10);
              const pct =
                saved > 0 && c.page_end > c.page_start
                  ? Math.min(100, Math.round((saved / (c.page_end - c.page_start + 1)) * 100))
                  : active
                  ? Math.round(
                      ((currentPage - c.page_start) /
                        Math.max(1, c.page_end - c.page_start + 1)) *
                        100
                    )
                  : 0;
              return (
                <button
                  key={c.id || c.page_start}
                  onClick={() => {
                    setCurrentPage(Math.min(c.page_start, pages.length - 1));
                    setTocOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg border ${
                    active ? "border-lounge-accent/60 bg-lounge-accent/10" : "border-white/5 bg-white/5"
                  }`}
                >
                  <p className="text-sm text-neutral-100">
                    {c.title}
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    Pages {c.page_start + 1}–{c.page_end + 1}
                  </p>
                  <div className="w-full h-1.5 bg-white/10 rounded-full mt-1">
                    <div
                      className="h-1.5 rounded-full bg-lounge-accent"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Book Container */}
      <div className="flex items-center justify-center h-full pt-16 pb-20 px-2 sm:pt-20 sm:pb-24 sm:px-4">
        <div
          ref={bookRef}
          className="book-viewer w-full max-w-6xl"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center",
            maxWidth: isMobile ? "100%" : "900px",
            width: "100%",
          }}
          onClick={(e) => {
            if (isFlipping) return;
            const rect = bookRef.current?.getBoundingClientRect();
            if (!rect) return;
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const leftZone = width * 0.3;
            const rightZone = width * 0.7;

            if (clickX < leftZone && currentPage > 0) {
              flipPage(-1);
            } else if (clickX > rightZone && currentPage < pages.length - 1) {
              flipPage(1);
            }
          }}
        >
              <div className={`book-pages ${isFlipping ? "flipping" : ""}`}>
            {showDoublePage ? (
              <div className="double-page">
                <div className="page left-page">
                      <img src={pages[currentPage]} alt={`Page ${currentPage + 1}`} className="w-full h-auto object-contain" />
                </div>
                <div className="page right-page">
                      <img src={pages[currentPage + 1]} alt={`Page ${currentPage + 2}`} className="w-full h-auto object-contain" />
                </div>
              </div>
            ) : (
              <div className="single-page">
                    <img src={pages[currentPage]} alt={`Page ${currentPage + 1}`} className="w-full h-auto object-contain" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => flipPage(-1)}
        disabled={currentPage === 0 || isFlipping}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={24} className="text-lounge-accent" />
      </button>
      <button
        onClick={() => flipPage(1)}
        disabled={currentPage >= pages.length - 1 || isFlipping}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={24} className="text-lounge-accent" />
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-neutral-400">
            Page {currentPage + 1} of {pages.length}
          </span>
          <span className="text-sm text-neutral-400">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-black/30 rounded-full h-2">
          <div
            className="bg-lounge-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <EndStoryMagicMessage show={showMagic} />
      {showGoodbye && (
        <div className="fixed inset-0 z-[101] bg-black/80 backdrop-blur-sm flex items-center justify-center text-center">
          <div className="space-y-2">
            <p className="text-2xl font-sacramento text-lounge-accent">
              Thank you for visiting tonight 🕯️
            </p>
            <p className="text-sm text-neutral-300">Come back soon for another cozy tale.</p>
          </div>
        </div>
      )}
      {showJournalPrompt && (
        <JournalPrompt
          storyId={story.id}
          onClose={() => {
            setShowJournalPrompt(false);
            router.back();
          }}
        />
      )}
    </div>
  );
}
