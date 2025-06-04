import { token, server } from '../../utils/token.js';
import { handleCooldown } from '../utils/cooldown.js';

/**
 * Annule la tâche en cours d’un personnage.
 * @param {string} character - Le nom du personnage
 */
export async function cancelTask(character) {
  const url = `${server}/my/${character}/action/task/cancel`;

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
        `❌ ${character} failed to cancel task:`,
        result.message || result
      );
      return false;
    }

    console.log(`🗑️ ${character} successfully cancelled their task.`);
    await handleCooldown(result.data);

    return true;
  } catch (error) {
    console.log(`${character} : Error cancelling task:`, error);
    return false;
  }
}
