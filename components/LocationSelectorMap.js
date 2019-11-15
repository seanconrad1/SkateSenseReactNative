import React, { Component } from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { Button } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import markerIcon from '../assets/markerIcon.png';

console.disableYellowBox = true;

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height,
    width,
    position: 'absolute',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

class LocationSelectorMap extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.getUserLocationHandler();
  }

  onRegionChange = region => {
    this.setState({ region });
  };

  selectLocation = () => {
    // this.props.navigation.goBack('yo', )
    this.props.navigation.navigate('NewSpotPage', { selectedLocation: this.state.region });
  };
  getUserLocationHandler = () => {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        userLocation: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.115,
          longitudeDelta: 0.1121,
        },
        geoLocationSwitch: true,
      });
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={styles.map}
          showsUserLocation
          initialRegion={this.state.userLocation}
          onRegionChange={this.onRegionChange}
        />

        <View>
          <Image
            source={markerIcon}
            style={{
              position: 'absolute',
              marginTop: hp('43%'),
              marginLeft: wp('43%'),
              width: 50,
              height: 50,
            }}
          />
        </View>

        <View style={{ position: 'absolute', top: '85%', left: '0%', justifyContent: 'center' }}>
          <Button
            title="Submit Location"
            buttonStyle={{ width, height: 80, backgroundColor: 'rgb(244, 2, 87)' }}
            onPress={this.selectLocation}
          />
        </View>
      </View>
    );
  }
}

// top:'631%',
// left:'46%'

export default withNavigation(LocationSelectorMap);
