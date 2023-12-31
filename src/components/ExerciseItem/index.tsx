import {View, Text, Animated, Alert} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

import {WorkoutItemProps} from './types';
import {styles} from './styles';
import {RectButton, Swipeable} from 'react-native-gesture-handler';
import {currentTheme} from '../../styles/theme';

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

export const ExerciseItem = ({
  data,
  handleDelete,
  handleEdit,
}: WorkoutItemProps) => {
  const exercise = data.item;

  const confirmAlert = () =>
    Alert.alert(
      'Are you sure you want to delete this exercise?',
      'This item will be deleted',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => handleDelete?.(exercise.id),
        },
      ]
    );

  const renderRightActions = () => {
    return (
      <>
        {handleDelete && (
          <RectButton style={styles.deleteBtn} onPress={confirmAlert}>
            <AnimatedIcon
              name="trash"
              size={22}
              style={[styles.actionIcon, {transform: [{translateX: 0}]}]}
              color={currentTheme.colors.white}
            />
          </RectButton>
        )}
        {handleEdit && (
          <RectButton
            style={styles.editBtn}
            onPress={() => handleEdit(exercise)}>
            <AnimatedIcon
              name="pencil"
              size={22}
              style={[styles.actionIcon, {transform: [{translateX: 0}]}]}
              color={currentTheme.colors.white}
            />
          </RectButton>
        )}
      </>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      friction={2}
      rightThreshold={0}>
      <View style={styles.container}>
        <View style={styles.exerciseContainer}>
          <Text style={styles.exerciseTitle}>{exercise?.name}</Text>
          <View style={styles.weightContainer}>
            <Text style={styles.exerciseReps}>
              Reps: {exercise.reps || 0} x {exercise.series || 0}
            </Text>
            <Text style={styles.exercisesWeight}>
              Weight: {exercise?.weight}
            </Text>
            {/* {exercise.last_weight < exercise.weight && <Text>Aumentou</Text>} */}
          </View>
        </View>
      </View>
    </Swipeable>
  );
};
