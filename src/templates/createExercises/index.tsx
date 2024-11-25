import { Tables } from '@/database.types';
import { Container } from '@/src/components/Container';
import { ScreenHeader } from '@/src/components/ScreenHeader';

import { Button, ButtonText } from '@/src/components/ui/button';

import { Input, InputField } from '@/src/components/ui/input';
import { Text } from '@/src/components/ui/text';
import { Textarea, TextareaInput } from '@/src/components/ui/textarea';
import { VStack } from '@/src/components/ui/vstack';
import { createExercise, getExerciseTypes } from '@/src/services/exercises';
import { router, useFocusEffect } from 'expo-router';
import React from 'react';
import { useCallback, useState } from 'react';
import { TypesField } from './typesField';
import { ConfirmAlert } from '@/src/components/ConfirmAlert';
import { useAuth } from '@/src/contexts/authContext';

//! ADD FEEDBACK WHEN EXERCISE IS CREATED
//! ADD ERROR FEEDBACK WHEN THERE ARE SOME ERROR

export function CreateExerciseTemplate() {
  const [types, setTypes] = useState<Tables<'exercises_types'>[] | null>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);

  const [hasErrorOnTypes, setHasErrorOnTypes] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const [exerciseName, setExerciseName] = useState('');
  const [exerciseDescription, setExerciseDescription] = useState('');
  const [exercisePhotoUrl, setExercisePhotoUrl] = useState('');

  const [showConfirmAlert, setShowConfirmAlert] = useState(false);

  const { session } = useAuth();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          setHasErrorOnTypes(false);
          setIsLoadingTypes(true);

          const response = await getExerciseTypes();
          setTypes(response.data);
        } catch (error) {
          console.log(error);
          setHasErrorOnTypes(true);
        } finally {
          setIsLoadingTypes(false);
        }
      })();
    }, []),
  );

  const onConfirm = async () => {
    try {
      const exercise_type = types
        ?.map((type) => {
          if (selectedTypes.includes(type.name)) {
            return type.id;
          }
        })
        .filter((item) => !!item);

      await createExercise({
        exercise_type: exercise_type as string[],
        name: exerciseName,
        user_id: session?.user.id!,
        photo_url: exercisePhotoUrl,
        description: exerciseDescription,
      });

      router.navigate('/(app)/exercises');
    } catch (error) {
      console.log('deu erro tio', error);
    }
  };

  return (
    <Container className="flex h-full flex-col" animate>
      <ScreenHeader title="Criar exercicios" />

      <VStack className="flex-1 justify-between px-5 pt-6">
        <VStack space="xl">
          <VStack className="gap-2">
            <Text className="text-bold text-lg text-white">Nome*</Text>
            <Input variant="outline" size="xl" className="rounded-xl">
              <InputField
                placeholder="Digite o nome do exercicio"
                value={exerciseName}
                onChangeText={setExerciseName}
              />
            </Input>
          </VStack>
          <VStack className="gap-2">
            <Text className="text-bold text-lg text-white">Descrição</Text>
            <Textarea size="xl" className="rounded-xl">
              <TextareaInput
                placeholder="Digite o nome do exercicio"
                value={exerciseDescription}
                onChangeText={setExerciseDescription}
              />
            </Textarea>
          </VStack>
          <VStack className="gap-2">
            <Text className="text-bold text-lg text-white">URL Foto</Text>
            <Input variant="outline" size="xl" className="rounded-xl">
              <InputField
                placeholder="Adicione a URL da foto do exercicio"
                value={exercisePhotoUrl}
                onChangeText={setExercisePhotoUrl}
              />
            </Input>
          </VStack>
          <TypesField
            types={types}
            setSelectedTypes={setSelectedTypes}
            selectedTypes={selectedTypes}
            isLoading={isLoadingTypes}
            hasError={hasErrorOnTypes}
          />
        </VStack>
        <Button
          className="mb-10 w-full rounded-xl bg-red-700 disabled:opacity-75"
          size="xl"
          onPress={() => setShowConfirmAlert(true)}
          disabled={!exerciseName || !selectedTypes.length}
        >
          <ButtonText className="text-white">Criar</ButtonText>
        </Button>
      </VStack>

      <ConfirmAlert
        title="Tem certeza que deseja criar este treino?"
        onClose={() => setShowConfirmAlert(false)}
        isOpen={showConfirmAlert}
        onConfirm={onConfirm}
        confirmText="Criar"
        cancelText="Cancelar"
      />
    </Container>
  );
}
