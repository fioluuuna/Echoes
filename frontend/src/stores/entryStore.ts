import { create } from 'zustand';
import type { Entry, CreateEntryResponse } from '../types';

interface EntryState {
  currentEntry: Entry | null;
  currentResult: CreateEntryResponse | null;
  entries: Entry[];
  isLoading: boolean;
  draftEmotion: string | null;
  setCurrentEntry: (entry: Entry | null) => void;
  setCurrentResult: (result: CreateEntryResponse | null) => void;
  setEntries: (entries: Entry[]) => void;
  setLoading: (loading: boolean) => void;
  setDraftEmotion: (emotion: string | null) => void;
}

export const useEntryStore = create<EntryState>((set) => ({
  currentEntry: null,
  currentResult: null,
  entries: [],
  isLoading: false,
  draftEmotion: null,

  setCurrentEntry: (entry) => set({ currentEntry: entry }),
  setCurrentResult: (result) => set({ currentResult: result }),
  setEntries: (entries) => set({ entries }),
  setLoading: (loading) => set({ isLoading: loading }),
  setDraftEmotion: (emotion) => set({ draftEmotion: emotion }),
}));
