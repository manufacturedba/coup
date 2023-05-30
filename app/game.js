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
  ChallengeInfluence,
  Allow,
  AllowCounter,
  Block,
  Reveal,
  ChooseCoupTarget,
  ChallengeCounter,
  LoseInfluence,
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

      conflict: {},

      action: {},

      revealed: {},

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
    onEnd: ({ G, ctx, events }) => {
      const counterResolution = Object.keys(G.action).find(playerID => playerID !== ctx.currentPlayer);
      const currentPlayerResolution = G.action[ctx.currentPlayer];
      const resolution = counterResolution ? counterResolution({ G, playerID: currentValue }) : currentPlayerResolution({ G, playerID: currentValue });

      return {
        ...G,
        ...resolution,
        openChallenge: null,
        conflict: {},
        action: {},
      }
    },
    stages: {
      select_royal: {
        moves: { SelectRoyal },
      },
      challenge_counter: {
        moves: { ChallengeCounter, AllowCounter },
      },
      challenge_influence: {
        moves: { ChallengeInfluence, Allow },
      },
      counteraction: {
        moves: { Block, Allow },
      },
      challenged: {
        moves: {
          Reveal: {
            move: Reveal,
            client: false,
          },
        },
      },
      lose_influence: {
        moves: { LoseInfluence },
      },
      coup: {
        moves: { ChooseCoupTarget },
      },
    },
  },

  minPlayers: 2,
  maxPlayers: 4,
};
