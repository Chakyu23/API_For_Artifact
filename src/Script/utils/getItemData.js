import { token, server } from '../utils/token.js';
/**
 * Récupère les données publiques d’un objet via son code.
 * Aucune authentification requise.
 * @param {string} itemCode - Code de l’objet à interroger
 * @returns {Promise<object|null>} - Retourne les données de l’objet ou null
 */
export async function getItemData(itemCode) {
  const url = `${server}/items/${itemCode}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    if (!response.ok) {
      console.log(`❌ Failed to fetch data for item "${itemCode}"`);
      console.log(`📭 Reason: ${result.message || JSON.stringify(result)}`);
      return null;
    }

    return result.data;
  } catch (error) {
    console.log(`🚨 Error fetching item "${itemCode}":`, error);
    return null;
  }
}
