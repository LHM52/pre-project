import { create } from 'zustand'
import type { Place } from '../@types/types'

interface FavoritesStore {
  favorites: Place[]
  addFavorite: (place: Place) => void
  removeFavorite: (id: string) => void
  setFavorites: (places: Place[]) => void // 추가
}

export const useFavorites = create<FavoritesStore>((set) => ({
  favorites: [],
  addFavorite: (place) =>
    set((state) => {
      const favorites = state.favorites ?? [];
      if (favorites.some((p) => p.id === place.id)) return state;
      return { favorites: [...favorites, place] };
    }),
  removeFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.filter((p) => p.id !== id),
    })),
  setFavorites: (places) => set({ favorites: places }), // 추가
}))
