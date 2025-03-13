import { ApiPokemon } from "@/fetchPokemon";

export type PokemonForCard = {
  id: number;
  name: string;
  exp: number;
  imgUrl: string;
};

export const mapPokemonToCardData = (pokemon: ApiPokemon): PokemonForCard => ({
  id: pokemon.id,
  name: capitalizeFirstLetter(pokemon.name),
  exp: pokemon.base_experience,
  imgUrl: pokemon.sprites.front_default ?? "https://via.placeholder.com/150",
});

const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
