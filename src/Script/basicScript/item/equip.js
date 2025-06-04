import { token, server } from '../../utils/token.js';
import { handleCooldown } from '../utils/cooldown.js';

export async function equip(character, objectCode, slot, quantity = 1) {
  const equipData = {
    code: objectCode,
    slot: slot,
    quantity: quantity,
  };

  const url = `${server}/my/${character}/action/equip`;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(equipData),
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      console.log('Equip failed:', result.message || result);
      return false;
    }

    console.log('Equip success:', result.data);

    await handleCooldown(result.data); // ⏳ cooldown s'il existe

    return true;
  } catch (error) {
    console.log('Error during equip:', error);
    return false;
  }
}
