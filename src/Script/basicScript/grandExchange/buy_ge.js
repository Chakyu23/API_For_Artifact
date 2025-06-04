import { token, server } from '../../utils/token.js';
import { handleCooldown } from '../utils/cooldown.js';

/**
 * Achète un objet au Grand Exchange.
 * @param {string} character - Nom du personnage
 * @param {string} itemId - ID de l’objet à acheter (ex : "iron_sword")
 * @param {number} quantity - Quantité à acheter
 */
export async function buyFromGE(character, itemId, quantity = 1) {
  const url = `${server}/my/${character}/action/grandexchange/buy`;

  const body = {
    id: itemId,
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
        `❌ ${character} failed to buy ${itemId}:`,
        result.message || result
      );
      return false;
    }

    console.log(`🛒 ${character} bought ${quantity}x ${itemId}.`);
    await handleCooldown(result.data); // cooldown auto si dispo
    return true;
  } catch (error) {
    console.log(`${character} : Error during Grand Exchange buy:`, error);
    return false;
  }
}
