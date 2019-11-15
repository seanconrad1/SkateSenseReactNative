import React, { Component } from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import deviceStorage from '../deviceStorage.js';
import environment from '../environment.js';

class BookmarkButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmarked: false,
      spotID: this.state.spot.id,
      currentUserid: this.props.user.user.id,
      currentBookmarkid: 'empty',
    };
  }

  componentDidMount() {
    this.checkIfUserBookmarkedSpot();
    console.log('getting here');
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.spot !== nextProps.spot) {
      this.setState({ spotID: nextProps.spot.id });
    }
    this.checkIfUserBookmarkedSpot();
  }

  checkIfUserBookmarkedSpot = () => {
    // debugger
    const data = this.props.user.user ? this.props.user.user.bookmarks : null;
    if (data !== null) {
      const bookmarked = data.find(bookmarks => bookmarks.skate_spot_id === this.state.spotID);
      if (bookmarked) {
        return this.setState({ bookmarked: true, currentBookmarkid: bookmarked.id });
      }
      return null;
    }
  };

  bookmarkSpot = () => {
    // debugger
    const uId = this.state.currentUserid;
    const { spotID } = this.state;

    console.log(uId, spotID);

    const fetchToBookmarkSpot = (key, user_id, skate_spot_id) => {
      fetch(`http://${environment.BASE_URL}/api/v1/bookmarks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          user_id,
          skate_spot_id,
        }),
      })
        .then(responseText => responseText.json())
        .then(response => this.setState({ bookmarked: true, currentBookmarkid: response.id }));
    };
    deviceStorage.loadJWT('jwt').then(val => fetchToBookmarkSpot(val, uId, spotID));
  };

  unBookmarkSpot = () => {
    // debugger

    const fetchToUnbookmarkSpot = key => {
      fetch(`http://${environment.BASE_URL}/api/v1/bookmarks/${this.state.currentBookmarkid}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${key}`,
        },
      })
        .then(r => r.json())
        .then(data => this.setState({ bookmarked: false, currentBookmarkid: data.id }));
    };
    deviceStorage.loadJWT('jwt').then(val => fetchToUnbookmarkSpot(val));
  };

  render() {
    return (
      <View style={{ position: 'absolute', zIndex: 1 }}>
        {!this.state.bookmarked ? (
          <Icon
            raised
            containerStyle={{ position: 'absolute', marginLeft: wp('80%'), marginTop: hp('1%') }}
            name="bookmark"
            size={15}
            type="font-awesome"
            color="black"
            onPress={() => this.bookmarkSpot()}
          />
        ) : (
          <Icon
            raised
            containerStyle={{ position: 'absolute', marginLeft: wp('80%'), marginTop: hp('1%') }}
            name="bookmark"
            size={15}
            type="font-awesome"
            color="rgb(244, 2, 87)"
            onPress={() => this.unBookmarkSpot()}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

const connectMap = connect(mapStateToProps);

export default compose(connectMap)(BookmarkButton);
