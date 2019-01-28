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
         Alert} from 'react-native'
import { Header, Icon,  Card, ListItem, Button } from 'react-native-elements'
import environment from '../environment.js'
import { withNavigation } from 'react-navigation'
import MySpotsButtonGroup from '../childComponents/MySpotsButtonGroup.js'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { fetchKeyForSkateSpots } from '../action.js'
import deviceStorage from '../deviceStorage.js'

console.disableYellowBox = true;

const styles = StyleSheet.create({
  calloutSearch:{
    marginLeft:"20%",
    borderColor:"black",
    borderRadius: 30,
    width: "70%",
    marginTop: "2%",
    marginLeft: "11%",
    marginBottom:"2%"
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
      deleteThisSpotID: ''

    }
  }

  componentDidMount(){
    this.props.getSkateSpots()
    if (this.props.user.user.skate_spots){
      this.setState(
        {bookmarkedSpots: this.props.user.user.skate_spots,
         submittedSpots: this.props.user.skate_spots.filter(spot => spot.user_id === this.props.user.user.id)
        }
      )
    }
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

    console.log(this.state.submittedSpots)
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
        return spots.map(spot => (
          <TouchableWithoutFeedback onPress={()=> { this.props.navigation.navigate('SpotPage', {
            skatespot: spot })}}>
              <Card
                key={spot.id}
                title={spot.name}
                image={{uri:`http://${environment['BASE_URL']}${spot.skatephoto.url}`}}
                containerStyle={{borderRadius: 20}}>

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
                onPress={() => this.props.deleteAlertMsg(spot.id)}
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
              containerStyle={{borderRadius: 20}}>

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
              containerStyle={{borderRadius: 20}}>

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
        let filteredArray = bookmarks.filter(bookmark => bookmark.name.toLowerCase().includes(this.state.term.toLowerCase()) || bookmark.description.toLowerCase().includes(this.state.term.toLowerCase()))
        return filteredArray.map(bookmark => (

          <TouchableWithoutFeedback onPress={()=> { this.props.navigation.navigate('SpotPage', {
                skatespot: bookmark
              })}}>
              <Card
                title={bookmark.name}
                image={{uri:`http://${environment['BASE_URL']}${bookmark.skatephoto.url}`}}
                containerStyle={{borderRadius: 20}}>

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
                  onPress={() => this.unBookmarkAlertMsg(bookmark.id)}/>
                  />

              </Card>

          </TouchableWithoutFeedback>
        ))
      }
    }
}

  render(){
    console.log(this.state)
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

       <TextInput style={styles.calloutSearch}
              placeholder={"Search"}
              onChangeText={(value) => this.onSearchChange(value)}
              />

      <MySpotsButtonGroup onChangeTab={this.onChangeTab}/>

       <ScrollView>
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
      getSkateSpots: () => dispatch(fetchKeyForSkateSpots())
    }
}

const connectMap = connect(mapStateToProps, mapDispatchToProps)

export default withNavigation(compose(connectMap)(MySpots))
