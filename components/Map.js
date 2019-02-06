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
  TouchableHighlight,
  Linking
} from "react-native";
import MapView, {
      Callout,
      Overlay,
      MapCallout } from 'react-native-maps'
import { Header, ListItem, Avatar, Icon } from 'react-native-elements'
// import Icon from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button';
import NewMarkerInfoBoxForm from '../childComponents/newMarkerInfoBoxForm.js'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { fetchKeyForSkateSpots } from '../action.js'
import { withNavigation, DrawerActions } from 'react-navigation'
import environment from '../environment.js'
import deviceStorage from '../deviceStorage.js'
import BookmarkButton from '../childComponents/BookmarkButton'

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 2.5;
const CARD_WIDTH = CARD_HEIGHT + 25;

class Map extends Component {
  state = {
    region: {
      latitudeDelta: 0.04864195044303443,
      longitudeDelta: 0.040142817690068,
    }
  }

  UNSAFE_componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }


  componentDidMount() {
    console.log('GETTING HERE FIRST');
    this.getUserLocationHandler()
    this.props.getSkateSpots()

    this.animation.addListener(({ value }) => {
      debugger
      let index = Math.floor(value / CARD_WIDTH + .3); // animate 30% away from landing on the next item
      if (index >= this.props.user.skate_spots.length) {
        index = this.props.user.skate_spots.length - 1;
      }
      if (index <= 0) {
        index = 0
      }
    })

  }

  refreshMarkers = (marker) =>{
    console.log('GETTING NEW SPOTS')
    this.props.getSkateSpots()
  }

  getUserLocationHandler = () => {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        region:{
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.115,
          longitudeDelta: 0.1121,
        },
        geoLocationSwitch: true
      })
    })
  }

  sendingPropsTest = (marker) => {
    console.log('this IS MY TEST DATA SENIDNG AS PROPS----------------', marker)
    this.props.navigation.navigate('SpotPage', {skatespot: marker })
  }

  animateRegionChanges = () => {
    // We should detect when scrolling has stopped then animate
    // We should just debounce the event listener here


      clearTimeout(this.regionTimeout);
        this.regionTimeout = setTimeout(() => {
          if (this.index !== index) {
            this.index = index;
            const latitude = this.props.user.skate_spots[index].latitude
            const longitude = this.props.user.skate_spots[index].longitude
            console.log('MY LATITUDE', latitude);
            console.log('MY longitude', longitude);
            this.map.animateToRegion(
              {
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: this.state.region.latitudeDelta,
                longitudeDelta: this.state.region.longitudeDelta,
              },
              350
            );
          }
        }, 10);
      }


  render() {
    console.log('card width', CARD_WIDTH);
    const interpolations =
    this.props.user.skate_spots
    ?( this.props.user.skate_spots.map((marker, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        ((index + 1) * CARD_WIDTH),
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 3, 1],
        extrapolate: "clamp",
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: "clamp",
      });
      return { scale, opacity };
    }))
    : null

    return (
      <View style={styles.container}>
        <MapView
          showsUserLocation
          ref={map => this.map = map}
          initialRegion={this.state.region}
          style={{flex: 1}}
          region={this.state.region}
          showsMyLocationButton={true}
        >

        {this.props.user.skate_spots
          ? this.props.user.skate_spots.map((marker, index) => {
            const scaleStyle = {
              transform: [
                {
                  scale: interpolations[index].scale,
                },
              ],
            };
            const opacityStyle = {
              opacity: interpolations[index].opacity,
            }
            return(
            <MapView.Marker
              key={index}
              coordinate={{latitude:marker.latitude, longitude:marker.longitude}}
              title={marker.name}
              description={marker.description}>
              <Animated.View style={[styles.markerWrap, opacityStyle]}>
                <Animated.View style={[styles.ring, scaleStyle]} />
                <View style={styles.marker} />
              </Animated.View>


            </MapView.Marker>
          )})
          : null}

        </MapView>

        <Callout>
          <View>
            <View>
              <TouchableOpacity onPress= {() => this.props.navigation.openDrawer()} >
                    <Icon
                      raised
                      name='bars'
                      size={17}
                      type='font-awesome'

                      containerStyle={{
                        position:'absolute',
                        marginTop: 60,
                        marginLeft: 10,
                      }}
                      color="rgb(244, 2, 87)"
                    />
                </TouchableOpacity>

              <TouchableOpacity onPress= {() => this.props.navigation.navigate('NewSpotPage')} >
                  <Icon
                    raised
                    name='plus'
                    size={20}
                    type='font-awesome'
                    containerStyle={{
                      position: 'absolute',
                      paddingTop: 0,
                      marginLeft: 10,
                      marginTop: 410,
                    }}
                    color="rgb(244, 2, 87)"
                  />
              </TouchableOpacity>
            </View>

            <View style={styles.rightSideButtons}>
              <TouchableOpacity onPress= {this.refreshMarkers} >
                  <Icon
                    raised
                    name='refresh'
                    size={20}
                    type='font-awesome'
                    containerStyle={{
                      position: 'absolute',
                      paddingTop: 0,
                      marginLeft: 310,
                      marginTop: 150,
                    }}
                    color="rgb(244, 2, 87)"
                  />
              </TouchableOpacity>

              <TouchableOpacity onPress= {this.getUserLocationHandler} >
                    <Icon
                      raised
                      name='location-arrow'
                      size={20}
                      type='font-awesome'

                      containerStyle={{
                        position:'absolute',
                        marginTop: 210,
                        marginLeft: 310,

                      }}
                      color="rgb(244, 2, 87)"
                    />
                </TouchableOpacity>

              </View>

            </View>
        </Callout>




        <Animated.ScrollView
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 20}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.animation,
                  },
                },
              },
            ],
            { useNativeDriver: true }
          )}
          style={styles.scrollView}
        >
          {this.props.user.skate_spots
           ? this.props.user.skate_spots.map((marker, index) => (
              <View style={styles.card} key={index}>

                <BookmarkButton spot={marker} style={{position:'absolute', zIndex:1}}/>

                <TouchableOpacity onPress={() => Linking.openURL(`https://www.google.com/maps/dir//${marker.latitude},${marker.longitude}`)} style={{position:'absolute', zIndex:1}}>
                  <Icon
                  raised
                  containerStyle={{position:'relative', zIndex:1, marginLeft:10, marginTop:10}}
                  name="directions"
                  size={15}
                  type="material-community"
                  color="black"
                  />
                </TouchableOpacity>

                <TouchableWithoutFeedback onPress={ () => this.sendingPropsTest(marker)}>
                  <Image
                    source={{uri:`http://${environment['BASE_URL']}${marker.skatephoto.url}`}}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                </TouchableWithoutFeedback>
                <View style={styles.textContent}>
                  <Text numberOfLines={1} style={styles.cardtitle}>{marker.name}</Text>
                  <Text numberOfLines={1} style={styles.cardDescription}>
                    {marker.description}
                  </Text>
                </View>
              </View>

          ))
          : null}
        </Animated.ScrollView>
      </View>
    );
  }
}



// <TouchableWithoutFeedback onPress={()=> { this.props.navigation.navigate('SpotPage', {
//   skatespot: marker })}}>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex:0
  },
  calloutView: {
   flexDirection: "row",
   backgroundColor: "rgba(255, 255, 255, 0.9)",
   borderRadius: 20,
   borderStyle:'solid',
   borderColor:'rgb(236, 229, 235)',
   borderWidth: 1,
   width: "70%",
   marginLeft: "11%",
   marginRight: "30%",
   marginTop: '25%',
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 5 },
   shadowOpacity: 0.3,
   shadowRadius: 3,
  },
  rightSideButtons:{
    position:'absolute',
    marginTop: 200,
  },
  scrollView: {
    position: "absolute",
    bottom: -5,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    // paddingRight: width - CARD_WIDTH,
  },
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(244, 2, 87, .9)",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(142, 25, 66, .3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  },
});

const mapStateToProps = state => {
  return {
    skate_spots: state.skate_spots,
    user: state.user,
  }
}

function mapDispatchToProps(dispatch) {
    return {
      getSkateSpots: () => dispatch(fetchKeyForSkateSpots()),
    }
}

const connectMap = connect(mapStateToProps, mapDispatchToProps)

export default withNavigation(compose(connectMap)(Map))
