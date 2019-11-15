import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Header } from 'react-native-elements';
// import Icon from 'react-native-vector-icons/FontAwesome';
import { withNavigation } from 'react-navigation';

const styles = StyleSheet.create({
  container: {
    textDecorationColor: 'black',
    color: 'black',
    flex: 1,
    backgroundColor: 'white',
    resizeMode: 'stretch',
  },
});

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOn: false,
    };
  }

  toNightMode = value => {
    this.setState({ isOn: value });

    this.state.isOn
      ? (styles.container = {
          flex: 1,
          resizeMode: 'stretch',
          backgroundColor: 'white',
        })
      : (styles.container = {
          flex: 1,
          resizeMode: 'stretch',
          backgroundColor: 'grey',
        });

    console.log(styles.container);
  };

  render() {
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
            text: `Settings`,
            style: { color: 'black', fontSize: 25 },
          }}
          backgroundColor="white"
          containerStyle={{
            fontFamily: 'Lobster',
            justifyContent: 'space-around',
          }}
        />

        <ListItem
          containerStyle={styles.container}
          title="Dark Mode"
          switch={{
            value: this.state.isOn,
            onValueChange: value => this.toNightMode(value),
          }}
        />
      </View>
    );
  }
}

export default withNavigation(Settings);
