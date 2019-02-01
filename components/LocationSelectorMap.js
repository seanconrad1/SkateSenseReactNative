import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Image,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  TouchableHighlight
} from "react-native";
import MapView, {
      Callout,
      Overlay,
      MapCallout } from 'react-native-maps'
import { Header, ListItem, Avatar, Icon } from 'react-native-elements'
import ActionButton from 'react-native-action-button';
import { withNavigation } from 'react-navigation'
import environment from '../environment.js'

console.disableYellowBox = true;

let {height, width} = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }
})


class LocationSelectorMap extends Component {
  constructor(props) {
    super(props)
  }

  render(){
    return(
      <MapView
      style={styles.map}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      />
    )
  }
}

export default withNavigation(LocationSelectorMap)
