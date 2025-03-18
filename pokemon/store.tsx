import { PokemonForCard } from "@/utils/mapPokemonToCardData";
import { create } from "zustand";

export type PokemonStore = {
  favorites: PokemonForCard[];
  addFavorite: (pokemon: PokemonForCard) => void;
  skipped: PokemonForCard[];
  addSkipped: (pokemon: PokemonForCard) => void;
};

export const usePokemonStore = create<PokemonStore>((set) => ({
  favorites: [],
  addFavorite: (pokemon) =>
    set((state) => ({
      favorites: [...state.favorites, pokemon],
    })),
  skipped: [],
  addSkipped: (pokemon) =>
    set((state) => ({
      skipped: [...state.skipped, pokemon],
    })),
}));
