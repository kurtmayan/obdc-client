import type { ColumnFiltersState } from "@tanstack/react-table"
import { create } from "zustand"

interface FilterStore {
  columnFilters: ColumnFiltersState
  setFilter: (columnId: string, value: unknown) => void
  clearFilters: () => void
}
export const useFilterStore = create<FilterStore>((set) => ({
  columnFilters: [],

  setFilter: (columnId, value) =>
    set((state) => {
      const others = state.columnFilters.filter((f) => f.id !== columnId)
      return {
        columnFilters: value ? [...others, { id: columnId, value }] : others,
      }
    }),

  clearFilters: () => set({ columnFilters: [] }),
}))
