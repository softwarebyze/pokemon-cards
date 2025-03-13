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
  addFavorite: (pokemon) => {
    console.log("addFavorite", pokemon.name);
    return set((state) => ({
      favorites: [...state.favorites, pokemon],
    }));
  },
  skipped: [],
  addSkipped: (pokemon) => {
    console.log("addSkipped", pokemon.name);
    return set((state) => ({
      skipped: [...state.skipped, pokemon],
    }));
  },
}));
