import React, {Component} from 'react'
import { Keyboard, Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import { Header } from 'react-native-elements'
import { Input, Button, ThemeProvider, Icon } from 'react-native-elements';
import { withNavigation } from 'react-navigation'
import environment from '../environment.js'
import deviceStorage from '../deviceStorage.js'
import { connect } from 'react-redux'
import { compose } from 'redux'

class BookmarkButton extends Component {
  constructor(props) {
    super(props)
    this.state={
      bookmarked: false,
      spotID: this.props.spot.id,
      currentUserid: this.props.user.user.id,
      currentBookmarkid: 'empty'
    }
  }

  componentDidMount(){
      this.checkIfUserBookmarkedSpot()
  }

  checkIfUserBookmarkedSpot = () =>{
    let data = this.props.user.user ? this.props.user.user.bookmarks : null
    if (data !== null){
      const bookmarked = data.find(bookmarks=>(bookmarks.skate_spot_id === this.state.spotID))
      bookmarked ? this.setState({bookmarked:true, currentBookmarkid:bookmarked.id}) : null
    }
  }


  bookmarkSpot = () =>{
    let userID = this.state.currentUserid
    let spotID = this.state.spotID
    deviceStorage.loadJWT('jwt')
    .then(val => fetchToBookmarkSpot(val, userID, spotID))

    const fetchToBookmarkSpot = (key, userID, spotID) =>{
      fetch(`http://${environment['BASE_URL']}/api/v1/bookmarks/`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           Accept: 'application/json',
           Authorization: `Bearer ${key}`
        },
        body: JSON.stringify({
          user_id:  userID,
          skate_spot_id: spotID
        })
      })
        .then((responseText) => responseText.json())
        .then((response) => this.setState({bookmarked: true, currentBookmarkid:response.id}))
      }
    }

    unBookmarkSpot = () =>{
      deviceStorage.loadJWT('jwt')
      .then(val => fetchToUnbookmarkSpot(val))

      const fetchToUnbookmarkSpot = (key) => {
      fetch(`http://${environment['BASE_URL']}/api/v1/bookmarks/${this.state.currentBookmarkid}`,{
        method: "DELETE",
        headers: {
           Authorization: `Bearer ${key}`
        }
      })
      .then(r=>r.json())
      .then(data=>this.setState({bookmarked:false, currentBookmarkid: data.id}))
    }
  }

  render(){
    return(
      <View style={{position:'absolute', zIndex:1}}>
        {!this.state.bookmarked
        ?<TouchableOpacity onPress={this.bookmarkSpot}>
        <Icon
        raised
        containerStyle={{position:'absolute', marginLeft:290, marginTop:10}}
        name="bookmark"
        size={15}
        type="font-awesome"
        color="black"
        />
        </TouchableOpacity>

        :<TouchableOpacity onPress={() => this.unBookmarkSpot()}>
          <Icon
          raised
          containerStyle={{position:'absolute', zIndex:1, marginLeft:290, marginTop:10}}
          name="bookmark"
          size={15}
          type="font-awesome"
          color="rgb(244, 2, 87)"
          />
        </TouchableOpacity>
        }
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

export default compose(connectMap)(BookmarkButton)
