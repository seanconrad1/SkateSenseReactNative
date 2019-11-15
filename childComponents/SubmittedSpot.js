import React, { Component } from 'react';
import { Text, Linking, TouchableWithoutFeedback } from 'react-native';
import { Icon, Card, Button } from 'react-native-elements';
import environment from '../environment.js';

export default class SubmittedSpot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spot: '',
    };
  }

  componentDidMount() {
    this.setState({ spot: this.props.spot });
  }

  render() {
    const { spot } = this.state;
    return (
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
          image={{ uri: `http://${environment.BASE_URL}${spot.skatephoto.url}` }}
          containerStyle={{ borderRadius: 20 }}
        >
          <Text style={{ marginBottom: 10 }}>{spot.description}</Text>

          <Button
            raised
            icon={<Icon name="directions" />}
            buttonStyle={styles.directionsButton}
            onPress={() =>
              Linking.openURL(`http://maps.apple.com/?daddr=${spot.latitude},${spot.longitude}`)
            }
            title="Directions"
          />

          <Button
            raised
            icon={{ name: 'trash', type: 'font-awesome' }}
            buttonStyle={styles.unBookmarkButton}
            onPress={() => this.props.deleteAlertMsg(spot.id)}
            title="Delete Spot"
          />
        </Card>
      </TouchableWithoutFeedback>
    );
  }
}
