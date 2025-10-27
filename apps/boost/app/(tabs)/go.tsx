import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Font, Radii, Spacing } from '@/constants/theme';
import AvatarBody from '@/components/avatar_parts/AvatarBody';
import { musclesBack } from '@/components/avatar_parts/musclesBack';
import { musclesFront } from '@/components/avatar_parts/musclesFront';
import { color } from 'bun';
import { playPreloaded, playSound } from "@/utils/sound";

const { width: screenWidth } = Dimensions.get('window');
const musclesPages = [musclesFront, musclesBack];
{
	/* Muscle and page tracking*/
}
export default function AvatarScreen() {
	const router = useRouter();
	const palette = Colors[useColorScheme() ?? 'dark'];

	const [selectedMuscles, setSelectedMuscles] = useState<{ [page: number]: string[] }>({});

	const handleMusclePress = (uniqueId: string, page: number) => {
		setSelectedMuscles((prev) => {
			const pageMuscles = prev[page] || [];
			const isSelected = pageMuscles.includes(uniqueId);
			return {
				...prev,
				[page]: isSelected ? pageMuscles.filter((id) => id !== uniqueId) : [...pageMuscles, uniqueId]
			};
		});
	};
	{
		/* Routing for next page*/
	}
	const handleContinue = async () => {
		try {
			// Play a sound before navigating
			await playPreloaded('enter'); // or 'click', 'complete', etc.
		} catch {
			// fallback if not preloaded
			await playSound(require('@/assets/sound/entering.wav'));
		}

		router.push({
			pathname: '/screens/ExercisesScreen',
			params: { selectedMuscles: JSON.stringify(selectedMuscles) },
		});
		};

	return (
		<View style={[styles.container, {backgroundColor: palette.background}]}>
			<View style={styles.avatarWrapper}>
				<AvatarBody fill="#161515af" width={500} height={500} style={{ marginTop: 20 }} />
				{/* Muscle swap view*/}
				<ScrollView
					horizontal
					pagingEnabled
					scrollEventThrottle={16}
					showsHorizontalScrollIndicator={false}
					style={styles.musclesWrapper}
				>
					{/* Muscle select settings*/}
					{musclesPages.map((muscles, page) => (
						<View key={page} style={{ width: 500, height: 500 }}>
							{muscles.map(({ Component, name, top, left, width, height, z }, index) => {
								const uniqueId = `${name}-${index}`;
								const isSelected = selectedMuscles[page]?.includes(uniqueId);
								return (
									<TouchableOpacity
										key={index}
										activeOpacity={0.7}
										style={{ position: 'absolute', top, left, zIndex: z }}
										onPress={ async () => {
											try {
												await playPreloaded("click");
											} catch {
												await playSound(require("@/assets/sound/tap.wav"));
											}
											handleMusclePress(uniqueId, page)}}
									>
										<Component width={width} height={height} fill={isSelected ? '#37d137' : '#fcfcfc91'} />
									</TouchableOpacity>
								);
							})}
						</View>
					))}
				</ScrollView>
			</View>

			<View style={[styles.seemore, {marginTop: 20, backgroundColor: palette.primary, }]}>
				<Button title="Start a workout!" onPress={handleContinue} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatarWrapper: {
		position: 'relative',
		width: 500,
		height: 500,
		alignItems: 'center',
		justifyContent: 'center'
	},
	musclesWrapper: {
		position: 'absolute',
		top: 0,
		left: 0
	},
	seemore: {
		padding: Spacing.sm,
		borderRadius: Radii.md,
		gap: Spacing.sm,
	}
});
