import { token, server } from '../utils/token.js';
import { handleCooldown } from '../utils/cooldown.js';
import { getCharacterData } from '../utils/getCharacterData.js';
import { depositAllToBank } from '../advancedScript/depositAllToBank.js';

let lastHP = {};
let needHealing = {};
let fightCycleActive = true;

export function stopFightCycle() {
  fightCycleActive = false;
}

export async function performFightCycle(character) {
  if (!fightCycleActive) return;

  if (needHealing[character]) {
    needHealing[character] = false;
    const rested = await performRest(character);
    if (!rested) return;
  } else {
    const fought = await performFight(character);
    if (!fought) return;
  }

  const healthOk = await checkHealth(character);
  if (!healthOk) {
    console.log(`${character} : Health check failed. Stopping the cycle.`);
    return;
  }

  if (!fightCycleActive) return;
  performFightCycle(character); // Lancement direct après cooldown (géré dans les fonctions)
}

export async function performFight(character) {
  const url = `${server}/my/${character}/action/fight`;

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: 'Bearer ' + token,
  };

  try {
    const response = await fetch(url, { method: 'POST', headers });
    const result = await response.json();

    // Gère les erreurs spécifiques
    if (response.status === 497) {
      console.log(`${character} : Inventory full — initiating deposit.`);
      const success = await depositAllToBank(character, true);
      return success ? await performFight(character) : false;
    }

    if (!response.ok) {
      console.log(`${character} : Fight failed - ${result.message || result}`);
      return false;
    }

    console.log(
      `${character} : Fight ended successfully and ${result.data.fight.result}.`
    );

    if (!lastHP[character]) {
      lastHP[character] = result.data.character.max_hp;
    }

    await handleCooldown(result.data);
    return true;
  } catch (error) {
    console.log(`${character} : Error during fight:`, error);
    return false;
  }
}

export async function performRest(character) {
  const url = `${server}/my/${character}/action/rest`;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      console.log(`${character} : Rest failed - ${result.message || result}`);
      return false;
    }

    console.log(
      `${character} : Rested successfully and restored ${result.data.hp_restored} HP.`
    );
    await handleCooldown(result.data);
    return true;
  } catch (error) {
    console.log(`${character} : Error during rest:`, error);
    return false;
  }
}

async function checkHealth(character) {
  const data = await getCharacterData(character);
  if (!data) return false;

  const hp = data.hp;
  const damageTaken = lastHP[character] - hp;

  if (hp <= 1 || damageTaken >= hp - 1) {
    needHealing[character] = true;
  }

  return true;
}
