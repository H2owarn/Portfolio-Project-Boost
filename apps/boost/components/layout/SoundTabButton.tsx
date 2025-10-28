import React from 'react';
import { Pressable, type GestureResponderEvent } from 'react-native';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { playPreloaded, playSound } from '@/utils/sound';
import type { SoundName } from '@/utils/sound';

export function SoundTabButton({
  onPress,
  onLongPress,
  accessibilityState,
  children,
  sound = 'click',
}: BottomTabBarButtonProps & { sound?: SoundName }) {
  const handlePress = async (e: GestureResponderEvent) => {
    try {
      await playPreloaded(sound);
    } catch {
      await playSound(require('@/assets/sound/tap.wav'));
    }
    onPress?.(e);
  };

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={onLongPress}
      accessibilityState={accessibilityState}
      accessibilityRole="button"
    >
      {children}
    </Pressable>
  );
}
