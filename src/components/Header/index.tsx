import {Text, View} from 'react-native';
import {IconButton} from '../IconButton';

import {styles} from './styles';
import {HeaderProps} from './types';

export const Header = ({
  title,
  subTitle,
  enableGoBack,
  onGoBackPress,
  onBackAreDisabled,
  rightComponent,
  isLoading,
}: HeaderProps) => {
  return (
    <View style={styles.container}>
      {enableGoBack && !isLoading && (
        <IconButton
          icon="arrow-back"
          style={[onBackAreDisabled && styles.disabledIconBtn]}
          color="text"
          onPress={onGoBackPress}
          disabled={onBackAreDisabled}
        />
      )}

      <View style={[styles.header]}>
        <Text style={styles.headerTitle}>{title}</Text>
        {!!subTitle && <Text style={styles.headerSubtitle}>{subTitle}</Text>}
      </View>

      {rightComponent && !isLoading && rightComponent}
    </View>
  );
};
