import { token, server } from '../utils/token.js';
import { handleCooldown } from '../utils/cooldown.js';
import { depositAllToBank } from '../advancedScript/depositAllToBank.js';

let gatheringCycleActive = true;

export function stopGatheringCycle() {
  gatheringCycleActive = false;
}

export async function performGathering(character) {
  if (!gatheringCycleActive) return;

  const url = `${server}/my/${character}/action/gathering`;

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: 'Bearer ' + token,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
    });

    const result = await response.json();

    if (response.status === 497) {
      console.log(`${character} : Inventory is full — initiating deposit.`);
      const deposited = await depositAllToBank(character, true);
      if (deposited) {
        return performGathering(character); // Reprendre après dépôt
      } else {
        console.log(`${character} : Deposit failed. Stopping cycle.`);
        return;
      }
    }

    if (response.status === 498) {
      console.log(
        `${character} : The character cannot be found on your account.`
      );
      return;
    } else if (response.status === 499) {
      console.log(`${character} : Is in cooldown.`);
      return;
    } else if (response.status === 493) {
      console.log(`${character} : Too high-level resource.`);
      return;
    } else if (response.status === 598) {
      console.log(`${character} : No resource on this map.`);
      return;
    } else if (!response.ok) {
      console.log(`${character} : An error occurred while gathering.`);
      return;
    }

    console.log(`${character} : Successfully gathered the resource.`);
    await handleCooldown(result.data);

    // Reprendre la boucle
    performGathering(character);
  } catch (error) {
    console.log(`${character} : Error during gathering:`, error);
  }
}
