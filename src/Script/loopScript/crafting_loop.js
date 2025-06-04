import { getCharacterData } from '../utils/getCharacterData.js';
import { getItemData } from '../utils/getItemData.js';
import { workshopLocations } from '../utils/coordinate.js';
import { moveCharacter } from '../basicScript/character/movement.js';
import { depositAllToBank } from '../advancedScript/depositAllToBank.js';
import { withdrawBankItem } from '../basicScript/bank/withdraw_bank_item.js';
import { craftItem } from '../basicScript/item/craftItem.js';

/**
 * Lance un cycle de crafting complet
 * @param {string} character - Nom du personnage
 * @param {string} itemCode - Code de l’item à crafter
 */
export async function performCraftCycle(character, itemCode) {
  console.log(`🎬 Starting crafting cycle for ${character} - ${itemCode}`);

  // 1. 🔍 Récupérer les données de l’item
  const itemData = await getItemData(itemCode);
  if (!itemData || !itemData.craft) {
    console.log(`❌ Cannot craft item "${itemCode}" — No craft data found.`);
    return;
  }

  const skill = itemData.craft.skill;
  const items = itemData.craft.items;
  console.log(skill, items);
  const workshop = workshopLocations[skill];

  if (!workshop) {
    console.log(`❌ No workshop location defined for skill "${skill}"`);
    return;
  }

  // 2. 📦 Aller à la banque + vider l’inventaire
  const emptied = await depositAllToBank(character, false);
  if (!emptied) return;

  // 3. 📊 Calculer la quantité max craftable (selon composants en banque + place inv.)
  const charData = await getCharacterData(character);
  if (!charData) return;

  let spaceCost = 0;
  items.forEach((item) => {
    spaceCost += item.quantity;
  });

  const craftSlot = Math.floor(charData.inventory_max_items / spaceCost);

  for (const item of items) {
    const totalNeeded = craftSlot * item.quantity;
    const ok = await withdrawBankItem(character, item.code, totalNeeded);
    if (!ok) return;
  }

  // 5. 🚶 Aller au workshop
  console.log(
    `🧭 Moving to workshop for "${skill}" at (${workshop.x}, ${workshop.y})`
  );
  const moved = await moveCharacter(character, workshop.x, workshop.y);
  if (!moved) return;

  // 6. 🛠️ Crafter
  const crafted = await craftItem(character, itemCode, maxCraftable);
  if (!crafted) return;

  console.log(`✅ ${character} : Crafting cycle completed for "${itemCode}"`);
}
