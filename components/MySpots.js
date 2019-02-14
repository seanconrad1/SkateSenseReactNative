import React, {Component} from 'react'
import { View,
         Text,
         StyleSheet,
         Image,
         ScrollView,
         Linking,
         TouchableWithoutFeedback,
         TextInput,
         YellowBox,
         Alert,
         RefreshControl} from 'react-native'
import { Header, Icon,  Card, ListItem, Button } from 'react-native-elements'
import environment from '../environment.js'
import { withNavigation } from 'react-navigation'
import MySpotsButtonGroup from '../childComponents/MySpotsButtonGroup.js'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { fetchKeyForSkateSpots, fetchKeyForUserData } from '../action.js'
import deviceStorage from '../deviceStorage.js'
import {widthPercentageToDP as wp,
        heightPercentageToDP as hp} from 'react-native-responsive-screen';


console.disableYellowBox = true;

const styles = StyleSheet.create({
  search:{
    marginLeft:wp('10%'),
    borderColor:"black",
    borderRadius: 30,
    width: wp('100%'),
    height: hp('5%'),
    marginBottom:"1%",
    fontSize:20
  },
  imageStyle:{
    width: 200,
    height: 58
  },
  directionsButton:{
    backgroundColor:"grey",
    borderRadius: 20,
    width: '100%',
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 5,
    paddingRight: 0
  },
  unBookmarkButton:{
    backgroundColor:"#f40257",
    borderRadius: 20,
    width: '100%',
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    padding: 0
  },
  spot:{
     padding:0,
     borderRadius: 20,
     shadowOpacity: 0.75,
     shadowRadius: 3,
     shadowColor: 'grey',
     shadowOffset: { height: 1, width: 1 }
  },
  lastSpot:{
    paddingBottom:100,
    borderRadius:20,
    shadowOpacity: 0.75,
    shadowRadius: 3,
    shadowColor: 'grey',
    shadowOffset: { height: 1, width: 1 }
  }
})

class MySpots extends Component {
  constructor(props){
    super(props)
    this.state={
      submittedSpots: '',
      bookmarkedSpots: '',
      term: '',
      whichTab: 0,
      deleteThisSpotID: '',
      refreshing: false,

    }
  }

  componentDidMount(){
    this.props.getSkateSpots()
    if (this.props.user.user.skate_spots){
      let bookmarks = this.props.user.user.skate_spots.reverse()
      let submitted = this.props.user.skate_spots.filter(spot => spot.user_id === this.props.user.user.id)
      submitted = submitted.reverse()

      this.setState(
        {bookmarkedSpots: bookmarks,
         submittedSpots: submitted
        }
      )
    }
  }

  componentDidUpdate(prevProps){
    if (prevProps.user.user.skate_spots !== this.props.user.user.skate_spots){
      let bookmarks = this.props.user.user.skate_spots.reverse()
      let submitted = this.props.user.skate_spots.filter(spot => spot.user_id === this.props.user.user.id)
      submitted = submitted.reverse()

      this.setState(
        {bookmarkedSpots: bookmarks,
         submittedSpots: submitted
        }
      )
    }
  }

  _onRefresh = () => {
    console.log('REFRESHING')
    this.setState({refreshing: true});
    // this.props.getSkateSpots()
    this.props.fetchUserData(this.props.user.user.id)

    this.setState({refreshing: false});
  }

  onSearchChange = (e) => {
    this.setState({
      term: e
    })
  }

  onChangeTab = (e) =>{
    this.setState({
      whichTab: e
    })
  }

  deleteSpot = (id) =>{
    deviceStorage.loadJWT('jwt')
    .then(val => fetchToDeleteSpot(val))

    function fetchToDeleteSpot(key){
      fetch(`http://${environment['BASE_URL']}/api/v1/skate_spots/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
         Accept: 'application/json',
         Authorization: `Bearer ${key}`
      }})
      .then(response=>response.json())
      .then(r=>console.log(r))
    }

    this.setState({submittedSpots: this.state.submittedSpots.filter(spot => {
      return spot.id !== id
    })})
  }

  deleteAlertMsg = (id) =>{
    Alert.alert(
      'Deleting spot',
      "Are you sure you want to delete this spot?",
      [
        {text: 'Yes', onPress: () => this.deleteSpot(id)},
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  }

  unBookmark = (id) =>{

    console.log('BOOkMARK ID?', id)
    let bookMarkObjects = this.props.user.user.bookmarks
    let obj = bookMarkObjects.filter(bookmark => bookmark.skate_spot_id === id)
    let bookmarkID = obj[0].id

    deviceStorage.loadJWT('jwt')
    .then(val => fetchToUnbookmarkSpot(val))

    const fetchToUnbookmarkSpot = (key) => {
    fetch(`http://${environment['BASE_URL']}/api/v1/bookmarks/${bookmarkID}`,{
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
         Accept: 'application/json',
         Authorization: `Bearer ${key}`
      }})
      .then(r=>r.json())
      .then(response=>this.setState({bookmarkedSpots: this.state.bookmarkedSpots.filter(bookmark => {
        return bookmark.id !== id
      })}))
    }
  }

  unBookmarkAlertMsg = (id) =>{
    Alert.alert(
      'Unbookmarking spot',
      "Are you sure you want to unbookmark this spot?",
      [
        {text: 'Yes', onPress: () => this.unBookmark(id)},
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  }

  renderSpots = () => {
    if (this.state.whichTab === 0) {

      let spots = this.state.submittedSpots

      if(spots === ''){
        return <View><Text>You don't have any spots bookmarked</Text></View>
      }else if (this.state.term === '' || this.state.term === undefined && spots !== undefined) {

        let lastSpot = spots.filter(spot => spot === spots[spots.length -1 ])

        return spots.map(spot => (

          <TouchableWithoutFeedback onPress={()=> { this.props.navigation.navigate('SpotPage', {
            skatespot: spot })}}>

              <Card
                key={spot.id}
                title={spot.name}
                image={{uri:`http://${environment['BASE_URL']}${spot.skatephoto.url}`}}
                containerStyle={spot === lastSpot? styles.lastSpot : styles.spot}
                >

              <Text style={{marginBottom: 10}}>
              { spot.description}
              </Text>

              <Button
                raised
                icon={<Icon name="directions"/>}
                buttonStyle={styles.directionsButton}
                onPress={() => Linking.openURL(`https://www.google.com/maps/dir//${spot.latitude},${spot.longitude}`)}
                title='Directions' />

              <Button
                raised
                icon={{name: 'trash', type: 'font-awesome'}}
                buttonStyle={styles.unBookmarkButton}
                onPress={() => this.deleteAlertMsg(spot.id)}
                title='Delete Spot' />
              </Card>
            </TouchableWithoutFeedback>

          )
        )
      }else{
        let filteredArray = spots.filter(spot => spot.name.toLowerCase().includes(this.state.term.toLowerCase()) || spot.description.toLowerCase().includes(this.state.term.toLowerCase()))
        return filteredArray.map(spot => (

          <TouchableWithoutFeedback onPress={()=> { this.props.navigation.navigate('SpotPage', {
            skatespot: spot
          })}}>
            <Card
              key={spot.id}
              title={spot.name}
              image={{uri:`http://${environment['BASE_URL']}${spot.skatephoto.url}`}}
              containerStyle={styles.spot}>

              <Text style={{marginBottom: 10}}>
                {spot.description}
              </Text>

              <Button
                raised
                icon={<Icon name="directions"/>}
                buttonStyle={styles.directionsButton}
                onPress={() => Linking.openURL(`https://www.google.com/maps/dir//${spot.latitude},${spot.longitude}`)}
                title='Directions'
              />

              <Button
                raised
                icon={{name: 'trash', type: 'font-awesome'}}
                buttonStyle={styles.unBookmarkButton}
                title='Delete Spot'
                onPress={() => this.deleteAlertMsg(spot.id)}
            />
          </Card>
          </TouchableWithoutFeedback>

        )
      )
    }
  }else if (this.state.whichTab === 1) {
      let bookmarks = this.state.bookmarkedSpots
      if (this.state.term === '' || this.state.term === undefined && bookmarks !== undefined) {
        return bookmarks.map(bookmark => (
          <TouchableWithoutFeedback onPress={()=> { this.props.navigation.navigate('SpotPage', {
                skatespot: bookmark
              })}}>
            <Card
              title={bookmark.name}
              image={{uri:`http://${environment['BASE_URL']}${bookmark.skatephoto.url}`}}
              containerStyle={styles.spot}>

              <Text style={{marginBottom: 10}}>
                {bookmark.description}
              </Text>

              <Button
              raised
              icon={<Icon name="directions"/>}
              buttonStyle={styles.directionsButton}
              onPress={() => Linking.openURL(`https://www.google.com/maps/dir//${bookmark.latitude},${bookmark.longitude}`)}
              title='Directions' />

              <Button
                raised
                buttonStyle={styles.unBookmarkButton}
                title='Unbookmark'
                onPress={() => this.unBookmarkAlertMsg(bookmark.id)}
                />

            </Card>
          </TouchableWithoutFeedback>

        )
      )}else{
        let filteredArray = bookmarks.filter(bookmark => {
          return (bookmark.name.toLowerCase().includes(this.state.term.toLowerCase())
          || bookmark.description.toLowerCase().includes(this.state.term.toLowerCase()))
        })

        return filteredArray.map(bookmark => (
          <View>

            <TouchableWithoutFeedback onPress={()=> { this.props.navigation.navigate('SpotPage', {
                  skatespot: bookmark
                })}}>

                <Card
                  title={bookmark.name}
                  image={{uri:`http://${environment['BASE_URL']}${bookmark.skatephoto.url}`}}
                  containerStyle={styles.spot}>

                  <Text style={{marginBottom: 10}}>
                    {bookmark.description}
                  </Text>

                  <Button
                    raised
                    icon={<Icon name="directions"/>}
                    buttonStyle={styles.directionsButton}
                    onPress={() => Linking.openURL(`https://www.google.com/maps/dir//${bookmark.latitude},${bookmark.longitude}`)}
                    title='Directions'
                  />

                  <Button
                    raised
                    buttonStyle={styles.unBookmarkButton}
                    title='Unbookmark'
                    onPress={() => this.unBookmarkAlertMsg(bookmark.id)}
                    />


                </Card>
            </TouchableWithoutFeedback>

          </View>

        ))
      }
    }
}

  render(){
    return(
      <View>
        <Header
          leftComponent={{ icon: 'menu' , color: 'black', onPress: () => this.props.navigation.openDrawer()}}
          centerComponent={{ fontFamily:'Lobster', text: 'My Spots', style: { color: 'black', fontSize: 25 } }}
          backgroundColor='white'
          containerStyle={{
             fontFamily:'Lobster',
             justifyContent: 'space-around',
           }}/>

       <TextInput style={styles.search}
              placeholder={"Search"}
              onChangeText={(value) => this.onSearchChange(value)}
              />

      <MySpotsButtonGroup onChangeTab={this.onChangeTab}/>

       <ScrollView
         contentContainerStyle={{ paddingBottom: 200 }}
         refreshControl={
           <RefreshControl
             refreshing={this.state.refreshing}
             onRefresh={this._onRefresh}
           />
         }>
          {this.renderSpots()}
        </ScrollView>

      </View>
    )
  }
}



const mapStateToProps = state => {
  return {
    skate_spots: state.skate_spots,
    user: state.user,
  }
}

function mapDispatchToProps(dispatch) {
    return {
      getSkateSpots: () => dispatch(fetchKeyForSkateSpots()),
      fetchUserData: (id) => dispatch(fetchKeyForUserData(id))

    }
}

const connectMap = connect(mapStateToProps, mapDispatchToProps)

export default withNavigation(compose(connectMap)(MySpots))
