import { useRouter } from "expo-router";
import React, { useState, useEffect, useRef} from "react";
import {Button, Dimensions, ScrollView, StyleSheet, TouchableOpacity, View, Alert, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors, Font, Radii, Spacing } from "@/constants/theme";
import AvatarBody from "@/components/avatar_parts/AvatarBody";
import { musclesBack } from "@/components/avatar_parts/musclesBack";
import { musclesFront } from "@/components/avatar_parts/musclesFront";
import { playPreloaded, playSound } from "@/utils/sound";
import { LevelUpArrows } from "@/components/animation/LevelUpArrows";

const { width: screenWidth } = Dimensions.get("window");
const musclesPages = [musclesFront, musclesBack];


export default function AvatarScreen() {
  const router = useRouter();
  const palette = Colors[useColorScheme() ?? "dark"];
  
  const [selectedMuscles, setSelectedMuscles] = useState<{
    [page: number]: string[];
  }>({});

  const handleMusclePress = (uniqueId: string, page: number) => {
    setSelectedMuscles((prev) => {
      const pageMuscles = prev[page] || [];
      const isSelected = pageMuscles.includes(uniqueId);
      return {
        ...prev,
        [page]: isSelected
          ? pageMuscles.filter((id) => id !== uniqueId)
          : [...pageMuscles, uniqueId],
      };
    });
  };

  const handleContinue = async () => {
    const hasMuscles = Object.values(selectedMuscles).some(
      (arr) => arr.length > 0
    );
    if (!hasMuscles) {
      try {
        await playPreloaded("over");
      } catch {
        await playSound(require("@/assets/sound/over.wav"));
      }
      Alert.alert(
        "No muscles selected",
        "Please choose at least one muscle before continuing."
      );
      return;
    }

    try {
      await playPreloaded("enter");
    } catch {
      await playSound(require("@/assets/sound/entering.wav"));
    }

    router.push({
      pathname: "/screens/ExercisesScreen",
      params: { selectedMuscles: JSON.stringify(selectedMuscles) },
    });
  };

  return (
	
    <LinearGradient
      colors={[palette.primary, palette.surface]}
      start={{ x: 0.5, y: 1.8 }}
      end={{ x: 0.5, y: 0.7 }}
      style={StyleSheet.absoluteFill}
    >
		<LevelUpArrows palette={palette} />
				{/* Floating selected tags */}
    {Object.values(selectedMuscles).some((arr) => arr.length > 0) && (
      <View style={styles.floatingTagsContainer}>
  <View>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {Object.entries(selectedMuscles).flatMap(([page, muscles]) =>
        muscles.map((id) => (
          <View
            key={id}
            style={[
              styles.selectedTag,
              {
                backgroundColor: palette.surfaceElevated,
                borderColor: palette.primary,
              },
            ]}
          >
            <Text style={{ color: palette.text, fontWeight: "600" }}>
              {id.split("-")[0]}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  </View>
</View>

)}
      <View style={styles.overlay}>
        <View style={styles.avatarWrapper}>
          <AvatarBody fill="#161515af" width={500} height={500} style={{ marginTop: 20 }} />

          {/* Muscle selection scroll */}
          <ScrollView
            horizontal
            pagingEnabled
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            style={styles.musclesWrapper}
          >
            {musclesPages.map((muscles, page) => (
              <View key={page} style={{ width: 500, height: 500 }}>
                {muscles.map(({ Component, name, top, left, width, height, z }, index) => {
                  const uniqueId = `${name}-${index}`;
                  const isSelected = selectedMuscles[page]?.includes(uniqueId);
                  return (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.7}
                      style={{ position: "absolute", top, left, zIndex: z }}
                      onPress={async () => {
                        try {
                          await playPreloaded("click");
                        } catch {
                          await playSound(require("@/assets/sound/tap.wav"));
                        }
                        handleMusclePress(uniqueId, page);
                      }}
                    >
                     <View
						style={{
							shadowColor: isSelected ? "#37d137" : "transparent",
							shadowOffset: { width: 0, height: 0 },
							shadowOpacity: isSelected ? 0.9 : 0,
							shadowRadius: isSelected ? 10 : 0,
							elevation: isSelected ? 6 : 0,
						}}
						>
						<Component
							width={width}
							height={height}
							fill={isSelected ? "#37d137cc" : "#fcfcfc66"}
						/>
						</View>

                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity
			activeOpacity={0.8}
			onPress={handleContinue}
			style={[
				styles.startButton,
				{ backgroundColor: palette.surfaceElevated },
			]}
			>
			<Text style={[styles.startButtonText, { color: palette.primary, fontWeight: "800" }]}>
				Start a workout!
			</Text>
		</TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarWrapper: {
    position: "relative",
    width: 500,
    height: 500,
    alignItems: "center",
    justifyContent: "center",
  },
  musclesWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  seemore: {
    padding: Spacing.sm,
    borderRadius: Radii.md,
    gap: Spacing.sm,
    justifyContent: "center",
  },
  avatarGlow: {
  position: "absolute",
  width: 400,
  height: 200,
  bottom: -30,
  borderRadius: 200,
  overflow: "hidden",
  zIndex: -1,
},
startButton: {
  marginTop: 20,
  paddingVertical: 14,
  paddingHorizontal: 40,
  borderRadius: Radii.md,
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "#000",
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 4,
},
startButtonText: {
  fontSize: 18,
  fontWeight: "600",
},
floatingTagsContainer: {
  position: "absolute",
  top: 10,
  alignSelf: "center",
  zIndex: 999,
  backgroundColor: "transparent",
  borderRadius: 16,
  paddingVertical: 6,
  paddingHorizontal: 10,
  flexDirection: "row",
  shadowColor: "#000",
  shadowOpacity: 0.3,
  shadowRadius: 10,
  elevation: 8,
},

selectedTag: {
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 12,
  borderWidth: 1,
  marginRight: 8,
},



});
