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
import deviceStorage from '../deviceStorage.js'
import { connect } from 'react-redux'
import { compose } from 'redux'

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
      comments: [],
      extendCommentsAndCommentField: false,
      commentContent: '',
    }
  }

  componentDidMount(){
    this.setState({
      skatespot: this.props.navigation.getParam('skatespot'),
      imageURL: this.props.navigation.getParam('skatespot').skatephoto.url,
      comments: this.props.navigation.getParam('skatespot').comments.map(comment => comment.content),
    })
  }

  onCommentChange = (comment) => {
    this.setState({
      commentContent: comment
    })
  }

  postButtonHandler = () =>{
    let { commentContent } = this.state
    let skate_spot_id = this.state.skatespot.id
    let user_id = this.props.user.user.id

    deviceStorage.loadJWT('jwt')
    .then(key => fetchToCommentOnSpot(key,
        commentContent, skate_spot_id, user_id))


    function fetchToCommentOnSpot(key, commentContent, skate_spot_id, user_id){

      fetch(`http://${environment['BASE_URL']}/api/v1/comments`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           Accept: 'application/json',
           Authorization: `Bearer ${key}`
        },
        body: JSON.stringify({
          'content': commentContent,
          'skate_spot_id': skate_spot_id,
          'user_id': user_id
        })
      }).then(r=>r.json()).then(data=>console.log(data))
    }

    this.setState({ comments: [...this.state.comments, this.state.commentContent]})
    console.log(this.state.commentContent);
  }

  render(){
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

          <View>
              {this.state.comments.map(comment=>{
              return <Text>
                      {comment}
                    </Text>
                  })}
          </View>

          <View style={styles.commentContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder='Comment'
              onChangeText={(value) => this.onCommentChange(value)}
              />

            <Button
            title='Post'
            buttonStyle={styles.postButton}
            onPress={this.postButtonHandler}
            />
          </View>

        </Card>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
  }
}

const connectMap = connect(mapStateToProps)

export default withNavigation(compose(connectMap)(SpotPage))
