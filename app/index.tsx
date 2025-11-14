import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

interface Pokemon {
  name: string;
  url: string;
}

export default function Index() {
  const POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon/?limit=20';
  const [pokemons, setPokemons] = useState<Pokemon[]>([])

  async function fetchPokemons() {
    try {
      const response = await fetch(POKEMON_URL);

      const data = await response.json();

      setPokemons(data?.results);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    // Fetch Pokemons
    fetchPokemons();
  }, []);


  return (
    <ScrollView>
      {pokemons?.map((pokemon: Pokemon) => (
        <View key={pokemon.name}>
          <Text>{pokemon.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
