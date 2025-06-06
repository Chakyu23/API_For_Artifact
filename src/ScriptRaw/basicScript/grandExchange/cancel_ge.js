import { token, server } from '../../utils/token.js';
import { handleCooldown } from '../utils/cooldown.js';

/**
 * Annule un achat en cours au Grand Exchange.
 * @param {string} character - Nom du personnage
 * @param {string} itemId - ID de l'objet à annuler
 */
export async function cancelGEOrder(character, itemId) {
  const url = `${server}/my/${character}/action/grandexchange/cancel`;

  const body = {
    id: itemId,
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      console.log(
        `❌ ${character} failed to cancel GE order ${itemId}:`,
        result.message || result
      );
      return false;
    }

    console.log(`❌ ${character} cancelled GE order for "${itemId}".`);

    await handleCooldown(result.data);
    return true;
  } catch (error) {
    console.log(`${character} : Error cancelling GE order:`, error);
    return false;
  }
}
