import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { NavigationActions, withNavigation } from 'react-navigation';
import { Divider, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { compose } from 'redux';
import deviceStorage from '../deviceStorage.js';
import { logoutUser } from '../action.js';

const list = [
  {
    name: 'Map',
    icon: 'globe',
    type: 'font-awesome',
  },
  {
    name: 'My Spots',
    type: 'font-awesome',
    icon: 'bookmark',
  },
  // {
  //   name: 'Settings',
  //   type: 'font-awesome',
  //   icon: 'wrench',
  // },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    paddingTop: 40,
  },
  uglyDrawerItem: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E73536',
    width: '100%',
    borderColor: '#E73536',
    textAlign: 'center',
  },
});

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
    };
  }

  // componentWillMount(){
  //   if (this.props.user.user.username !== null) {
  //     this.setState({user:this.props.user.user.username})
  //   }
  // }

  navigateToScreen = route => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });

    this.props.navigation.dispatch(navigateAction);
  };

  logOut = () => {
    // debugger
    deviceStorage
      .removeJWT('jwt')
      .then(() => this.props.logoutUser())
      .then(() => this.props.navigation.navigate('Login'));
  };

  approvals = () => {
    if (
      this.props.user.user.username === 'seanrad' ||
      this.props.user.user.username === 'zackrosebrugh' ||
      this.props.user.user.username === 'p0intBlankk'
    ) {
      return (
        <ListItem
          title="Approvals"
          leftIcon={{ name: 'check', type: 'font-awesome' }}
          onPress={() => this.props.navigation.navigate('Approvals')}
        />
      );
    }
  };

  administration = () => {
    if (this.props.user.user.username === 'seanrad') {
      return (
        <ListItem
          title="Administration"
          leftIcon={{ name: 'gear', type: 'font-awesome' }}
          onPress={() => this.props.navigation.navigate('AdminConsole')}
        />
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text
          style={{
            fontFamily: 'Lobster',
            justifyContent: 'space-around',
            color: 'black',
            fontSize: 40,
            alignSelf: 'center',
            marginBottom: 20,
          }}
        >
          SkateSense
        </Text>

        <ScrollView>
          <Divider style={{ backgroundColor: 'grey', marginTop: 0 }} />
          <View>
            {list.map((item, i) => (
              <ListItem
                key={i}
                leftIcon={{ name: item.icon, type: item.type }}
                title={item.name}
                onPress={this.navigateToScreen(item.name)}
              />
            ))}
            <ListItem
              title="Logout"
              leftIcon={{ name: 'sign-out', type: 'font-awesome' }}
              onPress={this.logOut}
            />

            {this.props.user.user !== null ? this.approvals() : null}

            {this.props.user.user !== null ? this.administration() : null}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  loggedIn: state.user.loggedIn,
});

function mapDispatchToProps(dispatch) {
  return {
    logoutUser: () => dispatch(logoutUser()),
  };
}

const connectMap = connect(mapStateToProps, mapDispatchToProps);

export default withNavigation(compose(connectMap)(SideMenu));
