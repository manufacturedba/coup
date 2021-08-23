import { PlayerView } from "boardgame.io/core";
import { moves } from "./moves";
import { DUKE, CAPTAIN, ASSASSIN, CONTESSA, AMBASSADOR } from "./characters";
import {
  NUM_CHARACTER_COUNT,
  NUM_STARTING_TREASURY,
  NUM_STARTING_COINS,
} from "./rules";
import { giveToTreasury, takefromTreasury } from "./utils";

const moveList = {};

moves.forEach((move) => {
  moveList[move.action] = wrapMove(move);
});

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
    // Are there cases where we don't take the money upfront?
    if (move.cost) {
      giveToTreasury(G, ctx, move.cost);
    }

    if (move.canChallenge || move.blockedBy.length) {
      raiseAction(G, ctx, move, () => {
        // Cannot be stopped
        if (move.gain) {
          takefromTreasury(G, ctx, move.gain);
        }

        if (move.task) {
          return move.task(G, ctx, move); // Am I bad at javascript?
        }
      });
    } else {
      // Cannot be stopped
      if (move.gain) {
        takefromTreasury(G, ctx, move.gain);
      }

      if (move.task) {
        return move.task(G, ctx, move); // Am I bad at javascript?
      }
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

    let treasury = NUM_STARTING_TREASURY;

    const G = {
      secrets: {
        courtDeck: characterPool,
      }, // Any info in here is obfuscated from player

      // Must be object keyed by player ID
      players: Array(ctx.numPlayers)
        .fill("kind of bullshit JS")
        .map((_) => {
          treasury -= NUM_STARTING_COINS;

          return {
            influence: [characterPool.pop(), characterPool.pop()], // TODO: base on rules constants
            coins: NUM_STARTING_COINS,
          };
        })
        .reduce((accumulator, value, index) => {
          accumulator[index] = value;

          return accumulator;
        }, {}),
    };

    G.treasury = treasury; // After created players have pulled out their starting values

    return G;
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
