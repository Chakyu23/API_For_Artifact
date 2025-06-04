import { token, server } from '../utils/token.js';

export async function getCharacterData(character) {
  const url = `${server}/characters/${character}`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      console.log(
        `Failed to fetch character data for ${character}:`,
        result.message || result
      );
      return null;
    }

    return result.data;
  } catch (error) {
    console.log(`Error fetching character data for ${character}:`, error);
    return null;
  }
}
