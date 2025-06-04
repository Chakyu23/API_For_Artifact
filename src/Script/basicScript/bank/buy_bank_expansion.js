import { token, server } from '../../utils/token.js';
import { handleCooldown } from '../../utils/cooldown.js';

/**
 * Tente d’acheter une extension de banque pour un personnage.
 * @param {string} character - Nom du personnage
 */
export async function buyExpansion(character) {
  const url = `${server}/my/${character}/action/bank/buy_expansion`;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      console.log(`❌ ${character} : Failed to buy bank expansion.`);
      console.log(`📭 Reason: ${result.message || JSON.stringify(result)}`);
      return false;
    }

    console.log(`✅ ${character} : Successfully bought a bank expansion.`);

    await handleCooldown(result.data);
    return true;
  } catch (error) {
    console.log(
      `🚨 ${character} : Unexpected error during bank expansion purchase.`
    );
    console.log(error);
    return false;
  }
}
