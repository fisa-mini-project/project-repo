import { create } from 'zustand'

export const useSummaryStore = create((set) => ({
  summary: null,
  isLoading: false,
  openModal: false,
  setSummary: (summary) => set({ summary }),
  setIsLoading: (val) => set({ isLoading: val }),
  setOpenModal: (val) => set({ openModal: val }), // setModalOpen → setOpenModal로 변경
}))
