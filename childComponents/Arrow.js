import React, {Component} from 'react'
import { View,
         Text,
         StyleSheet,
         Image,
         ScrollView,
         Linking,
         TouchableOpacity,
         Switch,
         Alert} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import environment from '../environment.js'
import { withNavigation } from 'react-navigation'
import deviceStorage from '../deviceStorage.js'


const arrowPullDown = () => {
  return <TouchableOpacity style={{width:'100%', alignItems:'center', marginTop: -10}}>
            <Icon
              name='chevron-down'
              />
          </TouchableOpacity>
}



export default arrowPullDown
