import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableHighlight, ScrollView, PropTypes} from 'react-native'
import { NavigationActions, withNavigation  } from 'react-navigation'
import { Icon } from 'react-native-elements'

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
                       <Text>{ 'TESTING' }</Text>
                       <View >
                           <TouchableHighlight onPress={ this.navigateToScreen('Map') }>
                               <View style={styles.uglyDrawerItem}>
                                   <Icon
                                       name="globe"
                                       type="font-awesome"
                                       backgroundColor="transparent"
                                       color= 'blue'
                                       size={ 30 }
                                   />
                                   <Text>Map</Text>
                               </View>
                           </TouchableHighlight>

                           <TouchableHighlight onPress={ this.navigateToScreen('Map2') }>
                               <View style={styles.uglyDrawerItem}>
                                   <Icon
                                       name="globe"
                                       type="font-awesome"
                                       backgroundColor="transparent"
                                       color= 'grey'
                                       size={ 30 }
                                   />
                                   <Text>Map2</Text>
                               </View>
                           </TouchableHighlight>

                           <TouchableHighlight onPress={ this.navigateToScreen('My Spots') }>
                               <View style={styles.uglyDrawerItem}>
                                   <Icon
                                       name="bookmark"
                                       type="font-awesome"
                                       backgroundColor="transparent"
                                       color= 'red'
                                       size={ 30 }
                                   />
                                   <Text>My Spots</Text>
                               </View>
                           </TouchableHighlight>

                           <TouchableHighlight onPress={ this.navigateToScreen('Settings') }>
                               <View style={styles.uglyDrawerItem}>
                                   <Icon
                                       name="wrench"
                                       type="font-awesome"
                                       backgroundColor="transparent"
                                       color= 'black'
                                       size={ 30 }
                                   />
                                   <Text>Settings</Text>
                               </View>
                           </TouchableHighlight>

                           <TouchableHighlight onPress={ this.onPressLogout }>
                               <View style={styles.uglyDrawerItem}>
                                   <Icon
                                       name="door"
                                       type="font-awesome"
                                       backgroundColor="transparent"
                                       color='orange'
                                       size={ 30 }
                                   />
                                   <Text>Logout</Text>
                               </View>
                           </TouchableHighlight>
                       </View>
                   </View>
               </ScrollView>
           </View>
       );
   }
 }

// SideMenu.propTypes = {
//      navigation: PropTypes.object,
// }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    paddingTop: 40,
    paddingHorizontal: 20
  },
  uglyDrawerItem: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E73536',
    padding: 15,
    margin: 5,
    borderRadius: 2,
    borderColor: '#E73536',
    borderWidth: 1,
    textAlign: 'center'
  },
  navSectionStyle: {

  }
})

export default withNavigation(SideMenu)
