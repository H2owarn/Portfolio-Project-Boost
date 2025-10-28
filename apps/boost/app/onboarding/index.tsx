import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import { View, Pressable, Text, Dimensions } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { VideoView, useVideoPlayer } from "expo-video";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { supabase } from "@/lib/supabase";


const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const [dontShow, setDontShow] = useState(false);
  const [finished, setFinished] = useState(false);

  // player for each video (all autoplay, muted, loop)
  const playerTrain = useVideoPlayer(require("../../assets/videos/onboard_train.mp4"), (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });
  const playerLevel = useVideoPlayer(require("../../assets/videos/onboard_level.mp4"), (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });
  const playerProgress = useVideoPlayer(require("../../assets/videos/onboard_progress.mp4"), (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });
  const playerCompete = useVideoPlayer(require("../../assets/videos/onboard_compete.mp4"), (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

 const finishTutorial = async () => {
  if (finished) return;
  setFinished(true);
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && dontShow) {
      await supabase
        .from('profiles')
        .update({ hide_tutorial: true })
        .eq('id', user.id);
    }

    router.replace('/(tabs)/home');
  } catch (error) {
    console.error('Error finishing tutorial:', error);
  }
};


  return (
    <View style={{ flex: 1 }}>
      <Onboarding
        onSkip={finishTutorial}
        onDone={finishTutorial}
        pages={[
          {
            backgroundColor: "#171717",
            image: (
              <VideoView
                player={playerTrain}
                style={{ width, height, marginTop: 100 }}
                contentFit="contain"
                nativeControls={false}
              />
            ),
            title: "",
            subtitle: "",
          },
          {
            backgroundColor: "#171717",
            image: (
              <VideoView
                player={playerLevel}
                style={{ width, height, marginTop: 100 }}
                contentFit="contain"
                nativeControls={false}
              />
            ),
            title: "",
            subtitle: "",
          },
          {
            backgroundColor: "#171717",
            image: (
              <VideoView
                player={playerProgress}
                style={{ width, height, marginTop: 100 }}
                contentFit="contain"
                nativeControls={false}
              />
            ),
            title: "",
            subtitle: "",
          },
          {
            backgroundColor: "#171717",
            image: (
              <VideoView
                player={playerCompete}
                style={{ width, height, marginTop: 100 }}
                contentFit="contain"
                nativeControls={false}
              />
            ),
            title: "",
            subtitle: "",
          },
        ]}
      />

      {/* "Don’t show again" checkbox */}
      <Pressable
        onPress={() => setDontShow(!dontShow)}
        style={{ position: "absolute", bottom: 40, alignSelf: "center" }}
      >
        <Text style={{ color: "#aaa", fontSize: 16 }}>
          {dontShow ? "✅ Don’t show again" : "☐ Don’t show again"}
        </Text>
      </Pressable>
    </View>
  );
}
