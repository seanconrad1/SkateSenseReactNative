import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  Animated,
  YellowBox } from 'react-native'
import MapView, {
      Callout,
      Overlay,
      MapCallout } from 'react-native-maps'
import { withNavigation, DrawerActions } from 'react-navigation'
import { Header, ListItem } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import environment from '../environment.js'
import ActionButton from 'react-native-action-button';
import NewMarkerInfoBoxForm from '../childComponents/newMarkerInfoBoxForm.js'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { fetchKeyForSkateSpots } from '../action.js'

console.disableYellowBox = true;

let {height, width} = Dimensions.get('window')

const styles = StyleSheet.create({
 container: {
   height: height,
   width: width,
 },
 map: {
   ...StyleSheet.absoluteFillObject,
   zIndex: -1
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
},
returnedSearch:{
  marginLeft:'15%',
  marginRight:'25%',
  height:'25%',
},
markerWrap:{
  height:5
}

});

class Map extends Component {
  constructor(props){
    super(props)
    this.state = {
      userLocation: null,
      geoLocationSwitch: false,
      newMarkerLocation: {},
      newMarkerFormBox: false,
      term: null,
      skateSpots: '',
      counter:0
    }
  }

  componentDidMount(){
    this.getUserLocationHandler()
    this.props.getSkateSpots()
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

  getSearchResults = () =>{
    let spots = this.state.skateSpots
  }


  onLongPress(e) {
    const newMarker = e.nativeEvent.coordinate
    this.setState({
      newMarkerLocation: newMarker,
      newMarkerFormBox: true,
    })
  }

  render(){
    // region={ this.state.userLocation }

    return(
     <View style={styles.container}>

     <MapView
       style={styles.map}
       initialRegion ={this.state.userLocation}
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

        {this.props.user.skate_spots
          ? this.props.user.skate_spots.map(marker => (
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
                     placeholder={"Search"} onChangeText={(term) => this.setState({term})}/>
              </View>

              {this.getSearchResults()}

              <View>
                {this.state.newMarkerFormBox
                  ? <NewMarkerInfoBoxForm location={this.state.newMarkerLocation}/>
                :null}
              </View>
            </Overlay>

       </MapView>

       <Header
         leftComponent={{ icon: 'menu', color: 'black', onPress: () => this.props.navigation.openDrawer()}}
         centerComponent={{ fontFamily:'Lobster', text: 'SkateSense', style: { color: 'black', fontSize: 25 } }}
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


const mapStateToProps = state => {
  console.log('MY REDUX STATE', state)
  return {
    skate_spots: state.skate_spots,
    user: state.user,
    loggedIn: state.user.loggedIn
  }
}

function mapDispatchToProps(dispatch) {
    return {
      getSkateSpots: () => dispatch(fetchKeyForSkateSpots())
    }
}

const connectMap = connect(mapStateToProps, mapDispatchToProps)

export default withNavigation(compose(connectMap)(Map))

// {this.state.newMarkerFormBox
  // ? <NewMarkerInfoBoxForm/>
  // : null}

  // this.props.navigation.dispatch(DrawerActions.openDrawer())
  // this.props.navigation.openDrawer()
  // <Text onPress={() => this.props.navigation.navigate('DrawerOpen')
  // <Image source={{uri:`http://${environment['BASE_URL']}${marker.skatephoto.url}`}}

  // grey "rgb(236, 229, 235)"
  // red "rgb(244, 2, 87)"
