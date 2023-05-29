import { NUM_STARTING_TREASURY, NUM_STARTING_COINS } from './rules';
import { create, shuffle, draw } from './deck';
import { PlayerView, INVALID_MOVE } from 'boardgame.io/core';
import {
  Income,
  ForeignAid,
  Coup,
  Tax,
  Assassinate,
  Exchange,
  Steal,
  SelectRoyal,
  Challenge,
  Allow,
  Counter,
  Reveal,
  ChooseCoupTarget,
} from './moves';
import { ACTION_TO_RESOLUTION_MAP } from './resolutions';

export const CoupGame = {
  setup: ({ ctx }) => {
    const deck = shuffle(create());
    let treasury = NUM_STARTING_TREASURY;

    const G = {
      secret: {
        deck,
      },

      players: Array(ctx.numPlayers)
        .fill('')
        .map((_) => {
          for (let i = 0; i < 2; i++) {
            treasury--;
          }

          return {
            influence: [draw(deck), draw(deck)],
            coins: NUM_STARTING_COINS,
          };
        })
        .reduce((accumulator, player, index) => {
          accumulator[index] = player;
          return accumulator;
        }, {}),
    };

    G.treasury = treasury;

    return G;
  },

  playerView: PlayerView.STRIP_SECRETS,

  phases: {
    action: {
      moves: {
        Income,
        ForeignAid,
        Coup,
        Tax,
        Assassinate,
        Exchange,
        Steal,
      },
      start: true,
    },
  },

  turn: {
    maxMoves: 2,

    onMove: ({ G, ctx, events, playerID }) => {
      // Only other players can flush resolutions
      if (ctx.activePlayers || playerID === ctx.currentPlayer) {
        return;
      }

      const { chosenAction } = G.players[ctx.currentPlayer];
      const resolution = ACTION_TO_RESOLUTION_MAP[chosenAction];
      events.endTurn();
      return resolution({ G, playerID: ctx.currentPlayer });
    },

    stages: {
      pending_challenge: {
        moves: {},
      },
      pending_counteraction: {
        moves: {},
      },
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
      },
    },
  },

  minPlayers: 2,
  maxPlayers: 4,
};
