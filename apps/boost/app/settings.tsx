import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Screen } from '@/components/layout/screen';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const links = [
  { id: 'profile', label: 'My Profile', icon: 'person-outline' },
  { id: 'favorites', label: 'My Favorites', icon: 'favorite-border' },
  { id: 'general', label: 'General Settings', icon: 'tune' },
];

export default function SettingsScreen() {
  const palette = Colors[useColorScheme() ?? 'dark'];

  return (
    <Screen contentStyle={styles.container}>
      <View style={styles.avatar}>
        <View style={[styles.avatarCircle, { borderColor: palette.primary }]} />
      </View>
      <Text style={[styles.name, { color: palette.text }]}>Thomas</Text>
      <View style={styles.links}>
        {links.map((link) => (
          <View key={link.id} style={styles.linkRow}>
            <MaterialIcons name={link.icon as keyof typeof MaterialIcons.glyphMap} size={22} color={palette.primary} />
            <Text style={[styles.linkLabel, { color: palette.text }]}>{link.label}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.lg,
    paddingBottom: 120,
  },
  avatar: {
    marginTop: 40,
  },
  avatarCircle: {
    width: 112,
    height: 112,
    borderRadius: Radii.pill,
    borderWidth: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
  },
  links: {
    width: '100%',
    gap: Spacing.lg,
    marginTop: Spacing.lg,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  linkLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
});
