import { handleCooldown } from '@/ScriptRaw/utils/cooldown';
import { URL_API } from '@/constants'

export async function moveCharacter(character, x, y, token, bcool = true) {
  const moveData = {
    x: x,
    y: y,
  };

  const url = `${URL_API}/my/${character}/action/move`;

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

    if (bcool) {
      await handleCooldown(result.data); // ⏳ Attente si cooldown présent
    }

    return true;
  } catch (error) {
    console.log(`${character} Error during movement:`, error);
    return false;
  }
}
