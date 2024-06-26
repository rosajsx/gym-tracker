import {WorkoutListProps} from './types';
import {FlatList} from 'react-native-gesture-handler';
import {WorkoutItem} from './WorkoutItem';
import {memo} from 'react';
import {RefreshControl} from 'react-native';
import {useStore} from '../../stores';
import {useShallow} from 'zustand/react/shallow';
import {currentTheme} from '../../styles/theme';

const WorkoutListComponent = ({workouts}: WorkoutListProps) => {
  const {getWorkouts, isRefreshing} = useStore(
    useShallow(state => ({
      isRefreshing: state.isWorkoutsRefreshing,
      getWorkouts: state.getWorkouts,
    }))
  );

  return (
    <FlatList
      data={workouts}
      keyExtractor={(item, index) => `${item.name}__${index}`}
      showsVerticalScrollIndicator={false}
      renderItem={data => <WorkoutItem workout={data.item} />}
      contentContainerStyle={{paddingBottom: 20}}
      ListHeaderComponentStyle={{
        borderWidth: 1,
      }}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={async () => {
            await getWorkouts('refresh');
          }}
          enabled={true}
          title={isRefreshing ? 'Refreshing' : 'Pull to Refresh'}
          tintColor={currentTheme.colors.primary}
          titleColor={currentTheme.colors.primary}
          colors={[currentTheme.colors.primary]}
        />
      }
    />
  );
};

export const WorkoutList = memo(WorkoutListComponent);
