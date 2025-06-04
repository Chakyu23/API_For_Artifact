import { token, server } from '../../utils/token.js';
import { handleCooldown } from '../../utils/cooldown.js';

export async function moveCharacter(character, x, y) {
  const moveData = {
    x: x,
    y: y,
  };

  const url = `${server}/my/${character}/action/move`;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(moveData),
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      console.log(`${character} Movement failed:`, result.message || result);
      return false;
    }

    console.log(`${character} Movement success`);

    await handleCooldown(result.data); // ⏳ Attente si cooldown présent

    return true;
  } catch (error) {
    console.log(`${character} Error during movement:`, error);
    return false;
  }
}
