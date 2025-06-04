import { token, server } from '../../utils/token.js';
import { handleCooldown } from '../../utils/cooldown.js';

/**
 * Retire un objet de la banque vers l'inventaire du personnage.
 * @param {string} character - Nom du personnage
 * @param {string} itemCode - Code de l'objet à retirer
 * @param {number} quantity - Quantité à retirer
 */
export async function withdrawBankItem(character, itemCode, quantity = 1) {
  const withdrawData = {
    code: itemCode,
    quantity: quantity,
  };

  const url = `${server}/my/${character}/action/bank/withdraw`;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(withdrawData),
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      console.log(
        `❌ ${character} : Failed to withdraw "${itemCode}" x${quantity}.`
      );
      console.log(`📭 Reason: ${result.message || JSON.stringify(result)}`);
      return false;
    }

    console.log(
      `✅ ${character} : Withdrew "${itemCode}" x${quantity} from bank.`
    );

    await handleCooldown(result.data);
    return true;
  } catch (error) {
    console.log(
      `🚨 ${character} : Unexpected error during bank withdrawal of "${itemCode}".`
    );
    console.log(error);
    return false;
  }
}
