import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, Image, TextInput } from 'react-native'
import MapView, { Callout, Overlay, Animated, MapCallout } from 'react-native-maps'
import { withNavigation, DrawerActions } from 'react-navigation'
import { Header } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import environment from '../environment.js'
import ActionButton from 'react-native-action-button';
import NewMarkerInfoBoxForm from '../childComponents/newMarkerInfoBoxForm.js'


let {height, width} = Dimensions.get('window')

const styles = StyleSheet.create({
 container: {
   height: height,
   width: width,
 },
 map: {
   ...StyleSheet.absoluteFillObject,
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
calloutSearch: {
  borderColor: "transparent",
  marginLeft: 10,
  width: "90%",
  marginRight: 10,
  height: 40,
  borderWidth: 0.0
},
markerBottomInfo:{
  flexDirection: "row",
  backgroundColor: "red",
  borderRadius: 10,
  width: "75%",
  height: "30%",
  marginLeft: "5%",
  marginRight: "0%",
  marginTop: 450
},
geoLocationButton:{
  flexDirection: "row",
  marginLeft: "5%",
  marginRight: "5%",
  marginTop: "120%"
},
geoLocationButtonMoved:{
  flexDirection: "row",
  marginLeft: "5%",
  marginRight: "5%",
  marginTop: "100%"
},
compass:{
  color: "white",
  fontSize: 25,
}

});

class Map extends Component {
  constructor(props){
    super(props)
    this.state = {
      userLocation: null,
      geoLocationSwitch: false,
      newMarkerLocation: {},
      newMarkerFormBox: false
    }
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

  hamburgerClicked = () => {
    console.log('maps container hamburger clicked!')
  }

  onLongPress(e) {
    const newMarker = e.nativeEvent.coordinate
    this.setState({
      newMarkerLocation: newMarker,
      newMarkerFormBox: true
    })
  }

  componentDidMount(){
    this.getUserLocationHandler()
    fetch(`http://${environment['BASE_URL']}/api/v1/skate_spots`,{
    headers: {
          "Authorization": `${environment['API_KEY']}`
      },
    }).then(r=>r.json())
    .then(data=>this.setState({skateSpots: data}
    ))
  }

  render(){
    console.log(this.state.newMarkerLocation);
    return(
     <View style={styles.container}>

     <MapView
       style={styles.map}
       region={ this.state.userLocation }
       showsUserLocation
       onLongPress={(e)=>this.onLongPress(e)}
       onPress={()=>this.setState({newMarkerFormBox: false})}
       >

       <MapView.Marker
        coordinate={this.state.newMarkerLocation}
        title='test'
        description='test description'
        onPress={()=>this.setState({newMarkerFormBox: true})}
        >
        </MapView.Marker>

      {this.state.skateSpots
        ? this.state.skateSpots.map(marker => (
          <MapView.Marker
          key={marker.id}
          coordinate={{latitude:marker.latitude, longitude:marker.longitude}}
          title={marker.title}
          description={marker.description}>

          </MapView.Marker>
        ))
        : null}

        <Overlay>
            <View style={styles.calloutView}>
            <TextInput style={styles.calloutSearch}
                   placeholder={"Search"}/>
              </View>

            <View>
              <NewMarkerInfoBoxForm location={this.state.newMarkerLocation}/>
            </View>

          </Overlay>
       </MapView>

       <Header
         leftComponent={{ icon: 'menu', color: 'black', onPress: () => this.props.navigation.openDrawer()}}
         centerComponent={{ fontFamily:'Lobster', text: 'SkateSense', style: { color: 'black', fontSize: 25 } }}
         rightComponent={{ icon: 'bookmark', color: 'black', onPress: () => this.props.navigation.navigate('BookmarksContainer')}}
         backgroundColor='white'
         containerStyle={{
            fontFamily:'Lobster',
            justifyContent: 'space-around',
          }}/>

        {this.state.newMarkerFormBox
        ? <View style={styles.geoLocationButtonMoved}>
           <ActionButton
            buttonColor="rgb(244, 2, 87)"
            onPress={this.getUserLocationHandler}
            icon={<Icon name='location-arrow' style={styles.compass} />} >

           >
           </ActionButton>
         </View>
        : <View style={styles.geoLocationButton}>
           <ActionButton
            buttonColor="rgb(244, 2, 87)"
            onPress={this.getUserLocationHandler}
            icon={<Icon name='location-arrow' style={styles.compass} />} >

           >
           </ActionButton>
         </View> }



     </View>
 )}
}


// {this.state.newMarkerFormBox
// ? <NewMarkerInfoBoxForm/>
// : null}

// this.props.navigation.dispatch(DrawerActions.openDrawer())
// this.props.navigation.openDrawer()
// <Text onPress={() => this.props.navigation.navigate('DrawerOpen')
// <Image source={{uri:`http://${environment['BASE_URL']}${marker.skatephoto.url}`}}

// grey "rgb(236, 229, 235)"
// red "rgb(244, 2, 87)"



export default withNavigation(Map)
