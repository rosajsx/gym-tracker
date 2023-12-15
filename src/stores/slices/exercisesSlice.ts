import {StateCreator} from 'zustand';
import {Exercise} from '../../types/exercises';
import {deleteExercise, listExercises} from '../../services';
import Toast from 'react-native-root-toast';
import {GlobalLoadingSlice} from './globalLoadingSlice';

export interface ExercisesSlice {
  exercises: Exercise[];
  isExercisesLoading: boolean;

  startExercisesLoading: () => void;
  finishExercisesLoading: () => void;

  getExercises: (isUpdate?: boolean) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;
}

export const createExercisesSlice: StateCreator<
  ExercisesSlice & GlobalLoadingSlice,
  [],
  [],
  ExercisesSlice
> = (set, get) => ({
  exercises: [],
  isExercisesLoading: false,

  startExercisesLoading: () => set(() => ({isExercisesLoading: true})),
  finishExercisesLoading: () => set(() => ({isExercisesLoading: false})),

  getExercises: async isUpdate => {
    try {
      if (!isUpdate) get().startExercisesLoading();

      const exercises = await listExercises();
      set(() => ({exercises}));
    } catch (error) {
      console.log(error);
      Toast.show('Something is wrong!');
      if (error instanceof Error) Toast.show(error.message);
    } finally {
      if (!isUpdate) get().finishExercisesLoading();
    }
  },

  deleteExercise: async id => {
    try {
      get().startLoading();

      await deleteExercise(id);
      await get().getExercises(true);
      Toast.show('Exercise deleted!');
    } catch (error) {
      console.log(error);
      Toast.show('Something is wrong!');
      if (error instanceof Error) Toast.show(error.message);
    } finally {
      get().finishLoading();
    }
  },
});
