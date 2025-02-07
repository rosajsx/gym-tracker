import { Container } from '@/src/components/Container';
import { CustomInput } from '@/src/components/CustomInput';
import { ScreenHeader } from '@/src/components/ScreenHeader';

import { Heading } from '@/src/components/ui/heading';
import { Text } from '@/src/components/ui/text';
import { VStack } from '@/src/components/ui/vstack';
import { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { useBottomTab } from '@/src/contexts/bottomTabContext';

import { useAuth } from '@/src/contexts/authContext';
import { Tables } from '@/database.types';
import { getExercises } from '@/src/services/exercises';
import { useCustomToast } from '@/src/hooks/toast';
import { Box } from '@/src/components/ui/box';

import { FlatList } from 'react-native';
import { HStack } from '@/src/components/ui/hstack';
import { ExerciseModal } from '../components/exerciseModal';
import { KeyboardView } from '@/src/components/KeyboardView';
import { SelectedExercisesProps } from '../types';
import {
  getTrainingDetails,
  getTrainingExercises,
  updateExerciseTraining,
  updateTraining,
} from '@/src/services/training';
import { CustomButton } from '@/src/components/CustomButton';

interface EditTrainingTemplateProps {
  id: string;
}

export const EditTrainingTemplate = ({ id }: EditTrainingTemplateProps) => {
  const [name, setName] = useState('');
  const [observation, setObservations] = useState('');
  const [openExerciseSheet, setOpenExerciseSheet] = useState(false);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  const [exercises, setExercises] = useState<Tables<'exercises'>[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercisesProps[]>([]);

  const [trainingHasEditted, setTrainingHasEditted] = useState(false);
  const [exerciseTrainingHasEditted, setExerciseTrainingHasEditted] = useState(false);

  const { session } = useAuth();
  const { isOpen, closeBottomTab } = useBottomTab();
  const { showNewToast } = useCustomToast();

  const isConfirmButtonDisabled = !name || !selectedExercises.length;

  const handleUpdateTraining = async () => {
    try {
      if (trainingHasEditted) {
        await updateTraining({
          id,
          name,
          observation,
        });
      }

      if (exerciseTrainingHasEditted) {
        await updateExerciseTraining({
          selectedExercises,
          trainingId: id,
        });
      }

      showNewToast('Treino atualizado com sucesso!');
      router.push(`/(app)/(tabs)/training/${id}`);
    } catch (error) {
      showNewToast('Ocorreu um erro inesperado ao atualizar o treino');
      console.log('error', error);
    }
  };

  const getData = useCallback(async () => {
    try {
      const trainingDetailsResponse = await getTrainingDetails(id);

      const response = await getTrainingExercises(id);

      const exercises = response?.data?.map(({ exercises, id, reps, series, ...rest }) => ({
        ...rest,
        id: exercises.id,
        name: exercises.name,
        reps: reps || 0,
        series: series || 0,
      }));

      setSelectedExercises(exercises as SelectedExercisesProps[]);
      setName(trainingDetailsResponse.data.name);
      setObservations(trainingDetailsResponse.data.observation || '');

      setIsLoadingExercises(false);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  const fetchExercises = useCallback(async () => {
    try {
      setIsLoadingExercises(true);
      const { data } = await getExercises(session?.user.id!);
      setExercises(data || []);
    } catch (error) {
      showNewToast('Ocorreu um erro inesperado ao buscar os dados dos exercícios');
      console.log('error', error);
    } finally {
      setIsLoadingExercises(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  useFocusEffect(
    useCallback(() => {
      if (isOpen) {
        closeBottomTab();
      }
      fetchExercises();
      getData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchExercises]),
  );

  return (
    <Container animate className="relative flex h-full flex-col">
      <KeyboardView>
        <ScreenHeader title="Editar Treino" />
        <VStack className="mt-4 flex-1 justify-between px-4">
          <VStack space="md">
            <Heading>Informações gerais</Heading>

            <CustomInput
              label="Nome"
              value={name}
              onChangeText={(value) => {
                setTrainingHasEditted(true);
                setName(value);
              }}
            />
            <CustomInput
              label="Observações"
              className="max-h-5 overflow-hidden"
              value={observation}
              onChangeText={(value) => {
                setTrainingHasEditted(true);
                setObservations(value);
              }}
            />

            <Heading>Exercicios</Heading>
            <CustomButton
              text="Adicionar exercicio"
              variant="outline"
              onPress={() => setOpenExerciseSheet(true)}
            />

            <FlatList
              data={selectedExercises}
              keyExtractor={(item) => item.id}
              contentContainerClassName="gap-2 mt-2"
              renderItem={({ item }) => (
                <HStack className="ml-2 items-center" space="md">
                  <Box className="h-3 w-3 rounded-full bg-red-700" />
                  <Text className="text-lg">{item.name}</Text>
                  <Text className="text-lg">Repetições: {item.reps}</Text>
                  <Text className="text-lg">Series: {item.series}</Text>
                </HStack>
              )}
            />
          </VStack>

          <CustomButton
            text="Atualizar"
            action="primary"
            className="mb-10"
            disabled={isConfirmButtonDisabled}
            onPress={handleUpdateTraining}
          />
        </VStack>

        <ExerciseModal
          isOpen={openExerciseSheet}
          handleClose={() => setOpenExerciseSheet(false)}
          exercises={exercises}
          selectedExercises={selectedExercises}
          isLoadingExercises={isLoadingExercises}
          setSelectedExercises={(data) => {
            setExerciseTrainingHasEditted(true);
            setSelectedExercises(data);
          }}
        />
      </KeyboardView>
    </Container>
  );
};
