import { token, server } from '../../utils/token.js';
import { handleCooldown } from '../utils/cooldown.js';

/**
 * Valide une tâche complétée par le personnage.
 * @param {string} character - Nom du personnage
 */
export async function completeTask(character) {
  const url = `${server}/my/${character}/action/task/complete`;

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
        `❌ ${character} failed to complete task:`,
        result.message || result
      );
      return false;
    }

    console.log(`✅ ${character} successfully completed the task.`);
    await handleCooldown(result.data);
    return true;
  } catch (error) {
    console.log(`${character} : Error completing task:`, error);
    return false;
  }
}
