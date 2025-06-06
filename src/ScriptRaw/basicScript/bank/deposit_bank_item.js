import { token, server } from '../../utils/token.js';
import { handleCooldown } from '../../utils/cooldown.js';

/**
 * Dépose un objet dans la banque pour un personnage.
 * @param {string} character - Nom du personnage
 * @param {string} itemCode - Code de l'objet à déposer
 * @param {number} quantity - Quantité à déposer
 */
export async function depositBankItem(character, itemCode, quantity = 1) {
  const depositData = {
    code: itemCode,
    quantity: quantity,
  };

  const url = `${server}/my/${character}/action/bank/deposit`;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(depositData),
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      console.log(
        `❌ ${character} : Failed to deposit "${itemCode}" x${quantity}.`
      );
      console.log(`📭 Reason: ${result.message || JSON.stringify(result)}`);
      return false;
    }

    console.log(
      `✅ ${character} : Deposited "${itemCode}" x${quantity} to bank.`
    );

    await handleCooldown(result.data);
    return true;
  } catch (error) {
    console.log(
      `🚨 ${character} : Unexpected error during deposit of "${itemCode}".`
    );
    console.log(error);
    return false;
  }
}
