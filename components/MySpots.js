import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
  RefreshControl,
  Share,
} from 'react-native';
import { Header, Icon, Card, Button, Divider } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import environment from '../environment.js';
import MySpotsButtonGroup from '../childComponents/MySpotsButtonGroup.js';
import { fetchKeyForSkateSpots, fetchKeyForUserData } from '../action.js';
import deviceStorage from '../deviceStorage.js';

console.disableYellowBox = true;

const styles = StyleSheet.create({
  search: {
    marginLeft: wp('10%'),
    borderColor: 'black',
    borderRadius: 30,
    width: wp('100%'),
    height: hp('5%'),
    marginBottom: '1%',
    fontSize: 20,
  },
  imageStyle: {
    width: 200,
    height: 58,
  },
  directionsButton: {
    backgroundColor: 'grey',
    borderRadius: 20,
    width: '70%',
    marginLeft: 0,
    marginRight: 0,
    // marginBottom: 5,
    paddingRight: 0,
  },
  unBookmarkButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    height: hp('5.5'),
    width: wp('30%'),
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    padding: 0,
  },
  spot: {
    padding: 0,
    borderRadius: 20,
    shadowOpacity: 0.75,
    shadowRadius: 3,
    shadowColor: 'grey',
    shadowOffset: { height: 1, width: 1 },
  },
  lastSpot: {
    paddingBottom: 100,
    borderRadius: 20,
    shadowOpacity: 0.75,
    shadowRadius: 3,
    shadowColor: 'grey',
    shadowOffset: { height: 1, width: 1 },
  },
});

class MySpots extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submittedSpots: '',
      bookmarkedSpots: '',
      term: '',
      whichTab: 0,
      deleteThisSpotID: '',
      refreshing: false,
    };
  }

  componentDidMount() {
    this.props.getSkateSpots();
    if (this.props.user.user.skate_spots) {
      const bookmarks = this.props.user.user.skate_spots.reverse();
      let submitted = this.props.user.skate_spots.filter(
        spot => spot.user_id === this.props.user.user.id && spot.approved
      );
      submitted = submitted.reverse();

      this.setState({ bookmarkedSpots: bookmarks, submittedSpots: submitted });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user.user.skate_spots !== this.props.user.user.skate_spots) {
      const bookmarks = this.props.user.user.skate_spots.reverse();
      let submitted = this.props.user.skate_spots.filter(
        spot => spot.user_id === this.props.user.user.id
      );
      submitted = submitted.reverse();

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ bookmarkedSpots: bookmarks, submittedSpots: submitted });
    }
  }

  _onRefresh = () => {
    console.log('REFRESHING');
    this.setState({ refreshing: true });
    // this.props.getSkateSpots()
    this.props.fetchUserData(this.props.user.user.id);

    this.setState({ refreshing: false });
  };

  onSearchChange = e => {
    this.setState({
      term: e,
    });
  };

  onChangeTab = e => {
    this.setState({
      whichTab: e,
    });
  };

  onShare = async spot => {
    try {
      const result = await Share.share({
        message: `${spot.name}`,
        url: `http://maps.apple.com/?daddr=${spot.latitude},${spot.longitude}`,
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

  deleteSpot = id => {
    function fetchToDeleteSpot(key) {
      fetch(`http://${environment.BASE_URL}/api/v1/skate_spots/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${key}`,
        },
      })
        .then(response => response.json())
        .then(r => console.log(r));
    }
    deviceStorage.loadJWT('jwt').then(val => fetchToDeleteSpot(val));

    this.setState({
      submittedSpots: this.state.submittedSpots.filter(spot => spot.id !== id),
    });
    this.props.getSkateSpots();
  };

  deleteAlertMsg = id => {
    Alert.alert(
      'Deleting spot',
      'Are you sure you want to delete this spot?',
      [
        { text: 'Yes', onPress: () => this.deleteSpot(id) },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };

  unBookmark = id => {
    console.log('BOOkMARK ID?', id);
    const bookMarkObjects = this.props.user.user.bookmarks;
    const obj = bookMarkObjects.filter(bookmark => bookmark.skate_spot_id === id);
    const bookmarkID = obj[0].id;

    const fetchToUnbookmarkSpot = key => {
      fetch(`http://${environment.BASE_URL}/api/v1/bookmarks/${bookmarkID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${key}`,
        },
      })
        .then(r => r.json())
        .then(response =>
          this.setState({
            bookmarkedSpots: this.state.bookmarkedSpots.filter(bookmark => bookmark.id !== id),
          })
        );
    };

    deviceStorage.loadJWT('jwt').then(val => fetchToUnbookmarkSpot(val));
  };

  unBookmarkAlertMsg = id => {
    Alert.alert(
      'Unbookmarking spot',
      'Are you sure you want to unbookmark this spot?',
      [
        { text: 'Yes', onPress: () => this.unBookmark(id) },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };

  renderSpots = () => {
    if (this.state.whichTab === 0) {
      const spots = this.state.submittedSpots;

      if (spots === '') {
        return (
          <View>
            <Text>You don't have any spots bookmarked</Text>
          </View>
        );
      }
      if (this.state.term === '' || (this.state.term === undefined && spots !== undefined)) {
        const lastSpot = spots.filter(spot => spot === spots[spots.length - 1]);

        return spots.map(spot => (
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.navigation.navigate('SpotPage', {
                skatespot: spot,
              });
            }}
          >
            <Card
              key={spot.id}
              title={spot.name}
              image={{ uri: `http://${environment.BASE_URL}${spot.avatars[0].url}` }}
              containerStyle={spot === lastSpot ? styles.lastSpot : styles.spot}
            >
              <Text style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>About: </Text>
                {spot.description}
              </Text>

              <Divider style={styles.divider} />

              <View
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
              >
                <Icon
                  raised
                  name="directions"
                  size={17}
                  type="material-community"
                  color="black"
                  onPress={() =>
                    Linking.openURL(
                      `http://maps.apple.com/?daddr=${spot.latitude},${spot.longitude}`
                    )
                  }
                />
                <Icon
                  raised
                  name="trash"
                  type="font-awesome"
                  size={17}
                  color="rgb(244, 2, 87)"
                  onPress={() => this.deleteAlertMsg(spot.id)}
                />
                <Icon
                  raised
                  name="share"
                  type="ionicon"
                  size={17}
                  color="rgb(244, 2, 87)"
                  onPress={() => this.onShare(spot)}
                />
              </View>
            </Card>
          </TouchableWithoutFeedback>
        ));
      }
      const filteredArray = spots.filter(
        spot =>
          spot.name.toLowerCase().includes(this.state.term.toLowerCase()) ||
          spot.description.toLowerCase().includes(this.state.term.toLowerCase())
      );
      return filteredArray.map(spot => (
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.navigation.navigate('SpotPage', {
              skatespot: spot,
            });
          }}
        >
          <Card
            key={spot.id}
            title={spot.name}
            image={{ uri: `http://${environment.BASE_URL}${spot.avatars[0].url}` }}
            containerStyle={styles.spot}
          >
            <Text style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>About: </Text>
              {spot.description}
            </Text>

            <Divider style={styles.divider} />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Icon
                raised
                name="directions"
                size={17}
                type="material-community"
                color="black"
                onPress={() =>
                  Linking.openURL(`http://maps.apple.com/?daddr=${spot.latitude},${spot.longitude}`)
                }
              />
              <Icon
                raised
                name="trash"
                type="font-awesome"
                size={17}
                color="rgb(244, 2, 87)"
                onPress={() => this.deleteAlertMsg(spot.id)}
              />
              <Icon
                raised
                name="share"
                type="ionicon"
                size={17}
                color="rgb(244, 2, 87)"
                onPress={() => this.onShare(spot)}
              />
            </View>
          </Card>
        </TouchableWithoutFeedback>
      ));
    }
    if (this.state.whichTab === 1) {
      const bookmarks = this.state.bookmarkedSpots;
      if (this.state.term === '' || (this.state.term === undefined && bookmarks !== undefined)) {
        return bookmarks.map(bookmark => (
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.navigation.navigate('SpotPage', {
                skatespot: bookmark,
              });
            }}
          >
            <Card
              title={bookmark.name}
              image={{ uri: `http://${environment.BASE_URL}${bookmark.avatars[0].url}` }}
              containerStyle={styles.spot}
            >
              <Text style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>About: </Text>
                {bookmark.description}
              </Text>

              <Divider style={styles.divider} />

              <View
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
              >
                <Icon
                  raised
                  name="directions"
                  size={17}
                  type="material-community"
                  color="black"
                  onPress={() =>
                    Linking.openURL(
                      `http://maps.apple.com/?daddr=${bookmark.latitude},${bookmark.longitude}`
                    )
                  }
                />
                <Button
                  raised
                  buttonStyle={styles.unBookmarkButton}
                  titleStyle={{ fontSize: wp('3.5'), color: 'rgb(244, 2, 87)' }}
                  title="Unbookmark"
                  onPress={() => this.unBookmarkAlertMsg(bookmark.id)}
                />
                <Icon
                  raised
                  name="share"
                  type="ionicon"
                  size={17}
                  color="rgb(244, 2, 87)"
                  onPress={() => this.onShare(bookmark)}
                />
              </View>
            </Card>
          </TouchableWithoutFeedback>
        ));
      }
      const filteredArray = bookmarks.filter(
        bookmark =>
          bookmark.name.toLowerCase().includes(this.state.term.toLowerCase()) ||
          bookmark.description.toLowerCase().includes(this.state.term.toLowerCase())
      );

      return filteredArray.map(bookmark => (
        <View>
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.navigation.navigate('SpotPage', {
                skatespot: bookmark,
              });
            }}
          >
            <Card
              title={bookmark.name}
              image={{ uri: `http://${environment.BASE_URL}${bookmark.avatars[0].url}` }}
              containerStyle={styles.spot}
            >
              <Text style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>About: </Text>
                {bookmark.description}
              </Text>

              <Divider style={styles.divider} />

              <View
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
              >
                <Icon
                  raised
                  name="directions"
                  size={17}
                  type="material-community"
                  color="black"
                  onPress={() =>
                    Linking.openURL(
                      `http://maps.apple.com/?daddr=${bookmark.latitude},${bookmark.longitude}`
                    )
                  }
                />
                <Button
                  raised
                  buttonStyle={styles.unBookmarkButton}
                  titleStyle={{ fontSize: wp('3.5'), color: 'rgb(244, 2, 87)' }}
                  title="Unbookmark"
                  onPress={() => this.unBookmarkAlertMsg(bookmark.id)}
                />
                <Icon
                  raised
                  name="share"
                  type="ionicon"
                  size={17}
                  color="rgb(244, 2, 87)"
                  onPress={() => this.onShare(bookmark)}
                />
              </View>
            </Card>
          </TouchableWithoutFeedback>
        </View>
      ));
    }
  };

  render() {
    return (
      <View>
        <Header
          leftComponent={{
            icon: 'menu',
            color: 'black',
            onPress: () => this.props.navigation.openDrawer(),
          }}
          centerComponent={{
            fontFamily: 'Lobster',
            text: 'My Spots',
            style: { color: 'black', fontSize: 25 },
          }}
          backgroundColor="white"
          containerStyle={{
            fontFamily: 'Lobster',
            justifyContent: 'space-around',
          }}
        />

        <TextInput
          style={styles.search}
          placeholder="Search"
          returnKeyType="search"
          onChangeText={value => this.onSearchChange(value)}
        />

        <MySpotsButtonGroup onChangeTab={this.onChangeTab} />

        <ScrollView
          contentContainerStyle={{ paddingBottom: 200 }}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />
          }
        >
          {this.renderSpots()}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  skate_spots: state.skate_spots,
  user: state.user,
});

function mapDispatchToProps(dispatch) {
  return {
    getSkateSpots: () => dispatch(fetchKeyForSkateSpots()),
    fetchUserData: id => dispatch(fetchKeyForUserData(id)),
  };
}

const connectMap = connect(mapStateToProps, mapDispatchToProps);

export default withNavigation(compose(connectMap)(MySpots));
