import React, {Component} from 'react'
import { View,
         Text,
         StyleSheet,
         Image,
         ScrollView,
         Linking,
         TouchableWithoutFeedback,
         TextInput } from 'react-native'
import { Header, Icon, Card, ListItem, Button } from 'react-native-elements'
// import Icon from 'react-native-vector-icons/FontAwesome';
import environment from '../environment.js'
import { withNavigation } from 'react-navigation'

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

})

class BookmarksContainer extends Component {
  constructor(props){
    super(props)
    this.state={
      bookmarks:[],
      term: ''
    }
  }


  componentDidMount(){
    fetch(`http://${environment['BASE_URL']}/api/v1/users/2`,{
    headers: {
          "Authorization": `${environment['API_KEY']}`
      },
    }).then(r=>r.json())
    .then(data=>this.setState({bookmarks: data.skate_spots}
    ))
  }

  onSearchChange = (e) => {
    this.setState({
      term: e
    })
  }

  renderBookmarks = () => {
    let bookmarks = this.state.bookmarks
    if (this.state.term === '' || this.state.term === undefined && bookmarks !== undefined) {
      console.log('SEARCH IS NOT WORKING');
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
            buttonStyle={{
              backgroundColor:"grey",
              borderRadius: 20,
              width: '100%',
              marginLeft: 0,
              marginRight: 0,
              marginBottom: 5,
              paddingRight: 0
            }}
            onPress={() => Linking.openURL(`https://www.google.com/maps/dir//${bookmark.latitude},${bookmark.longitude}`)}
            title='Directions' />

            <Button
              raised
              buttonStyle={{
                backgroundColor:"#f40257",
                borderRadius: 20,
                width: '100%',
                marginLeft: 0,
                marginRight: 0,
                marginBottom: 0,
                padding: 0
                }}
              title='Unbookmark' />

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
              image={{uri:`http://${environment['BASE_URL']}${bookmark.skatephoto.url}`}}>

              <Text style={{marginBottom: 10}}>
                {bookmark.description}
              </Text>


              <Button
              raised
              buttonStyle={{
                backgroundColor:"grey",
                borderRadius: 20,
                width: '100%',
                marginLeft: 0,
                marginRight: 0,
                marginBottom: 5,
                paddingRight: 0
              }}
              onPress={() => Linking.openURL(`https://www.google.com/maps/dir//${bookmark.latitude},${bookmark.longitude}`)}
              title='Directions' />

              <Button
                raised
                buttonStyle={{
                  backgroundColor:"#f40257",
                  borderRadius: 20,
                  width: '100%',
                  marginLeft: 0,
                  marginRight: 0,
                  marginBottom: 0,
                  padding: 0
                  }}
                title='Unbookmark' />

            </Card>

        </TouchableWithoutFeedback>
      ))
    }

  }


  render(){
    return(
      <View>
        <Header
          leftComponent={{ icon: 'arrow-back' , color: 'black', onPress: () => this.props.navigation.navigate('Map')}}
          centerComponent={{ fontFamily:'Lobster', text: 'Bookmarks', style: { color: 'black', fontSize: 25 } }}
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


// href={`https://www.google.com/maps/dir//${this.props.spot.latitude},${this.props.spot.longitude}`}




export default withNavigation(BookmarksContainer)
