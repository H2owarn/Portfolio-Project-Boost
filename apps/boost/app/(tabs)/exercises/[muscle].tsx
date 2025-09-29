import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/screen';
import { type Exercise, getExercisesForMuscle, getMuscleById } from '@/constants/exercise-data';
import { Colors, Font, Radii, Shadow, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function MuscleExercisesScreen() {
	const { muscle } = useLocalSearchParams<{ muscle: string }>();
	const palette = Colors[useColorScheme() ?? 'dark'];

	const selectedMuscle = getMuscleById(muscle);
	const exercises = getExercisesForMuscle(muscle);

	if (!selectedMuscle) {
		return (
			<Screen scrollable={false} contentStyle={styles.container}>
				<View style={styles.errorContainer}>
					<MaterialIcons name="error-outline" size={48} color={palette.mutedText} />
					<Text style={[styles.errorText, { color: palette.mutedText }]}>Muscle group not found</Text>
				</View>
			</Screen>
		);
	}

	const renderExerciseCard = ({ item }: { item: Exercise }) => (
		<Pressable
			style={[styles.exerciseCard, { backgroundColor: palette.surface }]}
			android_ripple={{ color: palette.primary + '20' }}
			onPress={() => {
				// Future: Navigate to exercise detail or start workout
				console.log('Selected exercise:', item.name);
			}}
		>
			<View style={styles.cardContent}>
				<View style={styles.cardHeader}>
					<View style={[styles.exerciseIcon, { backgroundColor: palette.primary + '20' }]}>
						<MaterialIcons name="fitness-center" size={24} color={palette.primary} />
					</View>
					<View style={styles.exerciseInfo}>
						<Text style={[styles.exerciseName, { color: palette.text }]}>{item.name}</Text>
						<Text style={[styles.exerciseDescription, { color: palette.mutedText }]}>{item.description}</Text>
					</View>
				</View>

				<View style={styles.exerciseSpecs}>
					{item.sets && (
						<View style={[styles.specBadge, { backgroundColor: palette.primary + '10' }]}>
							<Text style={[styles.specText, { color: palette.primary }]}>{item.sets} sets</Text>
						</View>
					)}
					{item.reps && (
						<View style={[styles.specBadge, { backgroundColor: palette.primary + '10' }]}>
							<Text style={[styles.specText, { color: palette.primary }]}>{item.reps} reps</Text>
						</View>
					)}
					{item.duration && (
						<View style={[styles.specBadge, { backgroundColor: palette.primary + '10' }]}>
							<Text style={[styles.specText, { color: palette.primary }]}>{item.duration}</Text>
						</View>
					)}
				</View>
			</View>
		</Pressable>
	);

	return (
		<Screen scrollable={false} contentStyle={styles.container}>
			<View style={styles.header}>
				<Text style={[styles.title, { color: palette.text }]}>{selectedMuscle.name} Exercises</Text>
				<Text style={[styles.subtitle, { color: palette.mutedText }]}>
					{exercises.length} exercise{exercises.length !== 1 ? 's' : ''} available
				</Text>
			</View>

			<FlatList
				data={exercises}
				renderItem={renderExerciseCard}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.list}
				showsVerticalScrollIndicator={false}
			/>
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: Spacing.lg
	},
	header: {
		alignItems: 'center',
		marginBottom: Spacing.xl,
		gap: Spacing.sm
	},
	title: Font.title,
	subtitle: Font.subTitle,
	list: {
		gap: Spacing.md,
		paddingHorizontal: Spacing.lg
	},
	exerciseCard: {
		padding: 16,
		borderRadius: Radii.lg,
		...Shadow.card
	},
	cardContent: {
		gap: 12
	},
	cardHeader: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: 12
	},
	exerciseIcon: {
		width: 40,
		height: 40,
		borderRadius: Radii.sm,
		justifyContent: 'center',
		alignItems: 'center'
	},
	exerciseInfo: {
		flex: 1,
		gap: 4
	},
	exerciseName: {
		fontSize: 18,
		fontWeight: '600'
	},
	exerciseDescription: {
		fontSize: 14,
		lineHeight: 20
	},
	exerciseSpecs: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8
	},
	specBadge: {
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: Radii.sm
	},
	specText: {
		fontSize: 12,
		fontWeight: '500'
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		gap: 16
	},
	errorText: {
		fontSize: 16,
		fontWeight: '500'
	}
});
