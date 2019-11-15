import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
  Animated,
  Alert,
  SafeAreaView,
  Share,
} from 'react-native';
import { Header, Icon, Divider } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import deviceStorage from '../deviceStorage.js';
import environment from '../environment.js';

import BookmarkButton from '../childComponents/BookmarkButton';

// const comments = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  scrollView: {
    height: hp('22%'),
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  divider: {
    backgroundColor: 'grey',
    borderWidth: 0.2,
  },
});

class SpotPageRemake extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skatespot: '',
      images: [{ url: '/uploads/skate_spot/avatars/10/image.png' }],
      comments: [],
      extendCommentsAndCommentField: false,
      commentContent: '',
    };
  }

  componentDidMount() {
    this.getUsers();
    this.setState({
      skatespot: this.props.navigation.getParam('skatespot'),
      images: this.props.navigation.getParam('skatespot').avatars,
    });
    if (this.props.navigation.getParam('skatespot').comments) {
      this.setState({
        comments: this.props.navigation.getParam('skatespot').comments.map(comment => comment),
      });
    }
  }

  onCommentChange = comment => {
    this.setState({
      commentContent: comment,
    });
  };

  deleteComment = comment => {
    function fetchToDeleteComment(key, commentID) {
      fetch(`http://${environment.BASE_URL}/api/v1/comments/${commentID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${key}`,
        },
      })
        .then(r => r.json())
        .then(data => console.log(data));
    }

    deviceStorage.loadJWT('jwt').then(key => fetchToDeleteComment(key, comment.id));
    this.setState({
      comments: this.state.comments.filter(oneComment => oneComment.id !== comment.id),
    });
  };

  getUsers = () => {
    const fetchUsers = async key => {
      const response = await fetch(`http://${environment.BASE_URL}/api/v1/users/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${key}`,
        },
      });
      const json = await response.json();
      this.setState({ users: json });
    };
    deviceStorage.loadJWT('jwt').then(k => fetchUsers(k));
  };

  findCommentOwner = id => {
    const user = this.state.users.filter(u => u.id === id);
    return `${user[0].username} `;
  };

  postButtonHandler = () => {
    const fetchToCommentOnSpot = key => {
      fetch(`http://${environment.BASE_URL}/api/v1/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          content: this.state.commentContent,
          skate_spot_id: this.state.skatespot.id,
          user_id: this.props.user.user.id,
        }),
      })
        .then(r => r.json())
        .then(data =>
          this.setState({
            comments: [...this.state.comments, data],
            commentContent: '',
          })
        );
    };
    deviceStorage.loadJWT('jwt').then(key => fetchToCommentOnSpot(key));
  };

  returnBookmarkStatus = () => {
    if (this.state.skatespot.bookmarks.length === 1) {
      return <Text style={{ marginLeft: wp('2%') }}>1 bookmark</Text>;
    }
    if (this.state.skatespot.bookmarks.length === 0) {
      return <Text style={{ marginLeft: wp('2%') }}>Spot has not been bookmarked yet </Text>;
    }
    return (
      <Text style={{ marginLeft: wp('2%') }}>
        {this.state.skatespot.bookmarks.length} bookmarks
      </Text>
    );
  };

  reportButtonHandler = () => {
    Alert.alert(
      'Reporting spot',
      'Are you sure you want to report this spot?',
      [
        {
          text: 'Yes',
          onPress: () => {
            Alert.alert('Spot reported!');
          },
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };

  _renderItem = ({ item }) => (
    <View>
      <Image
        style={{ width: wp('100%'), height: hp('50%') }}
        source={{ uri: `http://${environment.BASE_URL}${item.url}` }}
      />
    </View>
  );

  onShare = async () => {
    const { skatespot } = this.state;
    try {
      const result = await Share.share({
        message: `${skatespot.name}`,
        url: `http://maps.apple.com/?daddr=${skatespot.latitude},${skatespot.longitude}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  render() {
    console.log(this.props);
    console.log(this.state);
    const { skatespot, images } = this.state;

    return (
      <SafeAreaView>
        <Header
          leftComponent={{
            icon: 'menu',
            color: 'black',
            onPress: () => this.props.navigation.openDrawer(),
          }}
          centerComponent={{
            fontFamily: 'Lobster',
            text: `${skatespot.name}`,
            style: { color: 'black', fontSize: wp('6%') },
          }}
          backgroundColor="white"
          containerStyle={{
            fontFamily: 'Lobster',
            justifyContent: 'space-around',
          }}
        />

        <View style={styles.container}>
          <Animated.FlatList
            horizontal
            data={images}
            renderItem={this._renderItem}
            sliderWidth={wp('50%')}
            itemWidth={wp('50%')}
            ref={c => (this.myRef = c)}
            scrollEventThrottle={1}
            snapToInterval={wp('100%')}
          />

          <Text
            style={{ marginBottom: 10, position: 'relative', marginTop: 10, marginLeft: wp('2%') }}
          >
            {skatespot.url}
            {skatespot.description}
            {'\n'}
            Posted by {skatespot.user ? skatespot.user.username : null}
          </Text>

          {skatespot.bookmarks ? this.returnBookmarkStatus() : null}

          <Divider style={styles.divider} />

          <View style={styles.buttonContainer}>
            <Icon
              raised
              size={hp('2.8')}
              name="directions"
              iconStyle={{ color: 'rgb(244, 2, 87)' }}
              containerStyle={{
                zIndex: 1,
              }}
              onPress={() =>
                Linking.openURL(
                  `http://maps.apple.com/?daddr=${skatespot.latitude},${skatespot.longitude}`
                )
              }
            />

            <Icon
              raised
              size={hp('2.8')}
              name="share"
              color="rgb(244, 2, 87)"
              onPress={this.onShare}
            />

            <BookmarkButton spot={skatespot} />

            <Icon
              raised
              size={hp('2.8')}
              name="warning"
              iconStyle={{ color: 'rgb(244, 2, 87)' }}
              containerStyle={{
                zIndex: 1,
              }}
              onPress={this.reportButtonHandler}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

const connectMap = connect(mapStateToProps);

export default withNavigation(compose(connectMap)(SpotPageRemake));
