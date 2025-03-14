import axios from "axios";

// types from https://github.com/monbrey/pokeapi-typescript/blob/master/src/interfaces/Pokemon/Pokemon.ts

export type PokemonSprites = {
  front_default: string;
};

export type ApiPokemon = {
  base_experience: number;
  height: number;
  id: number;
  is_default: boolean;
  name: string;
  order: number;
  sprites: PokemonSprites;
};

export const fetchPokemonById = async (id: number) => {
  const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return res.data as ApiPokemon;
};

export const fetchPokemonInRange = async (start: number, end: number) => {
  const results = await Promise.allSettled(
    Array.from({ length: end - start + 1 }, (_, i) =>
      fetchPokemonById(start + i)
    )
  );

  return results
    .filter((r) => r.status === "fulfilled")
    .map((r) => (r as PromiseFulfilledResult<ApiPokemon>).value);
};
