import { create } from 'zustand';
import { MatchReport } from '../types/jdMatch.types';

interface JDMatchState {
  currentReport: MatchReport | null;
  setCurrentReport: (report: MatchReport | null) => void;
  reset: () => void;
}

export const useJDMatchStore = create<JDMatchState>((set) => ({
  currentReport: null,
  setCurrentReport: (report) => set({ currentReport: report }),
  reset: () => set({ currentReport: null }),
}));
