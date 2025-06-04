/**
 * Attend un certain nombre de secondes.
 * @param {number} seconds
 */
export function wait(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

/**
 * Attend la fin du cooldown selon cooldown_expiration + 1s de marge.
 * @param {object} data - Doit contenir `cooldown_expiration` (ISO string)
 */
export async function handleCooldown(data) {
  const expirationISO = data?.cooldown?.expiration;
  if (!expirationISO) return;

  const now = new Date();
  const expiration = new Date(expirationISO);
  const delayMs = expiration - now + 1000; // +1s marge

  if (delayMs > 0) {
    const seconds = Math.ceil(delayMs / 1000);
    console.log(`⏳ Waiting ${seconds}s until cooldown expires...`);
    await wait(seconds);
  }
}
