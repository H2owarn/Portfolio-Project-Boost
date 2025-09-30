import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/screen';
import { MUSCLES, type Muscle } from '@/constants/exercise-data';
import { Colors, Font, Radii, Shadow, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ExercisesScreen() {
	const router = useRouter();
	const palette = Colors[useColorScheme() ?? 'dark'];

	const handleMusclePress = (muscle: Muscle) => {
		router.push(`/(tabs)/exercises/${muscle.id}` as const);
	};

	const renderMuscleCard = ({ item }: { item: Muscle }) => (
		<Pressable
			style={[styles.muscleCard, { backgroundColor: palette.surface }]}
			onPress={() => handleMusclePress(item)}
			android_ripple={{ color: palette.primary + '20' }}
		>
			<View style={[styles.cardIcon, { backgroundColor: palette.primary + '20' }]}>
				<MaterialIcons name={item.icon as any} size={32} color={palette.primary} />
			</View>
			<Text style={[styles.cardTitle, { color: palette.text }]}>{item.name}</Text>
		</Pressable>
	);

	return (
		<Screen scrollable={false} contentStyle={styles.container}>
			<View style={styles.header}>
				<Text style={[styles.title, { color: palette.text }]}>Choose Muscle Group</Text>
				<Text style={[styles.subtitle, { color: palette.mutedText }]}>Select a muscle group to see exercises</Text>
			</View>

			<FlatList
				data={MUSCLES}
				renderItem={renderMuscleCard}
				keyExtractor={(item) => item.id}
				numColumns={2}
				columnWrapperStyle={styles.row}
				contentContainerStyle={styles.grid}
				showsVerticalScrollIndicator={false}
			/>
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: Spacing.lg,
		paddingTop: Spacing.lg
	},
	header: {
		alignItems: 'center',
		marginBottom: Spacing.xl,
		gap: Spacing.sm
	},
	title: Font.title,
	subtitle: Font.subTitle,
	grid: {
		gap: Spacing.md
	},
	row: {
		justifyContent: 'space-between'
	},
	muscleCard: {
		flex: 1,
		marginHorizontal: Spacing.sm,
		padding: Spacing.lg,
		borderRadius: Radii.md,
		alignItems: 'center',
		gap: Spacing.sm,
		minHeight: 120,
		justifyContent: 'center',
		...Shadow.card
	},
	cardIcon: {
		width: 56,
		height: 56,
		borderRadius: Radii.md,
		justifyContent: 'center',
		alignItems: 'center'
	},
	cardTitle: {
		fontSize: 16,
		fontWeight: '600',
		textAlign: 'center'
	}
});
