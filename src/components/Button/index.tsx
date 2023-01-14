import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Text } from '../Text';

import {
  Container
} from './styles';

interface ButtonProps {
  title: string;
  disabled?: boolean;
  onPress: () => void;
  loading?: boolean;
}

export function Button({title, onPress, disabled, loading}: ButtonProps){
  return (
    <Container onPress={onPress} disabled={disabled || loading}>
      {!loading && (
        <Text weight='600' color='#fff'>{title}</Text>
      )}
      {loading && (
        <ActivityIndicator color="#fff"/>
      )}
    </Container>
  );
}
