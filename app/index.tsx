import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
interface PokemonType {
  type: {
    name: string;
    url: string;
  }
}

interface Pokemon {
  name: string;
  image: string;
  imageBack: string;
  types: PokemonType[];
}


export default function Index() {
  const POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon/?limit=20';
  const [pokemons, setPokemons] = useState<Pokemon[]>([])

  async function fetchPokemons() {
    try {
      const response = await fetch(POKEMON_URL);

      const data = await response.json();

      // Fetch detailted info for each pokemon in parellel
      const detailedPokemons = await Promise.all(
        data?.results?.map(async (pokemon: any) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();

          return {
            name: pokemon.name,
            image: details.sprites.front_default,
            imageBack: details.sprites.back_default,
            types: details.types
          }
        })
      )

      setPokemons(detailedPokemons);
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
          <Text style={styles.name}>{pokemon.name}</Text>
          <Text style={styles.type}>{pokemon.types[0].type.name}</Text>
          <View style={{
            flexDirection: "row"
          }}>
            <Image
              source={{ uri: pokemon.image }}
              alt={pokemon.name}
              style={{ width: 150, height: 150 }}
            />
            <Image
              source={{ uri: pokemon.imageBack }}
              alt={pokemon.name}
              style={{ width: 150, height: 150 }}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontWeight: 'bold'
  },
  type: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "gray"
  },

})
