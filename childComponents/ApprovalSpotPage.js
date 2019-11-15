import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
  TouchableOpacity,
  Animated,
  Alert,
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

// const comments = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    height: hp('22%'),
  },
  homeView: {
    // alignItems: 'flex-end',
    // justifyContent: 'flex-end',
  },
  divider: {
    backgroundColor: 'grey',
    borderWidth: 0.2,
  },
});

class ApprovalSpotPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skatespot: '',
      images: [{ url: '/uploads/skate_spot/avatars/10/image.png' }],
      refreshing: false,
    };
  }

  componentDidMount() {
    this.setState({
      skatespot: this.props.navigation.getParam('skatespot'),
      images: this.props.navigation.getParam('skatespot').avatars,
    });
  }

  _renderItem = ({ item, i }) => (
    <View key={i}>
      <Image
        style={{ width: wp('100%'), height: hp('50%') }}
        source={{ uri: `http://${environment.BASE_URL}${item.url}` }}
      />
    </View>
  );

  approveSpot = () => {
    const fetchToApproveSpot = key => {
      fetch(`http://${environment.BASE_URL}/api/v1/skate_spots/${this.state.skatespot.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          approved: true,
        }),
      });
    };
    deviceStorage.loadJWT('jwt').then(val => fetchToApproveSpot(val));

    console.log('spot approved!');
    this.approvedAlert();
  };

  approvedAlert = () => {
    Alert.alert('Spot Approved', 'You have approved a spot.', { cancelable: false });
    this.props.navigation.goBack();
  };

  deletingSpotAlert = () => {
    Alert.alert(
      'Denying Spot',
      'Denying the spot deletes it. Are you sure?',
      [
        { text: 'Yes', onPress: () => this.deleteSpot() },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  deleteSpot = () => {
    const fetchToDeleteSpot = key => {
      fetch(`http://${environment.BASE_URL}/api/v1/skate_spots/${this.state.skatespot.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${key}`,
        },
      })
        .then(response => response.json())
        .then(r => console.log(r));
    };
    deviceStorage.loadJWT('jwt').then(val => fetchToDeleteSpot(val));
    this.props.navigation.goBack();
  };

  render() {
    return (
      <View style={styles.container} behavior="padding">
        <Header
          leftComponent={{
            icon: 'menu',
            color: 'black',
            onPress: () => this.props.navigation.openDrawer(),
          }}
          centerComponent={{
            fontFamily: 'Lobster',
            text: `${this.state.skatespot.name}`,
            style: { color: 'black', fontSize: wp('6%') },
          }}
          backgroundColor="white"
          containerStyle={{
            fontFamily: 'Lobster',
            justifyContent: 'space-around',
          }}
        />

        <Icon
          raised
          size={hp('2.8')}
          name="directions"
          iconStyle={{ color: 'rgb(244, 2, 87)' }}
          containerStyle={{
            position: 'absolute',
            zIndex: 1,
            marginLeft: wp('85%'),
            marginTop: '20%',
          }}
          onPress={() =>
            Linking.openURL(
              `http://maps.apple.com/?daddr=${this.state.skatespot.latitude},${this.state.skatespot.longitude}`
            )
          }
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

        <Text
          style={{ marginBottom: 10, position: 'relative', marginTop: 10, marginLeft: wp('2%') }}
        >
          {this.state.skatespot.url}
          {this.state.skatespot.description}
          {'\n'}
          Posted by {this.state.skatespot.user ? this.state.skatespot.user.username : null}
        </Text>

        <Divider style={styles.divider} />

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={this.deletingSpotAlert}>
            <Icon
              raised
              size={hp('7')}
              name="times"
              type="font-awesome"
              iconStyle={{ color: 'rgb(244, 2, 87)' }}
              containerStyle={{
                position: 'relative',
                zIndex: 1,
                marginLeft: wp('10%'),
                marginTop: hp('5%'),
                marginBottom: hp('10%'),
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={this.approveSpot}>
            <Icon
              raised
              size={hp('7')}
              name="check"
              type="font-awesome"
              iconStyle={{ color: 'green' }}
              containerStyle={{
                position: 'relative',
                zIndex: 1,
                marginLeft: wp('15%'),
                marginTop: hp('5%'),
                marginBottom: hp('10%'),
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

const connectMap = connect(mapStateToProps);

export default withNavigation(compose(connectMap)(ApprovalSpotPage));
