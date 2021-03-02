import React from "react";
import { StyleSheet, Text, View, Image} from "react-native";
import { Card, Button } from "react-native-elements";
import Deck from "./src/Deck";
import { data } from './data';

export default class App extends React.Component {
  renderCard(item) {
    return ( 
      <View style={styles.card}>     
        <Text style={styles.textStyle}>{item.desc}</Text>
        <Image style={styles.image} source={{ uri: item.uri }} />
        <Text style={styles.cardText}>{item.text}</Text>
      </View>

    );
  }

  renderNoMoreCards() {
    return (
      <Card title="All Done!">
        <Text style={{ marginBottom: 10 }}>There is no more content here!</Text>
      </Card>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logoImage} source={require('./assets/mi3.png')}/>
        <Deck
          data={data}
          renderCard={this.renderCard}
          renderNoMoreCards={this.renderNoMoreCards}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 400,
    borderRadius: 4,
    marginBottom: 10,
  },
  logoImage: {
    width: 250,
    height: 50,
    marginTop: 70,
    marginBottom: 30,
    marginLeft:'auto',
    marginRight: 'auto',
  },
  card: {
    borderRadius: 20,
    backgroundColor: '#FFF',
    padding: 10
  },
  container: {
    flex: 1,
    backgroundColor: "#CCC",
  },
  cardText: {
    marginLeft:'auto',
    marginRight: 'auto',
    fontSize: 20
  },
  textStyle: {
    marginLeft:'auto',
    marginRight: 'auto',
    marginBottom: 20,
    fontSize: 20
  }
});
