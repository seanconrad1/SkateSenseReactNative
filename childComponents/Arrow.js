import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const arrowPullDown = () => (
  <TouchableOpacity style={{ width: '100%', alignItems: 'center', marginTop: -10 }}>
    <Icon name="chevron-down" />
  </TouchableOpacity>
);

export default arrowPullDown;
