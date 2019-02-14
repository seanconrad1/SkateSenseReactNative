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
import {widthPercentageToDP as wp,
        heightPercentageToDP as hp} from 'react-native-responsive-screen';

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = hp('100%') / 2;
const CARD_WIDTH = wp('95%');

class Map extends Component {
  state = {
    region: {
      latitudeDelta: 0.04864195044303443,
      longitudeDelta: 0.040142817690068,
    }
  }

  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }


  componentDidMount() {
    this.getUserLocationHandler()
    this.props.getSkateSpots()
  }

  componentWillReceiveProps(nextProps){
    // debugger
    if(this.props.user.skate_spots !== nextProps.user.skate_spots && nextProps.user.skate_spots !== undefined){
      this.setState({skatespots: nextProps.user.skate_spots})
      // console.log('KEYs', Object.keys(this.animation._listeners).length);

      if (Object.keys(this.animation._listeners).length == 0){
      this.animation.addListener(({ value }) => {
        let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
        if (index >= this.state.skatespots.length) {
          index = this.state.skatespots.length - 1;
        }
        if (index <= 0) {
          index = 0;
        }

        clearTimeout(this.regionTimeout);
        this.regionTimeout = setTimeout(() => {
          if (this.index !== index) {
            this.index = index;
            this.map.animateToRegion(
              {
                latitude: this.state.skatespots[index].latitude,
                longitude: this.state.skatespots[index].longitude,
                latitudeDelta: this.state.region.latitudeDelta,
                longitudeDelta: this.state.region.longitudeDelta,
              },
              350
            );
          }
        }, 10);
      });
    }
    }
  }

  refreshMarkers = (marker) =>{
    console.log('GETTING NEW SPOTS')
    this.props.getSkateSpots()
  }

  animateToUserLocation = () =>{
    navigator.geolocation.getCurrentPosition(position => {
      this.map.animateToRegion(
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.115,
          longitudeDelta: 0.1121,
        },
        350
      )
    })
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

  goToSpotPage = (marker) => {
    this.props.navigation.navigate('SpotPage', {skatespot: marker })
  }

  onMarkerPressHandler = (marker, index) => {
    let x = index * CARD_WIDTH + 60
    this.myRef.getNode().scrollTo({x: x, animated: true})
  }

  render() {
    console.log('ANIMATION VALUE------',this.state.value);
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
              description={marker.description}
              onPress={() => this.onMarkerPressHandler(marker, index)}>
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
                        marginLeft: wp('3%'),
                        marginTop: hp('5%'),
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
                      marginLeft: wp('3%'),
                      marginTop: hp('50%'),
                    }}
                    color="rgb(244, 2, 87)"
                  />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress= {this.refreshMarkers} >
                <Icon
                  raised
                  name='refresh'
                  size={20}
                  type='font-awesome'
                  containerStyle={{
                    position: 'absolute',
                    paddingTop: 0,
                    marginLeft: wp('80%'),
                    marginTop: hp('40%'),
                  }}
                  color="rgb(244, 2, 87)"
                />
            </TouchableOpacity>

            <TouchableOpacity onPress= {this.animateToUserLocation} >
                  <Icon
                    raised
                    name='location-arrow'
                    size={20}
                    type='font-awesome'

                    containerStyle={{
                      position:'absolute',
                      marginLeft: wp('80%'),
                      marginTop: hp('50%'),
                    }}
                    color="rgb(244, 2, 87)"
                  />
              </TouchableOpacity>


            </View>
        </Callout>

        <Animated.ScrollView
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 20}
          snapToAlignment='center'
          ref={c => (this.myRef = c)}
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

                <TouchableWithoutFeedback onPress={ () => this.goToSpotPage(marker)}>
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
   shadowOffset: { width: 10, height: 10 },
   shadowOpacity: 0.3,
   shadowRadius: 10,
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
    width: CARD_WIDTH,
    height: hp('40%'),
    padding: 10,
    elevation: 1,
    shadowOpacity: 0.75,
    shadowRadius: 3,
    shadowColor: 'grey',
    shadowOffset: { height: 1, width: 1 },
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    borderRadius: 20,
  },
  cardImage: {
    borderRadius: 20,
    flex: 4,
    width: wp('90'),
    height: CARD_HEIGHT,
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: hp('1%'),
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
