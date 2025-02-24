import { Button, ButtonIcon } from '@/src/components/ui/button';
import { Heading } from '@/src/components/ui/heading';
import { Text } from '@/src/components/ui/text';
import { HStack } from '@/src/components/ui/hstack';
import { router } from 'expo-router';
import { MoveLeft } from 'lucide-react-native';
import { Show } from './Show';
import { VStack } from './ui/vstack';
import clsx from 'clsx';
import { ReactNode } from 'react';

interface ScreenHeaderProps {
  title: string;
  description?: string;
  canGoBack?: boolean;
  goBackRoute?: string;
  containerClassname?: string;
  rightComponent?: ReactNode;
  goBackCallback?: () => void;
}

export function ScreenHeader({
  title,
  canGoBack = true,
  goBackRoute,
  description,
  containerClassname,
  rightComponent,
  goBackCallback,
}: ScreenHeaderProps) {
  return (
    <HStack
      className={clsx('z-50 items-center justify-between bg-slate-800 px-5', containerClassname)}
    >
      <Show when={canGoBack}>
        <Button
          className="z-40"
          variant="link"
          onPress={() => {
            goBackCallback?.();
            if (goBackRoute) {
              router.navigate(goBackRoute as any);
            } else {
              router.back();
            }
          }}
          size="xl"
        >
          <ButtonIcon as={MoveLeft} size="xl" />
        </Button>
      </Show>

      <VStack className="mx-auto w-full items-center">
        <Heading>{title}</Heading>
        {description && <Text>{description}</Text>}
      </VStack>

      {rightComponent}
    </HStack>
  );
}
