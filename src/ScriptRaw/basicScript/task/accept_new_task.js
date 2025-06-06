import { token, server } from '../../utils/token.js';
import { handleCooldown } from '../utils/cooldown.js';

/**
 * Lance une nouvelle tâche pour le personnage donné.
 * @param {string} character - Le nom du personnage
 */
export async function newTask(character) {
  const url = `${server}/my/${character}/action/task/new`;

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
        `${character} ❌ Failed to start new task:`,
        result.message || result
      );
      return false;
    }

    console.log(`${character} ✅ New task started successfully.`);
    await handleCooldown(result.data); // attends le cooldown s'il est fourni
    return true;
  } catch (error) {
    console.log(`${character} : Error while starting new task:`, error);
    return false;
  }
}
