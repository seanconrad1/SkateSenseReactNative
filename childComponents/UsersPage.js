import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Header, ListItem } from 'react-native-elements';
// import Icon from 'react-native-vector-icons/FontAwesome';
import { withNavigation } from 'react-navigation';
import environment from '../environment.js';
import deviceStorage from '../deviceStorage.js';

const styles = StyleSheet.create({
  container: {
    textDecorationColor: 'black',
    color: 'black',
    flex: 1,
    backgroundColor: 'white',
    resizeMode: 'stretch',
  },
});

class UsersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const fetchUsers = key => {
      fetch(`http://${environment.BASE_URL}/api/v1/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${key}`,
        },
      })
        .then(r => r.json())
        .then(data => this.setState({ users: data }));
    };
    deviceStorage.loadJWT('jwt').then(key => fetchUsers(key));
  }

  toCommentsPage = item => {
    console.log('going to users page', item);
  };

  deleteAlert = user => {
    Alert.alert(
      'Deleting user',
      'Are you sure you want to delete this user?',
      [
        { text: 'Yes', onPress: () => this.deleteUser(user) },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };

  deleteUser = user => {
    function fetchToDeleteUser(key, userID) {
      fetch(`http://${environment.BASE_URL}/api/v1/users/${userID}`, {
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
    deviceStorage.loadJWT('jwt').then(key => fetchToDeleteUser(key, user.id));

    this.setState({
      users: this.state.users.filter(oneUser => oneUser.id !== user.id),
    });
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
            text: `Users`,
            style: { color: 'black', fontSize: 25 },
          }}
          backgroundColor="white"
          containerStyle={{
            fontFamily: 'Lobster',
            justifyContent: 'space-around',
          }}
        />

        <ScrollView>
          {this.state.users
            ? this.state.users.map((user, i) => (
                <View key={i}>
                  <ListItem
                    title={user.username}
                    onPress={() => this.props.navigation.navigate('CommentsPage', { user })}
                    onLongPress={() => this.deleteAlert(user)}
                  />
                </View>
              ))
            : null}
        </ScrollView>
      </View>
    );
  }
}

export default withNavigation(UsersPage);
