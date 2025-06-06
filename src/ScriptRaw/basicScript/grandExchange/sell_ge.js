import { token, server } from '../../utils/token.js';
import { handleCooldown } from '../utils/cooldown.js';

/**
 * Met en vente un objet sur le Grand Exchange.
 * @param {string} character - Nom du personnage
 * @param {string} itemCode - Code de l'objet à vendre
 * @param {number} quantity - Quantité à vendre
 * @param {number} price - Prix unitaire souhaité
 */
export async function sellToGE(character, itemCode, quantity = 1, price = 1) {
  const url = `${server}/my/${character}/action/grandexchange/sell`;

  const body = {
    code: itemCode,
    quantity: quantity,
    price: price,
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
        `❌ ${character} failed to sell "${itemCode}" on GE:`,
        result.message || result
      );
      return false;
    }

    console.log(
      `💰 ${character} listed ${quantity}x ${itemCode} at ${price}g each on GE.`
    );
    await handleCooldown(result.data);

    return true;
  } catch (error) {
    console.log(`${character} : Error while selling on GE:`, error);
    return false;
  }
}
