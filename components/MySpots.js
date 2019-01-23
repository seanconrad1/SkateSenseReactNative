import React, {Component} from 'react'
import { View,
         Text,
         StyleSheet,
         Image,
         ScrollView,
         Linking,
         TouchableWithoutFeedback,
        TextInput} from 'react-native'
import { Header, Icon, Card, ListItem, Button } from 'react-native-elements'
// import Icon from 'react-native-vector-icons/FontAwesome';
import environment from '../environment.js'
import { withNavigation } from 'react-navigation'


const styles = StyleSheet.create({

})

class MySpots extends Component {
  constructor(props){
    super(props)
    this.state={
      skateSpots: '',
      term: '',
      userID: 2,
    }
  }

  async componentDidMount(){
    await fetch(`http://${environment['BASE_URL']}/api/v1/skate_spots`,{
    headers: {
          "Authorization": `${environment['API_KEY']}`
      },
    }).then(r=>r.json())
    .then(data=>this.setState({skateSpots: data}
    ))
  }


  onSearchChange = (e) => {
    this.setState({
      term: e
    })
  }

  renderBookmarks = () => {
    let spots = this.state.skateSpots
    if(spots === ''){
      return <View><Text>You don't have any spots bookmarked</Text></View>
    }else if (this.state.term === '' || this.state.term === undefined && spots !== undefined) {
      return spots.map(spot => (
              <TouchableWithoutFeedback onPress={()=> { this.props.navigation.navigate('SpotPage', {
                    skatespot: spot })}}>
                  <Card
                    title={spot.name}
                    image={{uri:`http://${environment['BASE_URL']}${spot.skatephoto.url}`}}
                    containerStyle={{borderRadius: 20}}>

                    <Text style={{marginBottom: 10}}>
                      {spot.description}
                    </Text>

                    <Button
                    raised
                    buttonStyle={styles.directionsButton}
                    onPress={() => Linking.openURL(`https://www.google.com/maps/dir//${spot.latitude},${spot.longitude}`)}
                    title='Directions' />

                    <Button
                      raised
                      buttonStyle={styles.unBookmarkButton}
                      title='Unspot' />

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
                title={spot.name}
                image={{uri:`http://${environment['BASE_URL']}${spot.skatephoto.url}`}}
                containerStyle={{borderRadius: 20}}>

                <Text style={{marginBottom: 10}}>
                  {spot.description}
                </Text>

                <Button
                  raised
                  buttonStyle={styles.directionsButton}
                  onPress={() => Linking.openURL(`https://www.google.com/maps/dir//${spot.latitude},${spot.longitude}`)}
                  title='Directions'
                />

                <Button
                  raised
                  buttonStyle={styles.unBookmarkButton}
                  title='Unspot'
                  />
              </Card>
        </TouchableWithoutFeedback>

        )
      )
    }
  }

  render(){
    return(
      <View>
        <Header
          leftComponent={{ icon: 'arrow-back' , color: 'black', onPress: () => this.props.navigation.navigate('Map')}}
          centerComponent={{ fontFamily:'Lobster', text: 'My Submitted Spots', style: { color: 'black', fontSize: 25 } }}
          backgroundColor='white'
          containerStyle={{
             fontFamily:'Lobster',
             justifyContent: 'space-around',
           }}/>

           <TextInput style={styles.calloutSearch}
                  placeholder={"Search"}
                  onChangeText={(value) => this.onSearchChange(value)}
                  />

       <ScrollView>
          {this.renderBookmarks()}
        </ScrollView>

      </View>

    )
  }
}



// let spots = this.state.skateSpots
// if (this.state.term === '' || this.state.term === undefined && spots !== undefined) {
//   console.log('SEARCH IS NOT WORKING');
//   return spots.map(spot => (

    // <TouchableWithoutFeedback onPress={()=> { this.props.navigation.navigate('SpotPage', {
    //       skatespot: spot
    //     })}}>
      // <Card
      //   title={spot.name}
      //   image={{uri:`http://${environment['BASE_URL']}${spot.skatephoto.url}`}}
      //   containerStyle={{borderRadius: 20}}>
      //
      //   <Text style={{marginBottom: 10}}>
      //     {spot.description}
      //   </Text>
      //
      //   <Button
      //   raised
      //   buttonStyle={styles.directionsButton}
      //   onPress={() => Linking.openURL(`https://www.google.com/maps/dir//${spot.latitude},${spot.longitude}`)}
      //   title='Directions' />
      //
      //   <Button
      //     raised
      //     buttonStyle={styles.unBookmarkButton}
      //     title='Unspot' />
      //
      // </Card>
    //
    // </TouchableWithoutFeedback>
//   )
// )}else{
  // let filteredArray = spots.filter(spot => spot.name.toLowerCase().includes(this.state.term.toLowerCase()) || spot.description.toLowerCase().includes(this.state.term.toLowerCase()))
  // return filteredArray.map(spot => (
//
    // <TouchableWithoutFeedback onPress={()=> { this.props.navigation.navigate('SpotPage', {
    //       skatespot: spot
    //     })}}>
        // <Card
        //   title={spot.name}
        //   image={{uri:`http://${environment['BASE_URL']}${spot.skatephoto.url}`}}
        //   containerStyle={{borderRadius: 20}}>
        //
        //   <Text style={{marginBottom: 10}}>
        //     {spot.description}
        //   </Text>
        //
        //   <Button
        //     raised
        //     buttonStyle={styles.directionsButton}
        //     onPress={() => Linking.openURL(`https://www.google.com/maps/dir//${spot.latitude},${spot.longitude}`)}
        //     title='Directions'
        //   />
        //
        //   <Button
        //     raised
        //     buttonStyle={styles.unBookmarkButton}
        //     title='Unspot'
        //     />
        //
        // </Card>
//
//     </TouchableWithoutFeedback>
//   ))
// }
























export default withNavigation(MySpots)
