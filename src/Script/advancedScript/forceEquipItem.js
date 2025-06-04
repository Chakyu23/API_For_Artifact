import { getCharacterData } from '../utils/getCharacterData.js';
import { unequip } from '../baseScript/item/unequip.js';
import { equip } from '../baseScript/item/equip.js';

/**
 * Équipe un objet dans un slot donné, en déséquipant l'ancien si nécessaire.
 * @param {string} character - Nom du personnage
 * @param {string} itemCode - Code de l'objet à équiper
 * @param {string} slot - Nom du slot ("weapon", "helmet", etc.)
 * @param {number} quantity - Quantité (par défaut : 1)
 */

export async function forceEquipItem(character, itemCode, slot, quantity = 1) {
  console.log(
    `🔧 Attempting to force-equip ${itemCode} into slot ${slot} for ${character}...`
  );

  const charData = await getCharacterData(character);
  if (!charData) {
    console.log(`❌ Could not retrieve character data for ${character}.`);
    return false;
  }

  const currentlyEquipped = charData.equipment?.[slot];

  if (currentlyEquipped) {
    console.log(
      `🧤 Slot "${slot}" is already occupied by "${currentlyEquipped.code}". Unequipping...`
    );
    const unequipped = await unequip(character, slot, 1);
    if (!unequipped) {
      console.log(
        `❌ Failed to unequip ${currentlyEquipped.code} from slot ${slot}.`
      );
      return false;
    }
  }

  const equipped = await equip(character, itemCode, slot, quantity);
  if (!equipped) {
    console.log(`❌ Failed to equip ${itemCode} in slot ${slot}.`);
    return false;
  }

  console.log(`✅ Successfully equipped ${itemCode} in slot ${slot}.`);
  return true;
}
