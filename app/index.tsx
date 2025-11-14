import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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

const colorsByType = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD'
};


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
    <ScrollView
      contentContainerStyle={{
        gap: 16,
        padding: 16
      }}
    >
      {pokemons?.map((pokemon: Pokemon) => (
        <Link key={pokemon.name} href={{ pathname: '/details', params: { name: pokemon.name } }} style={{
          // @ts-ignore
          backgroundColor: colorsByType[pokemon.types[0].type.name] + 50,
          padding: 20,
          borderRadius: 20
        }}>

          <View >
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
        </Link>
      ))
      }
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  type: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "gray",
    textAlign: 'center'
  },

})
