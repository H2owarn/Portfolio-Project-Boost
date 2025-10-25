import { Audio } from "expo-av";

/**
 * Plays a sound once and automatically unloads it when finished.
 * Usage: playSound(require("../assets/sound/enter.wav"))
 */
export async function playSound(file: any) {
  const { sound } = await Audio.Sound.createAsync(file);
  await sound.playAsync();

  sound.setOnPlaybackStatusUpdate((status) => {
    if (!status.isLoaded) return;
    if ((status as any).didJustFinish) {
      sound.unloadAsync();
    }
  });
}

const sounds: Record<string, Audio.Sound> = {};

/** ✅ Correct relative paths (note: "sound" not "sounds") */
export async function preloadSounds() {
  sounds.click = (await Audio.Sound.createAsync(require("../assets/sound/tap.wav"))).sound;
  sounds.complete = (await Audio.Sound.createAsync(require("../assets/sound/completed.wav"))).sound;
  sounds.achieve = (await Audio.Sound.createAsync(require("../assets/sound/achievement.wav"))).sound;
  sounds.enter = (await Audio.Sound.createAsync(require("../assets/sound/entering.wav"))).sound;
}

export async function playPreloaded(name: keyof typeof sounds) {
  await sounds[name]?.replayAsync();
}
