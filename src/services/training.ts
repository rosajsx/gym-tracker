import { Tables } from '@/database.types';
import { supabaseClient } from './supabase';
import { CreateTrainingInput } from './types';

export const getTrainings = async (userId: string) => {
  return supabaseClient
    .from('training')
    .select()
    .eq('user_id', userId)
    .returns<Tables<'training'>[]>()
    .throwOnError();
};

export const createTraining = async ({
  user_id,
  exercise_name,
  exercise_observation,
  selectedExercises,
}: CreateTrainingInput) => {
  const training = await supabaseClient
    .from('training')
    .upsert({
      name: exercise_name,
      observation: exercise_observation,
      user_id: user_id,
    })
    .select()
    .single()
    .throwOnError();

  if (training.data) {
    const training_id = training.data.id;
    const exercise_training_data = selectedExercises.map(({ id, series, ...rest }) => ({
      exercise_id: Number(id),
      series: Number(series),
      training_id,
      annotation: '',
    }));

    await supabaseClient.from('exercises_training').insert(exercise_training_data).throwOnError();

    return training_id;
  } else {
    throw new Error('Training not created');
  }
};
