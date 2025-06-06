import { token, server } from '../../utils/token.js';
import { handleCooldown } from '../utils/cooldown.js';

/**
 * Échange les récompenses de tâche terminée.
 * @param {string} character - Le nom du personnage
 */
export async function taskExchange(character) {
  const url = `${server}/my/${character}/action/task/exchange`;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      console.log(
        `❌ ${character} failed to exchange task reward:`,
        result.message || result
      );
      return false;
    }

    console.log(`🎁 ${character} successfully exchanged task reward.`);
    await handleCooldown(result.data);

    return true;
  } catch (error) {
    console.log(`${character} : Error during task exchange:`, error);
    return false;
  }
}
