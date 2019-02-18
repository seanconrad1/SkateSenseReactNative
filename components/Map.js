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
  Linking,
  FlatList
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
    },
    filteredSpots:[
      {
        id:1,
        name: 'MySkateSpot',
        country: 'USA',
        state: 'NY',
        city: 'NYC',
        latitude: '40.7128',
        longitude: '-74.0060',
        description: 'A good spot',
        bust_factor: 10,
        avatars:[{url:'/uploads/skate_spot/avatars/10/image.png'}],
        photo: 'n/a',
        user_id: 1,
      }
    ]
  }

  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }


  componentDidMount() {
    this.getUserLocationHandler()
    this.props.getSkateSpots()

    // this.setState({skatespots: this.props.user.skate_spots})

  }

  componentWillReceiveProps(nextProps){

    // This is the function to scroll
    // to the end of the spots when a new spot is created
    if (this.props.navigation.getParam('index') !== nextProps.navigation.getParam('index') && nextProps.navigation.getParam('index') !== undefined) {
      // this.props.getSkateSpots()
      this.scrollToNewSpot()
    }

    if(this.props.user.skate_spots !== nextProps.user.skate_spots && nextProps.user.skate_spots !== undefined){
      this.setState({skatespots: nextProps.user.skate_spots})
      // console.log('KEYs', Object.keys(this.animation._listeners).length);

      // filter to show only spots near current area
      let area = .5
      if (this.state.initialRegion && this.state.initialRegion.latitude > 0){
        console.log(this.state.initialRegion);
        let filteredSpots = nextProps.user.skate_spots.filter( spot => spot.latitude < (this.state.initialRegion.latitude + area) && spot.latitude > (this.state.initialRegion.latitude - area) && spot.longitude < (this.state.initialRegion.longitude + area) && spot.longitude > (this.state.initialRegion.longitude - area))
        this.setState({filteredSpots: filteredSpots})
      }

      //Animate to spot
      if (Object.keys(this.animation._listeners).length == 0){
      this.animation.addListener(({ value }) => {
        let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
        if (index >= this.state.filteredSpots.length) {
          index = this.state.filteredSpots.length - 1;
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
                latitude: this.state.filteredSpots[index].latitude,
                longitude: this.state.filteredSpots[index].longitude,
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
        initialRegion:{
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.115,
          longitudeDelta: 0.1121,
        },
        geoLocationSwitch: true
      })
    })
  }

  // getPosition = (options) => {
  // return new Promise(function (resolve, reject) {
  //   navigator.geolocation.getCurrentPosition(resolve, reject, options);
  //     });
  //   }
  //
  // getUserLocation = () => {
  //   this.getPosition()
  //   .then((position) => {
      // this.setState({
      //   initialRegion:{
      //     latitude: position.coords.latitude,
      //     longitude: position.coords.longitude,
      //     latitudeDelta: 0.115,
      //     longitudeDelta: 0.1121,
      //   },
      //   geoLocationSwitch: true
      // })
  //   })
  //   .catch((err) => {
  //     console.error(err.message);
  //   })
  // }


  // getPosition = () => {
  //   // Simple wrapper
  //   return new Promise((res, rej) => {
  //       navigator.geolocation.getCurrentPosition(res, rej);
  //   });
  // }
  //
  // getUserLocation = async () => {
  //     let position = await this.getPosition();  // wait for getPosition to complete
  //     this.setState({
  //       initialRegion:{
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //         latitudeDelta: 0.115,
  //         longitudeDelta: 0.1121,
  //       },
  //       geoLocationSwitch: true
  //     })
  // }



  goToSpotPage = (marker) => {
    this.props.navigation.navigate('SpotPageRemake', {skatespot: marker })
  }

  onMarkerPressHandler = (marker, index) => {
    this.myRef.getNode().scrollToIndex({'index':index})
  }

  scrollToNewSpot = () => {
    this.myRef.getNode().scrollToEnd()
  }

  onRegionChange = (region) => {
    this.setState({currentRegion: region})
  }


  render() {
    let radius = .5
    console.log('FILTEREDSPOTS', this.state.filteredSpots);
    // if (this.state.currentRegion && this.state.currentRegion.latitude > 0){
    //   let filteredSpots = this.state.skatespots.filter(spot =>{
    //     return spot.latitude < (this.state.currentRegion.latitude + radius) && spot.latitude < (this.state.currentRegion.latitude - radius) && spot.longitude < (this.state.currentRegion.longitude - radius) && spot.longitude < (this.state.currentRegion.longitude + radius)
    //   })
    //   // console.log('BEFORE FILTER', this.state.skatespots);
    //   // console.log('AFTER FILTER', filteredSpots);
    // }

    const interpolations =
    this.state.filteredSpots
    ?( this.state.filteredSpots.map((marker, index) => {
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
          initialRegion={this.state.initialRegion}
          style={{flex: 1}}
          // region={this.state.region}
          showsMyLocationButton={true}
          onRegionChange={this.onRegionChange}
        >

        {this.state.filteredSpots
          ? this.state.filteredSpots.map((marker, index) => {
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
              style={{ width: 40, height: 40 }}
              onPress={(e) => {e.stopPropagation(); this.onMarkerPressHandler(marker, index)}}
              >
              <Animated.View style={[styles.markerWrap, opacityStyle]}>
                <Animated.View style={[styles.ring, scaleStyle]}/>
                <View style={styles.marker}/>
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

              <TouchableOpacity onPress= {() => this.props.navigation.navigate('NewSpotPage', {scrollToNewSpot: this.scrollToNewSpot})} >
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

        <Animated.FlatList
          horizontal
          style={styles.scrollView}
          ref={c => (this.myRef = c)}
          scrollEventThrottle={1}
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
          data={this.state.filteredSpots}
          renderItem={({item, separators}) => (
              <TouchableWithoutFeedback onPress={() => this.goToSpotPage(item)} >
                <View style={styles.card}>
                  <BookmarkButton spot={item} style={{position:'absolute', zIndex:1}}/>

                  <TouchableOpacity onPress={() => Linking.openURL(`https://www.google.com/maps/dir//${item.latitude},${item.longitude}`)} style={{position:'absolute', zIndex:1}}>
                    <Icon
                    raised
                    containerStyle={{position:'relative', zIndex:1, marginLeft:10, marginTop:10}}
                    name="directions"
                    size={15}
                    type="material-community"
                    color="black"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.goToSpotPage(item)}>
                    <View>
                      {item.avatars[0].url
                      ?<Image
                          style={styles.cardImage}
                          resizeMode="cover"
                          source={{uri:`http://${environment['BASE_URL']}${item.avatars[0].url}`}}
                          onPress={ () => this.goToSpotPage(item)}
                          />
                      :null}

                        </View>
                  </TouchableOpacity>
                  <View style={styles.textContent}>
                    <Text numberOfLines={1} style={styles.cardtitle}>{item.name}</Text>
                    <Text numberOfLines={1} style={styles.cardDescription}>
                      {item.description}
                    </Text>
                  </View>
                </View>
            </TouchableWithoutFeedback>
          )}/>
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
    backgroundColor:'transparent',
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
    position:'absolute',
    zIndex:20,
    borderRadius: 20,
    flex: 4,
    width: wp('90%'),
    height: hp('32%'),
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: hp('2%'),
    marginTop: hp('32%'),
    fontWeight: "bold",
    alignSelf:'center',
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
