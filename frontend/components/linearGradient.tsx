import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const CustomLinearGradient = ({ colors }) => () => (
  <LinearGradient colors={colors} />
);

export default CustomLinearGradient;