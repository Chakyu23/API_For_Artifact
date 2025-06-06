import { getCharacterData } from '../utils/getCharacterData.js';
import { bankPosition } from '../utils/coordinate.js';
import { moveCharacter } from '../baseScript/character/moveCharacter.js';
import { depositBankItem } from '../baseScript/bank/depositBankItem.js';
import { withdrawBankItem } from '../baseScript/bank/withdrawBankItem.js';

export async function exchangeItemViaBank(
  giver,
  receiver,
  itemCode,
  quantity = 1
) {
  console.log(
    `🔁 Starting transfer of ${quantity}x ${itemCode} from ${giver} to ${receiver} via bank...`
  );

  // 1. Récupère la position actuelle des deux personnages
  const giverData = await getCharacterData(giver);
  const receiverData = await getCharacterData(receiver);

  if (!giverData || !receiverData) {
    console.log('❌ Failed to get character data. Aborting exchange.');
    return;
  }

  // 2. Vérifie et déplace le donneur
  if (giverData.x !== bankPosition.x || giverData.y !== bankPosition.y) {
    console.log(`${giver} is not at the bank. Moving...`);
    const dx = bankPosition.x - giverData.x;
    const dy = bankPosition.y - giverData.y;
    const moved = await moveCharacter(giver, dx, dy);
    if (!moved) {
      console.log(`❌ Failed to move ${giver} to the bank.`);
      return;
    }
  }

  // 3. Vérifie et déplace le receveur
  if (receiverData.x !== bankPosition.x || receiverData.y !== bankPosition.y) {
    console.log(`${receiver} is not at the bank. Moving...`);
    const dx = bankPosition.x - receiverData.x;
    const dy = bankPosition.y - receiverData.y;
    const moved = await moveCharacter(receiver, dx, dy);
    if (!moved) {
      console.log(`❌ Failed to move ${receiver} to the bank.`);
      return;
    }
  }

  // 4. Dépose l’objet depuis le donneur
  const deposited = await depositBankItem(giver, itemCode, quantity);
  if (!deposited) {
    console.log(`❌ ${giver} failed to deposit ${itemCode}.`);
    return;
  }

  // 5. Retire l’objet depuis le receveur
  const withdrawn = await withdrawBankItem(receiver, itemCode, quantity);
  if (!withdrawn) {
    console.log(`❌ ${receiver} failed to withdraw ${itemCode}.`);
    return;
  }

  console.log(
    `✅ ${itemCode} x${quantity} successfully transferred from ${giver} to ${receiver}.`
  );
}
