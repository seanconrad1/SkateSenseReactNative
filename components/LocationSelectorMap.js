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
import { Header, ListItem, Avatar, Icon, Button } from 'react-native-elements'
import ActionButton from 'react-native-action-button';
import { withNavigation } from 'react-navigation'
import environment from '../environment.js'
import {widthPercentageToDP as wp,
        heightPercentageToDP as hp} from 'react-native-responsive-screen';

console.disableYellowBox = true;

let {height, width} = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex:1,
    height: height,
    width: width,
    position: 'absolute'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
})



class LocationSelectorMap extends Component {
  constructor(props) {
    super(props)
    this.state={
    }
  }

  selectLocation = () => {
    // this.props.navigation.goBack('yo', )
    this.props.navigation.navigate('NewSpotPage', {selectedLocation: this.state.region })
  }

  onRegionChange = (region) => {
    this.setState({ region })
  }

  componentDidMount(){
    this.getUserLocationHandler()
   }

  getUserLocationHandler = () => {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        userLocation:{
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.115,
          longitudeDelta: 0.1121,
        },
        geoLocationSwitch: true
      })
    })
  }

  render(){
    return(
      <View style={{flex:1}}>
        <MapView
        style={styles.map}
        showsUserLocation
        initialRegion={this.state.userLocation}
        onRegionChange={this.onRegionChange}
        />

        <View>
          <Text style={{
            position:'absolute',
            fontSize:50,
            marginTop:hp('47%'),
            marginLeft:wp('46%')}}>
            X
          </Text>
        </View>

        <View style={{position: 'absolute',
        top: '85%',
        left: '0%',
        justifyContent:'center'
          }}>
          <Button
          title="Submit Location"
          buttonStyle={{width:width, height:80, backgroundColor: "rgb(244, 2, 87)"}}
          onPress={this.selectLocation}
          />

        </View>
    </View>

    )
  }
}

// top:'631%',
// left:'46%'

export default withNavigation(LocationSelectorMap)
