import { NativeAudio } from "@capgo/native-audio";
import { isPlatform } from "@ionic/react";

const audioGenerator = (names: string[]): { [key: string]: HTMLAudioElement } => {
  const suit: { [key: string]: HTMLAudioElement } = {};
  names.forEach(name => {
    suit[name] = new Audio(`sounds/${name}.mp3`);
  });
  return suit;
};

const soundName = ["ending", "complete"] as const;
export type SoundName = (typeof soundName)[number];
const sounds: { [key: string]: HTMLAudioElement } = audioGenerator([...soundName]);

export const setVolume = (volume = 100): void => {
  if (isPlatform("capacitor")) {
    Object.keys(sounds).forEach(key => {
      sounds[key].volume = volume / 100;
      if (isPlatform("capacitor")) {
        NativeAudio.setVolume({
          assetId: key,
          volume,
        });
      }
    });
  }
};

export const pauseSound = async (sound: SoundName) => {
  if (isPlatform("capacitor")) {
    await NativeAudio.stop({
      assetId: sound,
    });
  } else {
    sounds[sound].pause();
  }
};

export const stopSound = async (sound: SoundName) => {
  await pauseSound(sound);
  sounds[sound].currentTime = 0;
  sounds[sound].loop = false;
};

export const loopSound = async (sound: SoundName) => {
  if (isPlatform("capacitor")) {
    await NativeAudio.loop({
      assetId: sound,
    });
  } else {
    sounds[sound].loop = true;
    sounds[sound].play();
  }
};

export const playSound = async (sound: SoundName) => {
  if (isPlatform("capacitor")) {
    try {
      await NativeAudio.play({
        assetId: sound,
        time: 0,
      });
    } catch {
      await sounds[sound].play();
    }
  } else {
    await sounds[sound].play();
  }
};

export const initSounds = () => {
  if (isPlatform("capacitor")) {
    NativeAudio.configure({ focus: false });
    Object.keys(sounds).forEach(key => {
      NativeAudio.preload({
        assetId: key,
        assetPath: `public/sounds/${key}.mp3`,
        audioChannelNum: 1,
        isUrl: false,
      });
    });
  }
};
