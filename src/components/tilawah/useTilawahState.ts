/**
 * Custom hook for managing Tilawah player state with localStorage persistence
 */

import { useState, useEffect, useCallback } from "react";
import type { TilawahState, Surah, Ayah } from "./types";

const STORAGE_KEYS = {
  SURAH_INDEX: "tilawah_surah_index",
  AYAT_INDEX: "tilawah_ayat_index",
  IS_PLAYING: "tilawah_is_playing",
};

export function useTilawahState() {
  // Initialize state from localStorage or defaults
  const [state, setState] = useState<TilawahState>({
    isOpen: false,
    isPlaying: false,
    isLoading: false,
    error: null,
    surahs: [],
    currentSurahIndex: 0,
    currentAyatIndex: 0,
    currentAyahs: [],
    currentTime: 0,
    duration: 0,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedSurahIndex = localStorage.getItem(STORAGE_KEYS.SURAH_INDEX);
    const savedAyatIndex = localStorage.getItem(STORAGE_KEYS.AYAT_INDEX);

    setState((prev) => ({
      ...prev,
      currentSurahIndex: savedSurahIndex ? parseInt(savedSurahIndex, 10) : 0,
      currentAyatIndex: savedAyatIndex ? parseInt(savedAyatIndex, 10) : 0,
    }));
  }, []);

  // Save surah/ayat indices to localStorage whenever they change
  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem(
      STORAGE_KEYS.SURAH_INDEX,
      state.currentSurahIndex.toString()
    );
    localStorage.setItem(
      STORAGE_KEYS.AYAT_INDEX,
      state.currentAyatIndex.toString()
    );
  }, [state.currentSurahIndex, state.currentAyatIndex]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEYS.SURAH_INDEX && event.newValue) {
        setState((prev) => ({
          ...prev,
          currentSurahIndex: parseInt(event.newValue!, 10),
        }));
      }
      if (event.key === STORAGE_KEYS.AYAT_INDEX && event.newValue) {
        setState((prev) => ({
          ...prev,
          currentAyatIndex: parseInt(event.newValue!, 10),
        }));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const setIsOpen = useCallback((isOpen: boolean) => {
    setState((prev) => ({ ...prev, isOpen }));
  }, []);

  const setIsPlaying = useCallback((isPlaying: boolean) => {
    setState((prev) => ({ ...prev, isPlaying }));
  }, []);

  const setIsLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const setSurahs = useCallback((surahs: Surah[]) => {
    setState((prev) => ({ ...prev, surahs }));
  }, []);

  const setCurrentAyahs = useCallback((ayahs: Ayah[]) => {
    setState((prev) => ({ ...prev, currentAyahs: ayahs }));
  }, []);

  const setCurrentSurahIndex = useCallback((index: number) => {
    setState((prev) => ({ ...prev, currentSurahIndex: index, currentAyatIndex: 0 }));
  }, []);

  const setCurrentAyatIndex = useCallback((index: number) => {
    setState((prev) => ({ ...prev, currentAyatIndex: index }));
  }, []);

  const setCurrentTime = useCallback((time: number) => {
    setState((prev) => ({ ...prev, currentTime: time }));
  }, []);

  const setDuration = useCallback((duration: number) => {
    setState((prev) => ({ ...prev, duration }));
  }, []);

  return {
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
  };
}
