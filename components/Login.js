import React, { Component } from 'react';
import { Keyboard, Text, View, StyleSheet, KeyboardAvoidingView, Animated } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { loginUser } from '../action.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: hp('25%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    fontFamily: 'Lobster',
    fontWeight: 'bold',
    marginBottom: hp('5%'),
  },
  submitButton: {
    marginTop: hp('5%'),
    backgroundColor: 'rgb(244, 2, 87)',
    width: wp('80%'),
    height: hp('6%'),
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: wp('20%'),
    marginBottom: hp('2%'),
  },
  signupButton: {
    backgroundColor: 'grey',
    width: wp('80%'),
    height: hp('6%'),
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: wp('20%'),
  },
});

const FONT_SIZE_BIG = hp('8');
const FONT_SIZE_SMALL = hp('6');

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
    this.fontSizeBig = new Animated.Value(hp('8'));
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loggedIn) {
      this.setState({ username: '', password: '' });
    }
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = event => {
    Animated.timing(this.fontSizeBig, {
      duration: event.duration,
      toValue: FONT_SIZE_SMALL,
    }).start();
  };

  keyboardWillHide = event => {
    Animated.timing(this.fontSizeBig, {
      duration: event.duration,
      toValue: FONT_SIZE_BIG,
    }).start();
  };

  onSubmit = () => {
    this.props.loginUser(this.state.username, this.state.password);
  };

  render() {
    return this.props.loggedIn ? (
      this.props.navigation.navigate('Map')
    ) : (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View>
          <Animated.Text style={[styles.header, { fontSize: this.fontSizeBig }]}>
            SkateSense
          </Animated.Text>
        </View>

        <View>
          <Text style={{ color: 'red' }}>{this.props.error ? this.props.error : null}</Text>
        </View>

        <Input
          placeholder="Username"
          leftIcon={<Icon name="user" size={24} color="black" />}
          clearButtonMode="never"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
          keyboardType="default"
          onChangeText={username => this.setState({ username })}
        />

        <Input
          returnKeyType="go"
          onSubmitEditing={this.onSubmit}
          placeholder="Password"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="never"
          secureTextEntry
          leftIcon={<Icon name="lock" size={24} color="black" />}
          onChangeText={password => this.setState({ password })}
        />

        <Button
          icon={<Icon name="arrow-right" size={15} color="white" />}
          title="Submit"
          buttonStyle={styles.submitButton}
          onPress={this.onSubmit}
        />

        <Button
          icon={<Icon name="arrow-right" size={15} color="white" />}
          title="Sign Up"
          buttonStyle={styles.signupButton}
          onPress={() => this.props.navigation.navigate('SignUp')}
        />
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = ({ user: { authenticatingUser, failedLogin, error, loggedIn } }) => ({
  authenticatingUser,
  failedLogin,
  error,
  loggedIn,
});

const connectMap = connect(mapStateToProps, { loginUser });

export default withNavigation(compose(connectMap)(Login));
