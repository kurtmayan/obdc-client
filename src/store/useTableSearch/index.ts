import { create } from "zustand"

type State = {
  query: string
  hasNoResult: Record<string, boolean>
}

type Action = {
  setQuery: (query: string) => void
  reset: () => void
  setHasNoResult: (key: string, value: boolean) => void
  resetHasNoResult: () => void
}

export const useTableSearch = create<State & Action>((set) => ({
  query: "",
  setQuery: (query) => set(() => ({ query })),
  reset: () =>
    set({
      query: "",
      hasNoResult: {},
    }),
  hasNoResult: {},
  setHasNoResult: (key, value) =>
    set((state) => ({
      hasNoResult: {
        ...state.hasNoResult,
        [key]: value,
      },
    })),
  resetHasNoResult: () => set(() => ({ hasNoResult: {} })),
}))
