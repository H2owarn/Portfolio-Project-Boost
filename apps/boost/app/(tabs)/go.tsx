import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Dimensions, TouchableOpacity, Button } from 'react-native';
import { useRouter } from 'expo-router';
import AvatarBody from '../../components/avatar_parts/AvatarBody';
import { musclesFront } from "../../components/avatar_parts/musclesFront";
import { musclesBack } from "../../components/avatar_parts/musclesBack";
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');
const musclesPages = [musclesFront, musclesBack];
{/* Muscle and page tracking*/}
export default function AvatarScreen() {
  const router = useRouter();

  const [selectedMuscles, setSelectedMuscles] = useState<{ [page: number]: string[] }>({});

  const handleMusclePress = (uniqueId: string, page: number) => {
    setSelectedMuscles(prev => {
      const pageMuscles = prev[page] || [];
      const isSelected = pageMuscles.includes(uniqueId);
      return {
        ...prev,
        [page]: isSelected
          ? pageMuscles.filter(id => id !== uniqueId)
          : [...pageMuscles, uniqueId],
      };
    });
  };
{/* Routing for next page*/}
  const handleContinue = () => {
    router.push({
      pathname: '/screens/ExercisesScreen',
      params: { selectedMuscles: JSON.stringify(selectedMuscles) },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        <AvatarBody fill= '#161515af' width={500} height={500} style={{ marginTop: 20 }} />
{/* Muscle swap view*/}
        <ScrollView
          horizontal
          pagingEnabled
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          style={styles.musclesWrapper}
        >{/* Muscle select settings*/}
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
                    onPress={() => handleMusclePress(uniqueId, page)}
                  >
                    <Component
                      width={width}
                      height={height}
                      fill={isSelected ? "#37d137" : "#fcfcfc91"}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title="See Recommended Exercises" onPress={handleContinue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2c2935ff',
  },
  avatarWrapper: {
    position: 'relative',
    width: 500,
    height: 500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  musclesWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
