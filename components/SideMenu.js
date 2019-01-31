import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableHighlight, ScrollView, PropTypes} from 'react-native'
import { NavigationActions, withNavigation  } from 'react-navigation'
import { Icon, Button, Divider, ListItem } from 'react-native-elements'

const list = [
  {
    name: 'Map',
    icon: 'globe',
    type: 'font-awesome',
  },
  {
    name: 'Map2',
    type: 'font-awesome',
    icon: 'globe',
  },
  {
    name: 'My Spots',
    type: 'font-awesome',
    icon: 'bookmark',
  },
  {
    name: 'Settings',
    type: 'font-awesome',
    icon: 'wrench',
  },
  {
    name: 'Logout',
    type: 'font-awesome',
    icon: 'sign-out',

  },
]


class SideMenu extends Component {
   /**
    * Navigate between screens action
    */
   navigateToScreen = (route) => () => {
       let navigateAction = NavigationActions.navigate({
           routeName: route,
       });

       this.props.navigation.dispatch(navigateAction);
   }

   /**
    * Logout from firebase
    */
   onPressLogout = () => {
       // Firebase.logout();
       console.log('LOGOUT');
       this.navigateToScreen('Login')
   }

   /**
    * Render side menu
    */
   render () {
       return (
           <View style = { styles.container } >
               <ScrollView>
                   <View>
                       <Text>{ 'SkateSense' }</Text>
                       {
                          list.map((item, i) => (
                            <ListItem
                              key={i}
                              leftIcon={{ name: item.icon, type: item.type}}
                              title={item.name}
                              onPress={this.navigateToScreen(item.name)}
                            />
                          ))
                        }
                   </View>
               </ScrollView>
           </View>
       );
   }
 }




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    paddingTop: 40,
    paddingHorizontal: 20
  },
  uglyDrawerItem: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E73536',
    width: '100%',
    borderColor: '#E73536',
    textAlign: 'center'
  },
})

export default withNavigation(SideMenu)
