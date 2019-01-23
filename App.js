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
    BookmarksContainer: { screen: BookmarksContainer },
    SpotPage: {screen: SpotPage},
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
      'My Submitted Spots': {screen: MySpots},
      Settings: {screen: Settings},
      Logout: {screen: Login}
    },
    {
      initialRouteName: 'Logout',
    }
)


const drawerNavigation = createStackNavigator(
    {
      DrawerStack : {screen: DrawerStack}
    },
    {
      headerMode: 'none',
      navigationOptions: {
      headerVisible: false,
    }
  }
)


const PrimaryNav = createStackNavigator(
  {
  RootStack: { screen: RootStack },
  drawerNavigation: { screen: drawerNavigation }
  },
  {
  // Default config for all screens
  headerMode: 'none',
  title: 'Main',
  initialRouteName: 'drawerNavigation'
})


const AppContainer = createAppContainer(PrimaryNav)

export default class App extends Component {
  render(){
    return <AppContainer/>
  }
}
