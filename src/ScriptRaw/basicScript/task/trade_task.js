import { token, server } from '../../utils/token.js';
import { handleCooldown } from '../utils/cooldown.js';

/**
 * Échange un objet de tâche via le Grand Exchange (Trade).
 * @param {string} character - Nom du personnage
 * @param {string} itemCode - Code de l'objet échangé
 * @param {number} quantity - Quantité à échanger
 */
export async function tradeTaskItem(character, itemCode, quantity = 1) {
  const url = `${server}/my/${character}/action/grandexchange/trade`;

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
        `❌ ${character} failed to trade "${itemCode}":`,
        result.message || result
      );
      return false;
    }

    console.log(
      `🔁 ${character} successfully traded ${quantity}x ${itemCode} via GE.`
    );
    await handleCooldown(result.data);

    return true;
  } catch (error) {
    console.log(`${character} : Error during task item trade:`, error);
    return false;
  }
}
