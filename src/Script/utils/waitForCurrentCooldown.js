import { getCharacterData } from './getCharacterData.js';
import { wait } from './cooldown.js';

/**
 * Attend la fin du cooldown actif d’un personnage avant de commencer une boucle,
 * en se basant uniquement sur cooldown_expiration (plus précis que cooldown).
 * @param {string} character
 */
export async function waitForCurrentCooldown(character) {
  const data = await getCharacterData(character);

  if (!data || !data.cooldown_expiration) {
    console.log(`🟢 ${character} : No cooldown detected. Ready to start.`);
    return;
  }

  const now = new Date();
  const expiration = new Date(data.cooldown_expiration);
  const seconds = Math.floor((expiration - now) / 1000);

  if (seconds > 0) {
    console.log(`⏳ ${character} : Cooldown ends in ${seconds}s. Waiting...`);
    await wait(seconds);
    console.log(`✅ ${character} : Cooldown finished. Starting loop...`);
  } else {
    console.log(
      `🟢 ${character} : Cooldown already expired. Starting immediately.`
    );
  }
}
