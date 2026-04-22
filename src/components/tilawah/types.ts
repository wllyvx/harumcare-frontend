/**
 * TypeScript types for Tilawah Audio Player
 */

export interface Ayah {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksInggris: string;
  audio: Record<string, string>; // e.g., {"01": "url1", "02": "url2", ...}
}

export interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  ayat?: Ayah[];
}

export interface TilawahState {
  isOpen: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  surahs: Surah[];
  currentSurahIndex: number;
  currentAyatIndex: number;
  currentAyahs: Ayah[];
  currentTime: number;
  duration: number;
}

export interface TilawahPlayerProps {
  defaultSurahNumber?: number;
  defaultAyatNumber?: number;
}
