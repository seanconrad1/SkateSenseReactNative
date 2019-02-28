import React, {Component} from 'react'
import { View,
         Text,
         StyleSheet,
         Image,
         ScrollView,
         Linking,
         TouchableWithoutFeedback,
         Switch,
         Alert} from 'react-native'
import { Header, Icon, Card, ListItem, Button } from 'react-native-elements'
// import Icon from 'react-native-vector-icons/FontAwesome';
import environment from '../environment.js'
import { withNavigation } from 'react-navigation'
import deviceStorage from '../deviceStorage.js'
import Swipeout from 'react-native-swipeout';


const styles = StyleSheet.create({
  container: {
      textDecorationColor:'black',
      color:'black',
      flex: 1,
      backgroundColor: 'white',
      resizeMode: 'stretch'
    },
})



class CommentsPage extends Component {
  constructor(props){
    super(props)
    this.state={
      isOn: false,
    }
  }

  componentDidMount(){
    this.setState({comments: this.props.navigation.getParam('user').comments})
  }

  deleteAlert = (comment) =>{
    Alert.alert(
      'Deleting comment',
      "Are you sure you want to delete this comment?",
      [
        {text: 'Yes', onPress: () => this.deleteComment(comment)},
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    )
  }

  deleteComment = (comment) => {
    deviceStorage.loadJWT('jwt')
    .then(key => fetchToDeleteComment(key, comment.id))

    function fetchToDeleteComment(key, commentID){
      fetch(`http://${environment['BASE_URL']}/api/v1/comments/${commentID}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
           Accept: 'application/json',
           Authorization: `Bearer ${key}`
        },
      }).then(r=>r.json()).then(data=>console.log(data))
    }

    // debugger
    this.setState({comments: this.state.comments.filter(oneComment => {
      return oneComment.id !== comment.id
    })})
  }


  render(){
    return(
      <View style={styles.container}>
        <Header
          leftComponent={{ icon: 'menu' , color: 'black', onPress: () => this.props.navigation.openDrawer()}}
          centerComponent={{ fontFamily:'Lobster', text: `${this.props.navigation.getParam('user').username} commments`, style: { color: 'black', fontSize: 25 } }}
          backgroundColor='white'
          containerStyle={{
             fontFamily:'Lobster',
             justifyContent: 'space-around',
           }}/>

          <ScrollView>
            {this.state.comments
               ?this.state.comments.map((comment, i) => (
                   <View>
                       <ListItem
                         title={comment.content}
                         onPress={() => this.deleteAlert(comment)}
                       />
                    </View>
               ))
               :null
             }
          </ScrollView>
      </View>
    )
  }

}



export default withNavigation(CommentsPage)
