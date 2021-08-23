import { PlayerView } from "boardgame.io/core";
import { moves } from "./moves";
import { DUKE, CAPTAIN, ASSASSIN, CONTESSA, AMBASSADOR } from "./characters";
import {
  NUM_CHARACTER_COUNT,
  NUM_COIN_POOL,
  NUM_STARTING_COINS,
} from "./rules";

const moveList = {};

moves.forEach((move) => {
  moveList[move.action] = move;
});

// pseudocode
function income(G, ctx) {
  G.currencyPool--;
  G.player[ctx.currentPlayer].currency++;
}

/**
 * challenge
 * { player: playerChallenging.name }
 *
 * block
 *
 * { player: playerBlocking.name, as: Character }
 */
/*
 * Triggers prompt for others for X time
 *
 * @param Boolean challenged - Action was challenged
 * @param Boolean blocked - Action was blocked
 *
 * Do I need G and ctx here? hmmm
 */
function raiseAction(G, ctx, move) {
  G.raisedAction = {
    by: ctx.currentPlayer,
    move,
  };

  if (challenged) {
    promptCard();
  }

  if (blocked) {
    promptBlockFlow();
  }
}

/**
 *
 * @param {Move} move - Contains a lot of shit about the mechanics for the chosen move
 * @returns
 */
function wrapMove(move) {
  return function (G, ctx) {
    if (move.canChallenge || move.blockedBy.length) {
      raiseAction(G, ctx, move, () => {
        return move.task(G, ctx);
      });
    } else {
      // Cannot be stopped
      return move.task(G, ctx);
    }
  };
}

// Focus on basic flow
export const Coup = {
  // ctx.currentPlayer is int of player in focus | only way to pass information is to return in setup
  setup: (ctx) => {
    const characterPool = [DUKE, CAPTAIN, ASSASSIN, CONTESSA, AMBASSADOR]
      .map((character) => Array(NUM_CHARACTER_COUNT).fill(character))
      .flat(); // TODO: shuffle

    const currencyPool = NUM_COIN_POOL;

    return {
      secrets: {}, // Any info in here is obfuscated from player
      characterPool,
      players: Array(ctx.numPlayers).map((_) => {
        return {
          influence: [characterPool.pop(), characterPool.pop()], // TODO: base on rules constants
          currency: currencyPool - NUM_STARTING_COINS,
        };
      }),
    };
  },

  moves: moveList, // Needs dynamic restricting due to currency 10+ rule

  turn: { moveLimit: 1 },

  playerView: PlayerView.STRIP_SECRETS,
};

/**
 * Create character pool
 * Deal num from character pool
 * Create currency pool
 * Distribute num from currency pool
 * Create turn order
 *
 * On turn
 * Only those from available character actions
 * All of these actions trigger a prompt to others for X time if blockable, challengable
 * Actions with character associations also prompt for the selected character
 *
 * Example
 * 1. Click "Tax"
 * 2. Prompts for as Duke choice (should actions that have only 1 character association even prompt?)
 * 3. All players are prompted for block/challenge
 * 3a. // todo challenge/block flow
 * 4. Next player turn
 *
 * Off turn
 * Only counteractions
 * Block, Challenge
 *
 *
 *
 */
