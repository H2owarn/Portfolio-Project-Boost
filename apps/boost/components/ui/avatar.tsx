import { MaterialIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AvatarProps = {
  uri?: string | null;
  name?: string | null;
  seed?: string | null;
  size?: number; // px
  level?: number; // for ring styling
  ring?: boolean;
  style?: ViewStyle;
};

function getInitials(name?: string | null) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
  return (first + last).toUpperCase();
}

export function Avatar({ uri, name, seed, size = 64, level, ring = true, style }: AvatarProps) {
  const palette = Colors[useColorScheme() ?? 'dark'];
  const [imgError, setImgError] = useState(false);

  const initials = useMemo(() => getInitials(name), [name]);
  const showImage = !!uri && !imgError;

  // Ring color by level tiers (keeps green/black theme; uses warning as milestone)
  const ringColor = useMemo(() => {
    if (!ring) return 'transparent';
    if (typeof level !== 'number') return palette.borderColor;
    if (level >= 35) return palette.warning; // milestone
    if (level >= 10) return palette.primary;
    return palette.borderColor;
  }, [ring, level, palette]);

  const dimension = { width: size, height: size, borderRadius: size / 2 } as const;

  return (
    <View
      style={[
        styles.wrapper,
        { borderColor: ringColor, borderWidth: ring ? 2 : 0, padding: ring ? Math.max(Math.round(size * 0.03), 2) : 0, borderRadius: (size + 4) / 2 },
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel={name ? `Avatar of ${name}` : 'Avatar'}
    >
      {showImage ? (
        <Image
          source={{ uri: uri! }}
          style={[dimension, styles.image]}
          onError={() => setImgError(true)}
        />
      ) : initials ? (
        <View style={[dimension, styles.fallback, { backgroundColor: `${palette.secondary}20` }]}> 
          <Text style={[styles.initials, { color: palette.text, fontSize: Math.round(size * 0.36) }]}>{initials}</Text>
        </View>
      ) : (
        <View style={[dimension, styles.fallback, { backgroundColor: `${palette.primary}20` }]}> 
          <MaterialIcons name="person" size={Math.round(size * 0.5)} color={palette.secondary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  image: {
    resizeMode: 'cover',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '700',
  },
});

export default Avatar;

