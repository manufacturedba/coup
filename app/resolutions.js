import { ACTION } from './royals';

function ForeignAid({ G, playerID }) {
  const treasury = G.treasury - 2;

  return {
    ...G,
    treasury,
    players: {
      ...G.players,
      [playerID]: {
        ...G.players[playerID],
        chosenAction: null,
        coins: G.players[playerID].coins + 2,
      },
    },
  };
}

export const ACTION_TO_RESOLUTION_MAP = {
  [ACTION.FOREIGN_AID]: ForeignAid,
};
