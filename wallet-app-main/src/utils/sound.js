var Sound = require("react-native-sound");

Sound.setCategory("Playback");

const createSound = sound => {
  return new Sound(sound, Sound.MAIN_BUNDLE);
};

const Call = createSound("notification.mp3");

export default {
  Call,
};