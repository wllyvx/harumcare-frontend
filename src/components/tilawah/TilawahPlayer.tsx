/**
 * Tilawah Audio Player Component
 * A lightweight, floating Quran audio player using React
 */

import React, { useRef, useEffect, useState } from "react";
import {
  Headphones,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
} from "lucide-react";
import { useTilawahState } from "./useTilawahState";
import type { Surah, Ayah } from "./types";

const API_BASE = "/api/tilawah";

export function TilawahPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    state,
    setIsOpen,
    setIsPlaying,
    setIsLoading,
    setError,
    setSurahs,
    setCurrentAyahs,
    setCurrentSurahIndex,
    setCurrentAyatIndex,
    setCurrentTime,
    setDuration,
  } = useTilawahState();

  const [showSurahDropdown, setShowSurahDropdown] = useState(false);

  // Fetch surahs on first FAB click
  const fetchSurahs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/surahs.json`);
      if (!response.ok) throw new Error("Failed to fetch surahs");
      const data = await response.json();
      setSurahs(data.data || data);
      setIsLoading(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setError(errorMsg);
      setIsLoading(false);
      if (typeof window !== "undefined" && (window as any).showToast) {
        (window as any).showToast(
          `Failed to load surahs: ${errorMsg}`,
          "error"
        );
      }
    }
  };

  // Fetch ayahs for current surah
  const fetchAyahs = async (surahNumber: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/${surahNumber}.json`);
      if (!response.ok) throw new Error("Failed to fetch ayahs");
      const data = await response.json();
      const ayahs = data.data?.ayat || data.ayat || [];
      setCurrentAyahs(ayahs);
      // Only reset ayat index if it's out of bounds
      if (state.currentAyatIndex >= ayahs.length) {
        setCurrentAyatIndex(0);
      }
      setIsLoading(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setError(errorMsg);
      setIsLoading(false);
      if (typeof window !== "undefined" && (window as any).showToast) {
        (window as any).showToast(
          `Failed to load ayahs: ${errorMsg}`,
          "error"
        );
      }
    }
  };

  // Handle FAB click - different behavior based on player state
  const handleFabClick = async () => {
    // Load surahs on first interaction if not loaded
    if (state.surahs.length === 0) {
      await fetchSurahs();
    }

    if (!state.isOpen) {
      // When closed, toggle play/pause
      if (state.isPlaying) {
        handlePause();
      } else {
        await handlePlay();
      }
    } else {
      // When open, close the player (keep audio playing)
      handleClose();
    }
  };

  // Play current ayat
  const handlePlay = async () => {
    if (state.currentAyahs.length === 0) {
      const surahNumber = state.currentSurahIndex + 1;
      await fetchAyahs(surahNumber);
    }

    const currentAyat = state.currentAyahs[state.currentAyatIndex];
    if (!currentAyat || !audioRef.current) return;

    const audioUrl = currentAyat.audio["01"] || Object.values(currentAyat.audio)[0];
    if (audioRef.current.src !== audioUrl) {
      audioRef.current.src = audioUrl;
    }

    audioRef.current.play().catch(() => {
      if (typeof window !== "undefined" && (window as any).showToast) {
        (window as any).showToast("Failed to play audio", "error");
      }
    });
    setIsPlaying(true);
  };

  // Pause audio
  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  // Next ayat
  const handleNext = async () => {
    const nextAyatIndex = state.currentAyatIndex + 1;
    if (nextAyatIndex < state.currentAyahs.length) {
      setCurrentAyatIndex(nextAyatIndex);
      if (state.isPlaying) {
        setTimeout(() => handlePlay(), 0);
      }
    } else {
      // Move to next surah
      if (state.currentSurahIndex + 1 < state.surahs.length) {
        setCurrentSurahIndex(state.currentSurahIndex + 1);
        await fetchAyahs(state.currentSurahIndex + 2);
        if (state.isPlaying) {
          setTimeout(() => handlePlay(), 0);
        }
      }
    }
  };

  // Previous ayat
  const handlePrev = async () => {
    if (state.currentAyatIndex > 0) {
      setCurrentAyatIndex(state.currentAyatIndex - 1);
      if (state.isPlaying) {
        setTimeout(() => handlePlay(), 0);
      }
    } else {
      // Move to previous surah
      if (state.currentSurahIndex > 0) {
        const prevSurahIndex = state.currentSurahIndex - 1;
        setCurrentSurahIndex(prevSurahIndex);
        await fetchAyahs(prevSurahIndex + 1);
        if (state.currentAyahs.length > 0) {
          setCurrentAyatIndex(state.currentAyahs.length - 1);
          if (state.isPlaying) {
            setTimeout(() => handlePlay(), 0);
          }
        }
      }
    }
  };

  // Handle close - keep audio playing in background
  const handleClose = () => {
    setIsOpen(false);
    setShowSurahDropdown(false);
  };

  // Change surah
  const handleSurahChange = async (newIndex: number) => {
    setCurrentSurahIndex(newIndex);
    await fetchAyahs(newIndex + 1);
    setShowSurahDropdown(false);
  };

  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Update progress
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Update duration
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Auto-play next ayat when current ends
  const handleAudioEnded = () => {
    handleNext();
  };

  // Format time display (MM:SS)
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!state.isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.code === "Space") {
        e.preventDefault();
        if (state.isPlaying) {
          handlePause();
        } else {
          handlePlay();
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.isOpen, state.isPlaying, state.currentAyatIndex, state.currentSurahIndex, state.currentAyahs]);

  const currentSurah = state.surahs[state.currentSurahIndex];
  const currentAyat = state.currentAyahs[state.currentAyatIndex];

  return (
    <>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
      />

      {/* FAB - Floating Action Button */}
      <button
        onClick={handleFabClick}
        aria-label={state.isOpen ? "Close Tilawah player" : (state.isPlaying ? "Pause audio" : "Play audio")}
        title={state.isOpen ? "Close Quran audio player" : (state.isPlaying ? "Pause audio" : "Play audio")}
        className="fixed bottom-24 md:bottom-8 right-8 z-[60] w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
      >
        {state.isOpen ? (
          <Headphones size={24} className="text-white" />
        ) : state.isPlaying ? (
          <Pause size={24} className="text-white" />
        ) : (
          <Play size={24} className="text-white ml-1" />
        )}
      </button>

      {/* Expanded Player Card */}
      {state.isOpen && (
        <div className="fixed bottom-32 md:bottom-24 right-8 z-[60] w-80 bg-white rounded-xl shadow-2xl p-5 transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900">
                {currentSurah?.namaLatin || "Loading..."}
              </h3>
              <p className="text-xs text-gray-600">
                {currentAyat
                  ? `Ayat ${currentAyat.nomorAyat}`
                  : "Select surah"}
              </p>
            </div>
            <button
              onClick={handleClose}
              aria-label="Close player"
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <X size={18} className="text-gray-600" />
            </button>
          </div>

          {/* Surah Selector Dropdown */}
          <div className="mb-4 relative">
            <button
              onClick={() => setShowSurahDropdown(!showSurahDropdown)}
              className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors text-sm text-left focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label="Select surah"
            >
              <span className="text-gray-700 font-medium truncate">
                {currentSurah ? `${currentSurah.nomor}. ${currentSurah.namaLatin}` : "Select Surah"}
              </span>
              <ChevronDown
                size={16}
                className={`text-gray-600 transition-transform ${
                  showSurahDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {showSurahDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-[70]">
                {state.surahs.map((surah, index) => (
                  <button
                    key={surah.nomor}
                    onClick={() => handleSurahChange(index)}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      index === state.currentSurahIndex
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {surah.nomor}. {surah.namaLatin}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Arabic Text */}
          {currentAyat && (
            <div className="mb-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <p className="text-right text-lg text-emerald-900 leading-loose font-arabic">
                {currentAyat.teksArab}
              </p>
              <p className="text-xs text-gray-600 mt-2 italic">
                {currentAyat.teksLatin}
              </p>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-3">
            <input
              type="range"
              min="0"
              max={state.duration || 0}
              value={state.currentTime}
              onChange={handleSeek}
              aria-label="Seek audio progress"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between items-center mt-2 text-xs text-gray-600">
              <span>{formatTime(state.currentTime)}</span>
              <span>{formatTime(state.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handlePrev}
              aria-label="Previous ayat"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>

            <button
              onClick={state.isPlaying ? handlePause : handlePlay}
              aria-label={state.isPlaying ? "Pause" : "Play"}
              className="p-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
            >
              {state.isPlaying ? (
                <Pause size={24} />
              ) : (
                <Play size={24} className="ml-1" />
              )}
            </button>

            <button
              onClick={handleNext}
              aria-label="Next ayat"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>
          </div>

          {/* Loading/Error States */}
          {state.isLoading && (
            <p className="text-center text-xs text-gray-500 mt-3">Loading...</p>
          )}
          {state.error && (
            <p className="text-center text-xs text-red-600 mt-3">{state.error}</p>
          )}

          {/* Keyboard Shortcuts Hint */}
          <p className="text-center text-xs text-gray-400 mt-3">
            Space: Play/Pause | ←/→: Previous/Next | Esc: Close
          </p>
        </div>
      )}
    </>
  );
}
