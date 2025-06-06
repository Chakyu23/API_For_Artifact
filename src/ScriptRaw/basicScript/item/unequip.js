import { token, server } from '../../utils/token.js';
import { handleCooldown } from '../utils/cooldown.js';

export async function unequip(character, slot, quantity = 1) {
  const unequipData = {
    slot: slot,
    quantity: quantity,
  };

  const url = `${server}/my/${character}/action/unequip`;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(unequipData),
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      console.log('Unequip failed:', result.message || result);
      return false;
    }

    console.log('Unequip success:', result.data);

    await handleCooldown(result.data); // ⏳ Respect du cooldown si défini

    return true;
  } catch (error) {
    console.log('Error during unequip:', error);
    return false;
  }
}
