import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { ButtonGroup } from 'react-native-elements';

const styles = StyleSheet.create({
  buttonGroupContainer: {
    height: 30,
  },
  selectedButtonStyle: {
    backgroundColor: 'rgb(244, 2, 87)',
  },
});

export default class MySpotsButtonGroup extends Component {
  constructor() {
    super();
    this.state = {
      selectedIndex: 0,
    };
    this.updateIndex = this.updateIndex.bind(this);
  }

  updateIndex(selectedIndex) {
    this.setState({ selectedIndex });
    this.props.onChangeTab(selectedIndex);
  }

  render() {
    const buttons = ['Submitted', 'Bookmarked'];
    const { selectedIndex } = this.state;

    return (
      <ButtonGroup
        onPress={this.updateIndex}
        selectedIndex={selectedIndex}
        buttons={buttons}
        containerStyle={styles.buttonGroupContainer}
        selectedButtonStyle={styles.selectedButtonStyle}
      />
    );
  }
}
