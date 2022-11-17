import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Pokemon from "./src/components/Pokemon";
import getRandomInt from "./src/helpers/getRandomInt";
import { View, Text, ActivityIndicator } from "react-native";
import { ApolloProvider, Query } from "react-apollo";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
export const AppContext = React.createContext({ data: { pokemon: null } });
const client = new ApolloClient({
  uri: "192.168.1.5:4000/graphql",
});
const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu",
});

export default class App extends Component {
  state = {
    query: null,
  };
  componentDidMount() {
    const query = this.getQuery();
    this.setState({
      query,
    });
  }
  getQuery = () => {
    const randomID = getRandomInt(1, 807);
    return `
        query GetPokemonById {
          pokemon(id: ${randomID}) {
            id,
            name,
            desc,
            pic,
            types {
              id,
              name
            }
          }
        }
      `;
  };
  onGetNewPokemon = () => {
    const query = this.getQuery();
    this.setState({
      query,
    });
  };
  render() {
    const { query } = this.state;
    if (!query) return null;

    return (
      <ApolloProvider client={client}>
        <Query
          query={gql`
            ${query}
          `}
        >
          {({ loading, error, data }) => {
            if (loading || error)
              return <ActivityIndicator size="large" color="#0000ff" />;
            return (
              <AppContext.Provider
                value={{ ...data.pokemon, onPress: this.onGetNewPokemon }}
                style={styles.container}
              >
                <Pokemon />
              </AppContext.Provider>
            );
          }}
        </Query>
      </ApolloProvider>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
});
