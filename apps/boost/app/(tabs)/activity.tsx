import { Image, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { BoostButton } from '@/components/boost-button';
import { Screen } from '@/components/layout/screen';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const activityStats = [
  {
    id: 'steps',
    label: 'step',
    value: '6000',
    action: 'Walk',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAn7yyh3_XrXxDxvhY6q8V13GzBE1HwaEl_maHOEbolaSpx2y-vsOAcDdbmoHG4yC-c267kaJOuHW1Jhy5LwSMTZCufE4Kl-iE7juJSVYbf0z2QiGfwdujQ1EYA1DRWO6T7s5kFuMiFOcbeyRjmit-nc6HPZXzlqbPI7kqdyo15bQeSws-k1w-kzNrXu9vtBNFuOAMwrD6UxbGh0q2_HyIUvxFtKEc_4sYH3PatOLeJ0ykFG7RhRlAVg39ErEBMsAlIrbjySg_gzX_K',
  },
  {
    id: 'run',
    label: 'km',
    value: '2.0',
    action: 'Run',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCrshNTUlIJAEjQCUuxqscdbHAfWfWfE7nBNlBzp3rdYRfXkQC5gIR8VDnD7xYt1N-YQ1CGe8lVoD7VzsxFfHG8jl-a8lOrv9Ez5q5Zmz5cZ9afCQR-VYIZvkvpy9oke5GWN4M1vycERJ7TaOVVTk2iM8haNQGCJh2La1x2arRa6Z3Q5qyicFFjtIY6ek5q48QRH3UX4f5bmD6CUx4vCZhB__686-LRP1OYiJz9uTx6HxMf6dVhT2CpXPx1sSlwqfRJIHceG1GC6boQ',
  },
  {
    id: 'bike',
    label: 'km',
    value: '0.0',
    action: 'Bike',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCWPjizwixo0v8ZcAYwvG1NLZUI3T2hXEp-7MFiZn6ALjjRIW6JL9HbwyaOyays2xXHQWx-ihmXUVqjKl4KLf3D00hW4fGfDdrfmLLJAkY3jePcDRMm6O1nFK5cDVZCi6zU5ncQee2Ik1vEAx-tCpznlIpO5sgw9vP6U3TTVYpNyzi6iGaGd282xWu5P5N5kUPX7MVAdO4k9hpHf66RCPwgMhmStXVMjqGLmVI8lJ0oqxhU6hn7bkcyRN8DmQ87Ljk4VLJeULNxEbdc',
  },
];

const categories = ['Strength', 'Cardio', 'Yoga', 'Meditation'];

const featured = [
  {
    id: 'strength',
    title: 'Train with live-action images',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBHcpxmJ2qz4e5H0FLBaPEi-m1bsm1xSKnmGTwbedYrq88Cll-sHeHb4SqlSiisJy3cORYsThJwWF0nBAqVeFndK8YKfTE46RmsrrrVPVpvTg3mZeutPAyUXlycSEpll3x7PweMuQS9u3zAF_afdwV7AkAEeZCIKxb7ReFz4UNcq-Ak1DEGpb-tK9g3VP_MDBiS813YQCiCDLkurUKnyMGaYOpAr39BnBTjKMuNJlpvjSj5ygT-CsC5O3uxTEyCP9GwQ1yDWKNI1TsS',
  },
  {
    id: 'stretch',
    title: 'Stretch your back and hips',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPnc5fjI69W5nafZCvwpDXE-8homiSyGvhDx73BQKMOTjUgjte_t9xTbCZjrdBNrBPGcqIJGmSr1t9r__pfDyPSo8nq83jm5EoP-RnSy3fviw02KKsZeQ_oiZ2JVWR9VV78x6xms0wrpy97NATJOfv973U0tWo1zaIoKHcqde8UDyM86BbELCPy5WoQGhuHTOwiEU95FpnSu1-2ByzcspDX3jkSl9IFyZx07xZWlcr6pdbLQUakr-CncDC9j7mpPTvzxvjU5dMAyxj',
  },
];

export default function ActivityTabScreen() {
  const palette = Colors[useColorScheme() ?? 'dark'];

  return (
    <Screen contentStyle={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="menu" size={24} color={palette.text} />
        <Text style={[styles.brand, { color: palette.primary }]}>Boost</Text>
        <MaterialIcons name="person" size={24} color={palette.text} />
      </View>

      <Text style={[styles.sectionTitle, { color: palette.text }]}>Recent Activity</Text>

      <View style={styles.statsGrid}>
        {activityStats.map((stat) => (
          <View key={stat.id} style={[styles.statCard, { backgroundColor: palette.surface }]}>
            <Image source={{ uri: stat.image }} style={styles.statImage} />
            <Text style={[styles.statValue, { color: palette.text }]}>
              {stat.value}
              <Text style={styles.statUnit}>{` ${stat.label}`}</Text>
            </Text>
            <BoostButton label={stat.action} onPress={() => {}} fullWidth={false} variant="secondary" />
          </View>
        ))}
      </View>

      <View style={styles.categoryRow}>
        {categories.map((category, index) => (
          <Text
            key={category}
            style={[
              styles.category,
              index === 0
                ? { color: palette.primary, borderBottomColor: palette.primary }
                : { color: palette.mutedText },
            ]}>
            {category}
          </Text>
        ))}
      </View>

      <View style={styles.featuredList}>
        {featured.map((item) => (
          <View key={item.id} style={styles.featuredCard}>
            <Image source={{ uri: item.image }} style={styles.featuredImage} />
            <View style={styles.featuredOverlay} />
            <Text style={styles.featuredTitle}>{item.title}</Text>
            <View style={[styles.featuredAccent, { backgroundColor: palette.primary }]} />
          </View>
        ))}
      </View>

      <View style={[styles.footer, { borderTopColor: '#1F2937' }]}>
        <MaterialIcons name="directions-run" size={28} color={palette.primary} />
        <MaterialIcons name="share" size={28} color={palette.mutedText} />
        <MaterialIcons name="star" size={28} color={palette.mutedText} />
        <MaterialIcons name="calendar-today" size={28} color={palette.mutedText} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontSize: 28,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: Radii.lg,
    padding: 16,
    gap: 12,
    alignItems: 'center',
  },
  statImage: {
    width: 48,
    height: 48,
    borderRadius: Radii.md,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statUnit: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  featuredList: {
    gap: Spacing.md,
  },
  featuredCard: {
    borderRadius: Radii.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: 160,
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  featuredTitle: {
    position: 'absolute',
    left: 16,
    bottom: 24,
    right: 16,
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  featuredAccent: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    width: 32,
    height: 4,
    borderRadius: Radii.pill,
  },
  footer: {
    borderTopWidth: 1,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
