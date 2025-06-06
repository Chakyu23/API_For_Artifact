import { token, server } from '../../utils/token.js';
import { handleCooldown } from '../../utils/cooldown.js';

/**
 * Dépose une quantité d’or dans la banque.
 * @param {string} character - Nom du personnage
 * @param {number} quantity - Quantité d’or à déposer
 */
export async function depositGold(character, quantity = 1) {
  const url = `${server}/my/${character}/action/bank/deposit/gold`;

  const body = {
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
      console.log(`❌ ${character} : Failed to deposit gold (${quantity}).`);
      console.log(`📭 Reason: ${result.message || JSON.stringify(result)}`);
      return false;
    }

    console.log(`💰 ${character} : Deposited ${quantity} gold into the bank.`);
    await handleCooldown(result.data);
    return true;
  } catch (error) {
    console.log(`🚨 ${character} : Error during gold deposit.`);
    console.log(error);
    return false;
  }
}
