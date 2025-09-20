import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Radii, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type BoostButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
};

export function BoostButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  fullWidth = true,
  disabled = false,
}: BoostButtonProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const palette = Colors[colorScheme];

  const styles = createStyles(palette, variant, fullWidth, disabled);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [styles.button, pressed && !disabled && { opacity: 0.8 }]}
      disabled={disabled}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const createStyles = (
  palette: (typeof Colors)['light'],
  variant: ButtonVariant,
  fullWidth: boolean,
  disabled: boolean,
) => {
  const base = {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Radii.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    gap: Spacing.sm,
  } as const;

  const variants: Record<ButtonVariant, { backgroundColor: string; borderColor?: string; textColor: string }>
    = {
      primary: {
        backgroundColor: disabled ? '#14532d' : palette.primary,
        textColor: '#000000',
      },
      secondary: {
        backgroundColor: palette.surface,
        textColor: palette.text,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: '#374151',
        textColor: palette.mutedText,
      },
    };

  const selected = variants[variant];

  return StyleSheet.create({
    button: {
      ...base,
      width: fullWidth ? '100%' : undefined,
      backgroundColor: selected.backgroundColor,
      borderWidth: selected.borderColor ? 1 : 0,
      borderColor: selected.borderColor,
      opacity: disabled ? 0.6 : 1,
    },
    label: {
      color: selected.textColor,
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    icon: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};
