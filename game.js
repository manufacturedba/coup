import {
  NUM_STARTING_TREASURY,
  NUM_STARTING_COINS,
} from "./rules";
import { create, shuffle, draw } from "./deck";
import { PlayerView, INVALID_MOVE } from 'boardgame.io/core';

// Focus on basic flow
export const Coup = {
  // ctx.currentPlayer is int of player in focus | only way to pass information is to return in setup
  setup: (ctx) => {
    const deck = shuffle(create());
    const treasury = new Treasury(NUM_STARTING_TREASURY);

    const G = {
      treasury,

      secrets: {
        deck,
      },

      players: Array(ctx.numPlayers)
        .fill("")
        .map((_) => {
          NUM_STARTING_COINS.forEach((_) => treasury.withdraw(1));

          return {
            influence: [
              draw(deck),
              draw(deck),
            ],
            coins: NUM_STARTING_COINS,
          };
        })
    };

    return G;
  },

  moves: { Income, ForeignAid, Coup, Tax, Assassinate, Exchange, Steal },

  playerView: PlayerView.STRIP_SECRETS,

  turn: {
    endIf: (G, ctx) => playerIsDead(G, ctx.currentPlayer),

    stages: {
      select_royal: {
        moves: { SelectRoyal },
      },
      challenge: {
        moves: { Challenge, Allow },
      },
      counteraction: {
        moves: { Counter, Allow },
      },
      reveal: {
        moves: { Reveal },
      },
      coup: {
        moves: { ChooseCoupTarget },
      }
    },
  },

  minPlayers: 2,
  maxPlayers: 4,
};