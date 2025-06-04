import { token, server } from '../../utils/token.js';
import { handleCooldown } from '../../utils/cooldown.js';

/** 
 * Lance une action de craft pour un objet donné.
 * @param {string} character - Nom du personnage
 * @param {string} itemCode - Code de l'objet à crafter
 * @param {number} quantity - Quantité à crafter (défaut = 1)
 */
export async function craftItem(character, itemCode, quantity = 1) {
  const url = `${server}/my/${character}/action/crafting`;

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
        `❌ ${character} : Failed to craft "${itemCode}" x${quantity}.`
      );
      console.log(`📭 Reason: ${result.message || JSON.stringify(result)}`);
      return false;
    }

    console.log(
      `🛠️ ${character} : Successfully crafted "${itemCode}" x${quantity}.`
    );
    await handleCooldown(result.data);
    return true;
  } catch (error) {
    console.log(`🚨 ${character} : Error during crafting of "${itemCode}".`);
    console.log(error);
    return false;
  }
}
