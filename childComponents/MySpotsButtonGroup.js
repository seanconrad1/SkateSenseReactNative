import React, { Component } from 'react';
import { Keyboard, Text, View , StyleSheet } from 'react-native'
import { Input, Button, ThemeProvider, ButtonGroup } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withNavigation } from 'react-navigation'
import environment from '../environment.js'

const styles = StyleSheet.create({
  buttonGroupContainer: {
    height: '3%',
  },
  selectedButtonStyle:{
    backgroundColor: "rgb(244, 2, 87)"
  }
})


export default class MySpotsButtonGroup extends Component {
  constructor () {
    super()
    this.state = {
      selectedIndex: 0
    }
    this.updateIndex = this.updateIndex.bind(this)
  }

  updateIndex (selectedIndex) {
    this.setState({selectedIndex})
  }

  render () {
    const buttons = ['All', 'Submitted', 'Bookmarked']
    const { selectedIndex } = this.state

    return (
      <ButtonGroup
        onPress={this.updateIndex}
        selectedIndex={selectedIndex}
        buttons={buttons}
        containerStyle={styles.buttonGroupContainer}
        selectedButtonStyle={styles.selectedButtonStyle}
      />
    )
  }
}
