import React, { Component } from 'react';
import { Text,
         View,
         YellowBox,
         SafeAreaView,
          } from 'react-native'
import Login from './components/AuthPage'
import Map from './components/Map'
import SignUp from './components/SignUp'
import BookmarksContainer from './components/BookmarksContainer'
import SpotPage from './components/SpotPage'
import MySpots from './components/MySpots'
import Settings from './components/Settings'
import { createStackNavigator,
         createAppContainer,
         createDrawerNavigator,
         DrawerItems } from 'react-navigation'; // Version can be specified in package.json
import { Provider } from 'react-redux';
import store from './store'
import { Button } from 'react-native-elements'
import Map2 from './components/Map2'
import AdminConsole from './components/AdminConsole'

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
  initialRouteName: 'DrawerStack',
  gesturesEnabled: false
})


const AppContainer = createAppContainer(PrimaryNav)

class App extends Component {

  render(){
    return (
      <Provider store={ store }>
        <AppContainer/>
      </Provider>
     )
  }
}

export default App
