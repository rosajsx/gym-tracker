import {Ionicons} from '@expo/vector-icons';
import {
  StyleSheet,
  Pressable,
  TouchableOpacityProps,
} from 'react-native';
import React, {ComponentProps} from 'react';
import {currentTheme} from '../../styles/theme';

interface IconButtonProps extends TouchableOpacityProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  size?: number;
  color?: keyof typeof currentTheme.colors;
}

export const IconButton = ({
  icon,
  onPress,
  size,
  color,
  style,
  ...rest
}: IconButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      {...rest}
      style={[styles.container, style]}
      hitSlop={{left: 25, top: 25, bottom: 25, right: 25}}>
      <Ionicons
        name={icon}
        size={size || 24}
        color={currentTheme.colors[color!] || 'black'}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
