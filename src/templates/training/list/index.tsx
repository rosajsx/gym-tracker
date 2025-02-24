import { Container } from '@/src/components/Container';
import { Loading } from '@/src/components/Loading';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { Card } from '@/src/components/ui/card';
import { Center } from '@/src/components/ui/center';
import { Fab, FabIcon } from '@/src/components/ui/fab';
import { Heading } from '@/src/components/ui/heading';
import { Text } from '@/src/components/ui/text';
import { useAuth } from '@/src/contexts/authContext';
import { useBottomTab } from '@/src/contexts/bottomTabContext';
import { getTrainings } from '@/src/services/training';
import { useQuery } from '@tanstack/react-query';
import { router, useFocusEffect } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useCallback } from 'react';
import { FlatList, RefreshControl, TouchableWithoutFeedback } from 'react-native';
import Animated, { Easing, FadeIn, FadeOut } from 'react-native-reanimated';
import colors from 'tailwindcss/colors';

export default function TrainingTemplate() {
  const { session } = useAuth();
  const { isOpen, openBottomTab } = useBottomTab();

  const { data, status, isFetching, refetch, isRefetching } = useQuery({
    queryKey: ['trainings', session?.user?.id!],
    queryFn: () => getTrainings(session?.user?.id!),
  });

  const fetchWorkouts = useCallback(
    async (state: 'loading' | 'refreshing' = 'loading') => {
      try {
        setListState(state);
        const response = await getTrainings(session?.user?.id!);
        setData(response.data || []);
        setListState('loaded');
      } catch (error) {
        console.log(error);
        setListState('error');
      }
    },
    [session?.user?.id],
  );

  useFocusEffect(
    useCallback(() => {
      // fetchWorkouts();
      if (!isOpen) openBottomTab();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchWorkouts]),
  );

  return (
    <Container animate className="h-full max-h-[88%]">
      {status === 'pending' && <Loading />}

      {status === 'error' && (
        <Center className="h-full w-full">
          <Text className="px-10 text-center">
            Ocorreu um erro inesperado ao recuperar os dados. Por favor, tente novamente
          </Text>
        </Center>
      )}
      {(status === 'success' || isFetching) && (
        <Animated.View
          className="h-full"
          entering={FadeIn.duration(300).easing(Easing.inOut(Easing.quad))}
          exiting={FadeOut.duration(300).easing(Easing.inOut(Easing.quad))}
        >
          <FlatList
            data={data?.data}
            keyExtractor={(item) => item.id.toString()}
            contentContainerClassName="px-4 gap-4 h-[95%]"
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                colors={[colors.red['700']]}
                tintColor={colors.red['700']}
                title="Carregando..."
              />
            }
            ListHeaderComponent={
              <ScreenHeader
                title="Treinos"
                description="O que vamos treinar hoje?"
                canGoBack={false}
                containerClassname="pt-3"
              />
            }
            ListEmptyComponent={
              <Center className="h-full w-full">
                <Heading className="px-10 text-center">
                  Você não possui treinos criados no momento
                </Heading>
              </Center>
            }
            renderItem={({ item }) => {
              return (
                <TouchableWithoutFeedback
                  className="border"
                  onPress={() => router.navigate(`/(app)/training/${item.id}` as never)}
                >
                  <Card className="bg-slate-700">
                    <Heading>{item.name}</Heading>
                  </Card>
                </TouchableWithoutFeedback>
              );
            }}
          />
          <Fab
            size="lg"
            placement="bottom right"
            className="bg-red-700 active:bg-red-500"
            onPress={() => router.navigate('/(app)/training/create')}
          >
            <FabIcon as={Plus} className="text-white" />
          </Fab>
        </Animated.View>
      )}
    </Container>
  );
}
