export function getCurrentPlayerFromGame(G, ctx) {
  return G.players[ctx.currentPlayer];
}

/**
 * Handles payment to treasury but explodes if player can't pay
 * @param {*} G
 * @param {*} ctx
 * @param {Number} amount
 */
export function giveToTreasury(G, ctx, amount) {
  const currentPlayer = getCurrentPlayerFromGame(G, ctx);
  if (currentPlayer.coins < amount) {
    throw new Error("Absolutely fucking not");
  }

  currentPlayer.coins -= amount;
  G.treasury += amount;
}

/**
 * Handles removal of coins from treasury up to remaining amount
 *
 * @param {Object} G
 * @param {Object} ctx
 * @param {Number} amount
 */
export function takefromTreasury(G, ctx, amount) {
  const currentPlayer = getCurrentPlayerFromGame(G, ctx);

  if (G.treasury >= amount) {
    G.treasury -= amount;
    currentPlayer.coins += amount;
  } else {
    // Totally fine, but treasury empties
    currentPlayer.coins += amount;
    G.treasury = 0;
  }
}
