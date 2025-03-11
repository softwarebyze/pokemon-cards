import axios from "axios";

// types from https://github.com/monbrey/pokeapi-typescript/blob/master/src/interfaces/Pokemon/Pokemon.ts

export type PokemonSprites = {
  back_default: string;
  back_female: string;
  back_shiny: string;
  back_shiny_female: string;
  front_default: string;
  front_female: string;
  front_shiny: string;
  front_shiny_female: string;
  // other: PokemonSpriteOther;
  // versions: PokemonSpriteVersion;
};

export type Pokemon = {
  base_experience: number;
  height: number;
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  name: string;
  order: number;
  sprites: PokemonSprites;
  weight: number;
  // abilities: PokemonAbility[];
  // forms: NamedApiResource<PokemonForm>[];
  // game_indices: VersionGameIndex[];
  // held_items: PokemonHeldItem[];
  // moves: PokemonMove[];
  // past_types: PokemonTypePast[];
  // species: NamedApiResource<PokemonSpecies>;
  // stats: PokemonStat[];
  // types: PokemonType[];
};

export const fetchPokemonById = async (id: number) => {
  const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
  console.log({ res });
  return res.data as Pokemon;
};

export const fetchPokemonInRange = async (start: number, end: number) => {
  const promises = [];

  for (let id = start; id <= end; id++) {
    promises.push(fetchPokemonById(id));
  }

  const results = (await Promise.allSettled(promises))
    .map((r) => (r.status === "fulfilled" ? r.value : undefined))
    .filter((r) => Boolean(r));
  console.log("results", results);
  return results;
};
