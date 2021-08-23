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
function raiseAction(G, ctx, endCallback) {
  G.endCallback = endCallback;
  ctx.events.setActivePlayers({ others: "counter", moveLimit: 1 });
}

function performMove(G, ctx, move) {
  // Are there cases where we don't take the money upfront?
  if (move.cost) {
    giveToTreasury(G, ctx, move.cost);
  }

  if (move.canChallenge || move.blockedBy.length) {
    raiseAction(G, ctx, () => {
      G.endCallback = null;
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
}

/**
 *
 * @param {Move} move - Contains a lot of shit about the mechanics for the chosen move
 * @returns
 */
function wrapMove(move) {
  return function (G, ctx) {
    G.move = null;
    if (move.performedBy) {
      G.move = { ...move };
      return ctx.events.setActivePlayers({
        currentPlayer: "choose",
        moveLimit: 1,
      });
    } else {
      return performMove(G, ctx, move);
    }
  };
}

// :P
function makeInfluencer(character) {
  return {
    type: character,
    revealed: false,
  };
}

/**
 * Current player is marked as blocked by another player
 */
function block() {
  ctx.events.setActivePlayers({ currentPlayer: "counter", moveLimit: 1 });
}

/**
 * Player is marked as challenged by another
 */
function challenge() {
  ctx.events.setActivePlayers({ currentPlayer: "counter", moveLimit: 1 });
}

/**
 * Successful demonstration of influence so replace card
 */
function replace(G, ctx, index) {
  // We need to hide the replacement cards from others
  const player = G.players[ctx.currentPlayer];

  // I think this returns the card back
  G.secrets.courtDeck.push(player.splice(index, 1).type);

  // shuffleDeck();

  player.splice(index, 0, makeInfluencer(G.secrets.courtDeck.pop()));
}

/**
 * Discards the influence from
 * @param {*} index
 */
function reveal(index) {
  const player = G.players[ctx.currentPlayer];
  player.influence[index].revealed = true;
}

function chooseCharacterForAction(type) {
  G.move.type = type;
}

/**
 * Player is completely dead if they have no unturned characters
 *
 * @returns {Boolean}
 */
function playerIsDead(G, currentPlayer) {
  return (
    G.players[currentPlayer].influence.filter(
      (character) => character.revealed === true
    ).length === NUM_STARTING_CARDS
  );
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
            influence: [
              makeInfluencer(characterPool.pop()),
              makeInfluencer(characterPool.pop()),
            ], // TODO: base on rules constants
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

  turn: {
    endIf: (G) => playerIsDead(G, ctx.currentPlayer),

    stages: {
      choose: {
        moves: {
          chooseCharacterForAction,
        },
      },
      counter: {
        moves: {
          block,
          challenge,
        },
      },
      challenged: {
        moves: {
          reveal,
          replace,
        },
      },
    },
  },

  /**
   * Blocks secrets and some information about players
   */
  playerView: (G, ctx, playerID) => {
    const players = Object.keys(G.players).reduce((accumulator, value) => {
      const player = G.players[value];
      if (value !== playerID) {
        accumulator[value] = {
          // TODO: name: player.name,
          influence: player.influence.map((influence) => {
            if (influence.revealed) {
              return influence;
            } else {
              return null;
            }
          }),
        };
      } else {
        accumulator[value] = player;
      }

      return accumulator;
    }, {});

    return {
      ...G,
      players,
      secrets: null, // Court deck and shit
    };
  },

  endIf: (G, ctx) => {
    const gameover = Object.keys(G.players).reduce(
      accumulator,
      (value) => {
        // Only check other players
        // Once accumulator flips, don't bother setting again
        if (value !== ctx.currentPlayer && accumulator) {
          accumulator = playerIsDead(G, value);
        }

        return accumulator;
      },
      true
    );

    if (gameover) {
      return { winner: ctx.currentPlayer };
    }
  },

  minPlayers: 2,
  maxPlayers: 4,
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
