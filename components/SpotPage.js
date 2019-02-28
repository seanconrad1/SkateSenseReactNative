import React, {Component} from 'react'
import { View,
         Text,
         StyleSheet,
         Image,
         ScrollView,
         Linking,
         TouchableWithoutFeedback,
         TextInput,
         Animated,
         FlatList,
         KeyboardAvoidingView,
         Alert} from 'react-native'
import { Header, Icon, Card, ListItem, Button, Divider } from 'react-native-elements'
import environment from '../environment.js'
import { withNavigation } from 'react-navigation'
import deviceStorage from '../deviceStorage.js'
import { connect } from 'react-redux'
import { compose } from 'redux'
import {widthPercentageToDP as wp,
        heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Carousel from 'react-native-snap-carousel';


const comments = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth']


const styles = StyleSheet.create({
  container:{
    // flex: 1,
  },
  scrollView:{
    height: hp('22%'),
  },
  homeView:{
    // alignItems: 'flex-end',
    // justifyContent: 'flex-end',
  },
  commentContainer:{
    marginLeft: wp('2%'),
    position: 'relative',
    width: wp('100%'),
    flexDirection: 'column'
  },
  oneCommentContainer:{
    flexDirection:'row',
    padding: 0,
    margin: 0
  },
  trashIcon:{
    position:'relative',
    marginLeft:wp('20%'),
  },
  commentInputandButtonContainer:{
    flexDirection: 'row',
    position: 'relative',
    // marginTop: hp('15%'),
  },
  commentInput:{
    borderRadius: 20,
    borderColor: 'gray',
    borderWidth: 1,
    paddingTop: '2%',
    paddingBottom: '2%',
    paddingLeft: wp('2%'),
    paddingRight: '2%',
    width: wp('65%'),
    marginLeft: wp('2%'),
    marginRight: wp('2')
  },
  postButton:{
    color:'black',
    borderRadius:20,
    backgroundColor: "rgb(244, 2, 87)",
    width: wp('20%'),
  },
  divider:{
    backgroundColor: 'grey',
    borderWidth:.2,
  }
})

class SpotPageRemake extends Component {
  constructor(props){
    super(props)
    this.state={
      skatespot: '',
      images:[
          {url:'/uploads/skate_spot/avatars/10/image.png'},
        ],
      comments: [],
      extendCommentsAndCommentField: false,
      commentContent: '',
    }
  }

  componentDidMount(){
    this.getUsers()
    this.setState({
      skatespot: this.props.navigation.getParam('skatespot'),
      images: this.props.navigation.getParam('skatespot').avatars,
    })
    if (this.props.navigation.getParam('skatespot').comments) {
      this.setState({comments: this.props.navigation.getParam('skatespot').comments.map(comment => comment)})
    }
  }

  onCommentChange = (comment) => {
    this.setState({
      commentContent: comment
    })
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

    this.setState({comments: this.state.comments.filter(oneComment => {
      return oneComment.id !== comment.id
    })})
  }

  getUsers = () => {
    deviceStorage.loadJWT('jwt')
    .then(key => fetchUsers(key))

    const fetchUsers = async (key) =>{
      let response = await fetch(`http://${environment['BASE_URL']}/api/v1/users/`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
           Accept: 'application/json',
           Authorization: `Bearer ${key}`
        },
      })
      const json = await response.json();
      this.setState({users:json})
    }
  }

  findCommentOwner = (id) =>{
    let user = this.state.users.filter(user => user.id === id)
    return `${user[0].username} `
  }

  postButtonHandler = () =>{
    deviceStorage.loadJWT('jwt')
    .then(key => fetchToCommentOnSpot(key))

    const fetchToCommentOnSpot = (key) =>{
      fetch(`http://${environment['BASE_URL']}/api/v1/comments`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           Accept: 'application/json',
           Authorization: `Bearer ${key}`
        },
        body: JSON.stringify({
          'content': this.state.commentContent,
          'skate_spot_id': this.state.skatespot.id,
          'user_id': this.props.user.user.id
        })
      })
      .then(r=>r.json())
      .then((data)=>this.setState({comments: [...this.state.comments, data]}))
    }
  }

  returnBookmarkStatus = () => {
    if (this.state.skatespot.bookmarks.length === 1) {
      return <Text style={{marginLeft: wp('2%')}}>1 bookmark</Text>
    }else if (this.state.skatespot.bookmarks.length === 0) {
      return <Text style={{marginLeft: wp('2%')}}>Spot has not been bookmarked yet </Text>
    }else {
      return <Text style={{marginLeft: wp('2%')}}>{this.state.skatespot.bookmarks.length} bookmarks</Text>
    }
  }

  reportButtonHandler = () =>{
      Alert.alert(
        'Reporting',
        "Are you sure you want to report this spot?",
        [
          {text: 'Yes', onPress: () =>{
            Alert.alert(
              'Spot reported'
            )
          }},
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        {cancelable: false},
      )
    }

  _renderItem = ({item, index}) => {
        return (
            <View>
              <Image
                style={{width: wp('100%'), height: hp('50%')}}
                source={{uri:`http://${environment['BASE_URL']}${item.url}`}}
              />
            </View>
        );
    }

  render(){
    return(
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        >
          <Header
            leftComponent={{ icon: 'menu' , color: 'black', onPress: () => this.props.navigation.openDrawer()}}
            centerComponent={{ fontFamily:'Lobster', text: `${this.state.skatespot.name}`, style: { color: 'black', fontSize: wp('6%') } }}
            backgroundColor='white'
            containerStyle={{
               fontFamily:'Lobster',
               justifyContent: 'space-around',
             }}/>

             <Icon
               raised
               size={hp('2.8')}
               name='directions'
               iconStyle={{color:"rgb(244, 2, 87)"}}
               containerStyle={{position:'absolute',zIndex:1, marginLeft:wp('85%'), marginTop:('20%')}}
               onPress={() => Linking.openURL(`http://maps.apple.com/?daddr=${this.state.skatespot.latitude},${this.state.skatespot.longitude}&dirflg=d&t=h`)}
             />

            <Animated.FlatList
                horizontal
                data={this.state.images}
                renderItem={this._renderItem}
                sliderWidth={wp('50%')}
                itemWidth={wp('50%')}
                ref={c => (this.myRef = c)}
                scrollEventThrottle={1}
                snapToInterval={wp('100%')}
              />

              <Text style={{marginBottom: 10, position:'relative', marginTop: 10, marginLeft: wp('2%')}}>
                {this.state.skatespot.url}
                {this.state.skatespot.description}{"\n"}
                Posted by {this.state.skatespot.user
                            ?this.state.skatespot.user.username
                            :null
                          }
              </Text>

              {this.state.skatespot.bookmarks
                ?this.returnBookmarkStatus()
                :null
              }

              <Icon
                raised
                size={hp('2.8')}
                name='warning'
                iconStyle={{color:"rgb(244, 2, 87)"}}
                containerStyle={{position:'absolute',zIndex:0, marginLeft:wp('85%'), marginTop:hp('62%')}}
                onPress={this.reportButtonHandler}
               />

              <Divider style={styles.divider} />



              <ScrollView style={styles.scrollView} contentContainerStyle={styles.homeView}>
                <View style={styles.commentContainer}>
                  {this.state.comments.map(comment=>{
                    return <View style={styles.oneCommentContainer}>
                    <Text
                      style={{fontWeight: 'bold'}}>

                      {this.state.users
                        ?this.findCommentOwner(comment.user_id)
                        :null
                      }
                    </Text>
                    <Text style={styles.commentContent}>{comment.content}</Text>
                    <View>
                    {comment.user_id === this.props.user.user.id
                      ? <Icon name='trash' type='font-awesome' containerStyle={styles.trashIcon} onPress={() => this.deleteComment(comment)}/>
                      : null}
                      </View>
                      </View>
                    })}
                  </View>
              </ScrollView>



              <View style={styles.commentInputandButtonContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder='Comment'
                  onChangeText={(value) => this.onCommentChange(value)}
                  />

                  {this.state.commentContent
                    ? <Button
                    title='Post'
                    buttonStyle={styles.postButton}
                    onPress={this.postButtonHandler}
                    />
                    : <Button
                    disabled
                    title='Post'
                    buttonStyle={styles.postButton}
                    />}

                </View>
          </KeyboardAvoidingView>
        )
  }

}


const mapStateToProps = state => {
  return {
    user: state.user,
  }
}

const connectMap = connect(mapStateToProps)

export default withNavigation(compose(connectMap)(SpotPageRemake))
