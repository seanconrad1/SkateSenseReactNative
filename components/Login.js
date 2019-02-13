import React, { Component } from 'react';
import { Keyboard,
          Text,
          View,
          YellowBox,
          StyleSheet,
          KeyboardAvoidingView } from 'react-native'
import { Input, Button, ThemeProvider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withNavigation } from 'react-navigation'
import environment from '../environment.js'
import { loginUser } from '../action.js'
import { connect } from 'react-redux'
import { compose } from 'redux'
import {widthPercentageToDP as wp,
        heightPercentageToDP as hp} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container: {
    flex: 0,
    marginTop: hp('25%'),
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'white'
  },
  header: {
    fontFamily: 'Lobster',
    fontSize: hp('7%'),
    fontWeight: 'bold',
    marginBottom: hp('10%'),
  },
  submitButton:{
    marginTop: hp('5%'),
    backgroundColor: "rgb(244, 2, 87)",
    width: wp('80%'),
    height: hp('6%'),
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: wp('20%'),
    marginBottom:hp('2%')
  },
  signupButton:{
    backgroundColor: "grey",
    width: wp('80%'),
    height: hp('6%'),
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: wp('20%'),
  }
})

class Login extends Component {
  state = {
    username: '',
    password: ''
  }

  componentDidMount() {
   this.keyboardDidShowListener = Keyboard.addListener(
     'keyboardDidShow',
     this._keyboardDidShow,
   );
   this.keyboardDidHideListener = Keyboard.addListener(
     'keyboardDidHide',
     this._keyboardDidHide,
   );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({keyboardShown: true})
  }

  _keyboardDidHide = () => {
    this.setState({keyboardShown: false})
  }

  onSubmit = (e) => {
    this.props.loginUser(this.state.username, this.state.password)
  }

  render(){
    console.log('keyboard shown? ', this.state.keyboardShown)

    return(
        this.props.loggedIn
        ? this.props.navigation.navigate('Map')
        : <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
            >
            <Text style={styles.header}>SkateSense</Text>

            <View>
              <Text style={{color:'red'}}>
                {this.props.error ? this.props.error : null}
              </Text>
            </View>

            <Input
              placeholder='Username'
              leftIcon={
                <Icon
                  name='user'
                  size={24}
                  color='black'
                />
              }
              clearButtonMode={'never'}
              autoCapitalize={'none'}
              autoCorrect={false}
              autoFocus={true}
              keyboardType="default"
              onChangeText={(username) => this.setState({username})}
              />

            <Input
              placeholder='Password'
              autoCapitalize={'none'}
              autoCorrect={false}
              clearButtonMode={'never'}
              secureTextEntry={true}
              leftIcon={
                <Icon
                  name='lock'
                  size={24}
                  color='black'
                />
              }
              onChangeText={(password) => this.setState({password})}
            />

            <Button
              icon={
                <Icon
                  name='arrow-right'
                  size={15}
                  color='white'
                />
              }
              title='Submit'
              buttonStyle={styles.submitButton}
              onPress={this.onSubmit}
            />

            <Button
              icon={
                <Icon
                  name='arrow-right'
                  size={15}
                  color='white'
                />
              }
              title='Sign Up'
              buttonStyle={styles.signupButton}
              onPress={() => this.props.navigation.navigate('SignUp')}
            />
          </KeyboardAvoidingView>
    )
  }
}


const mapStateToProps = ({ user: { authenticatingUser, failedLogin, error, loggedIn } }) => ({
  authenticatingUser,
  failedLogin,
  error,
  loggedIn
})


const connectMap = connect(mapStateToProps, { loginUser })

export default withNavigation(compose(connectMap)(Login))
