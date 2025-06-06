import { token, server } from '../../utils/token.js';
import { handleCooldown } from '../utils/cooldown.js';

/**
 * Utilise un objet dans l'inventaire d’un personnage.
 * @param {string} character - Nom du personnage
 * @param {string} itemCode - Code de l’objet à utiliser
 * @param {number} quantity - Quantité à utiliser
 */
export async function useItem(character, itemCode, quantity = 1) {
  const url = `${server}/my/${character}/action/use`;

  const body = {
    code: itemCode,
    quantity: quantity,
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
        `❌ ${character} failed to use "${itemCode}":`,
        result.message || result
      );
      return false;
    }

    console.log(`🧪 ${character} used ${quantity}x ${itemCode}.`);
    await handleCooldown(result.data);

    return true;
  } catch (error) {
    console.log(`${character} : Error using item:`, error);
    return false;
  }
}
