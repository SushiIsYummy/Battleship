import boomSound from './boom.mp3';
import missSound from './miss-sound.mp3';
export function playExplosionSound() {
  let audio = new Audio(boomSound);
  audio.volume = 0.2;
  audio.play();
}
export function playMissSound() {
  let audio = new Audio(missSound);
  // audio.volume = 0;
  audio.play();
}
