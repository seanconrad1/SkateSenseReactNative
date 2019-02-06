import React, { Component } from 'react';
import { Text,
         View,
         YellowBox,
         SafeAreaView,
          } from 'react-native'
import Login from './components/Login'
import Map from './components/Map'
import SignUp from './components/SignUp'
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
import Map3 from './components/Map3'
import SideMenu from './components/SideMenu.js'
import NewSpotPage from './components/NewSpotPage.js'
import LocationSelectorMap from './components/LocationSelectorMap.js'
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
      drawerLockMode:'locked-closed'
    }
  },
)

const Drawer = createStackNavigator(
  {
    Map: {screen: Map},
    'My Spots': {screen: MySpots},
    Settings: {screen: Settings},
    SpotPage: {screen: SpotPage},
    NewSpotPage: {screen: NewSpotPage},
    LocationSelectorMap: {screen: LocationSelectorMap},
    AdminConsole:{screen: AdminConsole}
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  },
  {
    initialRouteName: 'Map',
  }
)


const HomeNavigationDrawer = createDrawerNavigator({
    RootStack: {screen: RootStack},
    Drawer: {screen: Drawer},
}, {
    contentComponent: SideMenu,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    drawerWidth: 250,
});


const PrimaryNav = createStackNavigator(
  {
    HomeNavigationDrawer: { screen: HomeNavigationDrawer }
  },
  {
  // Default config for all screens
  headerMode: 'none',
  title: 'Main',
  initialRouteName: 'HomeNavigationDrawer',
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
