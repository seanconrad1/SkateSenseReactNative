import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableHighlight, ScrollView, PropTypes} from 'react-native'
import { NavigationActions, withNavigation  } from 'react-navigation'
import { Icon, Button, Divider, ListItem } from 'react-native-elements'
import deviceStorage from '../deviceStorage.js'
import { logoutUser } from '../action.js'
import { connect } from 'react-redux'
import { compose } from 'redux'

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
]


class SideMenu extends Component {

   navigateToScreen = (route) => () => {
       let navigateAction = NavigationActions.navigate({
           routeName: route,
       });

       this.props.navigation.dispatch(navigateAction);
   }

   logOut = () =>{
       deviceStorage.removeJWT('jwt')
       this.props.logoutUser()
       this.props.navigation.navigate('Login')
     }

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
                        <ListItem
                          title='Logout'
                          leftIcon={{name:'sign-out', type: 'font-awesome'}}
                          onPress={this.logOut}
                          />
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

function mapStateToProps(state) {
  return {
    // user: state.user,
    loggedIn: state.user.loggedIn
  }
}


function mapDispatchToProps(dispatch) {
    return {
      logoutUser: () => dispatch(logoutUser())
    }
}


const connectMap = connect(mapStateToProps, mapDispatchToProps)

export default withNavigation(compose(connectMap)(SideMenu))
