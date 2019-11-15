import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Header, ListItem } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import deviceStorage from '../deviceStorage.js';
import environment from '../environment.js';

const styles = StyleSheet.create({
  container: {
    textDecorationColor: 'black',
    color: 'black',
    flex: 1,
    backgroundColor: 'white',
    resizeMode: 'stretch',
  },
});

class PostsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOn: false,
      posts: null,
    };
  }

  componentDidMount() {
    const fetchSpots = key => {
      fetch(`http://${environment.BASE_URL}/api/v1/skate_spots`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${key}`,
        },
      })
        .then(r => r.json())
        .then(data => this.setState({ spots: data }));
    };
    deviceStorage.loadJWT('jwt').then(key => fetchSpots(key));
  }

  deleteAlert = spot => {
    Alert.alert(
      'Deleting spot',
      'Are you sure you want to delete this spot?',
      [
        { text: 'Yes', onPress: () => this.deleteSpot(spot) },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };

  deleteSpot = spot => {
    function fetchToDeleteComment(key, spotID) {
      fetch(`http://${environment.BASE_URL}/api/v1/skate_spots/${spotID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${key}`,
        },
      })
        .then(r => r.json())
        .then(data => console.log(data));
    }

    deviceStorage.loadJWT('jwt').then(key => fetchToDeleteComment(key, spot.id));

    this.setState({
      spots: this.state.spots.filter(oneSpot => oneSpot.id !== spot.id),
    });
  };

  render() {
    console.log(this.state.spots);
    return (
      <View style={styles.container}>
        <Header
          leftComponent={{
            icon: 'menu',
            color: 'black',
            onPress: () => this.props.navigation.openDrawer(),
          }}
          centerComponent={{
            fontFamily: 'Lobster',
            text: `All Posts`,
            style: { color: 'black', fontSize: 25 },
          }}
          backgroundColor="white"
          containerStyle={{
            fontFamily: 'Lobster',
            justifyContent: 'space-around',
          }}
        />

        <ScrollView>
          {this.state.spots
            ? this.state.spots.map((spot, i) => (
                <View key={i}>
                  <ListItem
                    title={spot.name}
                    onPress={() => this.props.navigation.navigate('SpotPage', { skatespot: spot })}
                    onLongPress={() => this.deleteAlert(spot)}
                    leftAvatar={{
                      source: { uri: `http://${environment.BASE_URL}${spot.avatars[0].url}` },
                    }}
                  />
                </View>
              ))
            : null}
        </ScrollView>
      </View>
    );
  }
}

export default withNavigation(PostsPage);
