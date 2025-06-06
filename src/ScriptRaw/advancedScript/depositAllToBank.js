import { getCharacterData } from '../utils/getCharacterData.js';
import { bankPosition } from '../utils/coordinate.js';
import { moveCharacter } from '../basicScript/character/movement.js';
import { depositBankItem } from '../basicScript/bank/deposit_bank_item.js';

export async function depositAllToBank(character, returnToOrigin = false) {
  console.log(`📦 ${character} : Beginning full inventory deposit.`);

  const originalData = await getCharacterData(character);
  if (!originalData) {
    console.log(`❌ Failed to get character data for ${character}`);
    return false;
  }

  const origin = { x: originalData.x, y: originalData.y };

  // Aller à la banque
  if (origin.x !== bankPosition.x || origin.y !== bankPosition.y) {
    console.log(
      `🚶 ${character} : Moving to bank at (${bankPosition.x}, ${bankPosition.y})...`
    );
    const moved = await moveCharacter(
      character,
      bankPosition.x,
      bankPosition.y
    );
    if (!moved) {
      console.log(`❌ ${character} : Failed to reach the bank.`);
      return false;
    }
  }

  // Déposer tous les objets
  const inventory = originalData.inventory || [];
  if (inventory.length === 0) {
    console.log(`✅ ${character} : Inventory already empty.`);
  } else {
    for (const item of inventory) {
      if (!item.code || item.code.trim() === '') {
        continue;
      }

      const success = await depositBankItem(
        character,
        item.code,
        item.quantity
      );
      if (!success) {
        console.log(
          `⚠️ ${character} : Failed to deposit "${item.code}". Skipping...`
        );
      }
    }
  }

  // Retour à l'emplacement d'origine
  if (
    returnToOrigin &&
    (origin.x !== bankPosition.x || origin.y !== bankPosition.y)
  ) {
    console.log(
      `↩️ ${character} : Returning to original position (${origin.x}, ${origin.y})...`
    );
    const returned = await moveCharacter(character, origin.x, origin.y);
    if (!returned) {
      console.log(`⚠️ ${character} : Could not return to original position.`);
      return false;
    }
  }

  console.log(`✅ ${character} : Inventory deposit completed.`);
  return true;
}
