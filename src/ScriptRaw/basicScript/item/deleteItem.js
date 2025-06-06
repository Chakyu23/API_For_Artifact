import { token, server } from '../../utils/token.js';
import { handleCooldown } from '../utils/cooldown.js';

/**
 * Supprime un objet de l’inventaire du personnage.
 * @param {string} character - Le nom du personnage
 * @param {string} itemCode - Le code de l’objet à supprimer
 * @param {number} quantity - Quantité à supprimer (par défaut : 1)
 */
export async function deleteItem(character, itemCode, quantity = 1) {
  const url = `${server}/my/${character}/action/delete`;

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
        `❌ ${character} failed to delete item "${itemCode}":`,
        result.message || result
      );
      return false;
    }

    console.log(`🗑️ ${character} deleted ${quantity}x "${itemCode}".`);
    await handleCooldown(result.data);

    return true;
  } catch (error) {
    console.log(`${character} : Error deleting item:`, error);
    return false;
  }
}
