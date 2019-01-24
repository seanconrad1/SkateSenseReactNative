import React, { Component } from 'react';
import { Text, View, YellowBox } from 'react-native'
import Login from './components/AuthPage'
import Map from './components/Map'
import SignUp from './components/SignUp'
import BookmarksContainer from './components/BookmarksContainer'
import SpotPage from './components/SpotPage'
import MySpots from './components/MySpots'
import Settings from './components/Settings'
import { createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation'; // Version can be specified in package.json

console.disableYellowBox = true;

const RootStack = createStackNavigator(
  {
    Login: {screen: Login},
    SignUp: {screen: SignUp},
  },
  {
    headerMode: 'none',
    navigationOptions: {
    headerVisible: false,
  }
  },
  {
    initialRouteName: 'Login',
  }
)

const DrawerStack = createDrawerNavigator(
    {
      Map: {screen: Map},
      'My Spots': {screen: MySpots},
      BookmarksContainer: { screen: BookmarksContainer },
      Settings: {screen: Settings},
      Logout: {screen: Login},
    },
    {
      initialRouteName: 'Logout',
    }
)

const PrimaryNav = createStackNavigator(
  {
  RootStack: { screen: RootStack },
  DrawerStack: { screen: DrawerStack }
  },
  {
  // Default config for all screens
  headerMode: 'none',
  title: 'Main',
  initialRouteName: 'DrawerStack'
})


const AppContainer = createAppContainer(PrimaryNav)

export default class App extends Component {
  render(){
    return <AppContainer/>
  }
}
