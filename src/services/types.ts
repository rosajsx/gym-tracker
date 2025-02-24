export interface CreateExerciseInput {
  name: string;
  description?: string;
  photo_url?: string;
  exercise_type: string[];
  user_id: string;
}

export interface EditExerciseInput {
  id: string;
  name: string;
  description?: string;
  photo_url?: string;
  exercise_type: string[];
  user_id: string;
}

export interface SelectedExercises {
  id: string;
  reps: string;
  series: string;
}

export interface CreateTrainingInput {
  user_id: string;
  exercise_name: string;
  exercise_observation: string;
  selectedExercises: SelectedExercises[];
}

export interface TrainingDetails {
  id: number;
  name: string;
  observation: string | null;
  created_at: string;
  completed_count: number;
}

export interface TrainingExercises {
  series: number | null;
  reps: string | null;
  id: number;
  exercises: {
    name: string;
  } | null;
}

export interface CompleteTrainingInput {
  id: number;
  completed_count: number;
}

export interface UpdateTrainingInput {
  id: string;
  name?: string;
  observation?: string;
}

export interface UpdateExerciseTrainingInput {
  trainingId: string;
  selectedExercises: SelectedExercises[];
}
