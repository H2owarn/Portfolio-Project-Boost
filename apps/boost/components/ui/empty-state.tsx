import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Radii, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BoostButton } from '@/components/boost-button';

type EmptyStateProps = {
  icon?: keyof typeof MaterialIcons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function EmptyState({ icon = 'auto-awesome', title, message, actionLabel, onActionPress }: EmptyStateProps) {
  const palette = Colors[useColorScheme() ?? 'dark'];

  return (
    <View style={[styles.container, { backgroundColor: palette.surface }]}> 
      <View style={[styles.iconWrap, { backgroundColor: `${palette.primary}20` }]}> 
        <MaterialIcons name={icon} size={36} color={palette.primary} />
      </View>
      <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
      {message ? <Text style={[styles.message, { color: palette.mutedText }]}>{message}</Text> : null}
      {actionLabel && onActionPress ? (
        <BoostButton label={actionLabel} onPress={onActionPress} fullWidth={false} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: Radii.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  message: {
    fontSize: 13,
    textAlign: 'center',
  },
});

export default EmptyState;

