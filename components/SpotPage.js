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
import environment from '../environment.js'
import { withNavigation } from 'react-navigation'

const comments = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth']

const styles = StyleSheet.create({
  commentButton:{
    backgroundColor:"grey",
    borderRadius: 20,
    width: '100%',
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 5,
    paddingRight: 0
  },
  commentInput:{
    alignItems: 'center',
    borderRadius:20,
    borderColor: 'gray',
    borderWidth: 1,
    paddingTop: '2%',
    paddingBottom: '2%',
    paddingLeft: '2%',
    paddingRight: '2%',
    marginRight: '20%',
  },
  postButton:{
    color:'black',
    borderRadius:20,
    backgroundColor: "rgb(244, 2, 87)",
    marginRight: '70%',
    marginTop: '2%'
  },
  cardContainer:{
    marginTop:'10%',
    paddingBottom:'50%',
    borderRadius: 20
  }
})

class SpotPage extends Component {
  constructor(props){
    super(props)
    this.state={
      skatespot: '',
      imageURL: '',
      extendCommentsAndCommentField: false,
    }
  }

  componentDidMount(){
    this.setState({
      skatespot: this.props.navigation.getParam('skatespot', 'defaultVAL'),
      imageURL: this.props.navigation.getParam('skatespot', 'defaultVAL').skatephoto.url
    })
  }

  render(){
    console.log('GOT HERE', this.state.skatespot);
    return(
      <View>
        <Header
          leftComponent={{ icon: 'menu' , color: 'black', onPress: () => this.props.navigation.openDrawer()}}
          centerComponent={{ fontFamily:'Lobster', text: `${this.state.skatespot.name}`, style: { color: 'black', fontSize: 25 } }}
          backgroundColor='white'
          containerStyle={{
             fontFamily:'Lobster',
             justifyContent: 'space-around',
           }}/>

        <Card
          containerStyle={styles.cardContainer}
          image={{uri:`http://${environment['BASE_URL']}${this.state.imageURL}`}}
          >
          <Text style={{marginBottom: 10}}>
            {this.state.skatespot.url}
            {this.state.skatespot.description}
          </Text>

          <View style={styles.commentContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder='Comment'
              />
            <Button
            title='Post'
            buttonStyle={styles.postButton}/>
          </View>

        </Card>
      </View>
    )
  }
}

export default withNavigation(SpotPage)
