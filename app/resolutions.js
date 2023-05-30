import { ACTION, COUNTERACTION } from './royals';

function ForeignAid({ G, playerID }) {
  const treasury = G.treasury - 2;

  return {
    ...G,
    treasury,
    players: {
      ...G.players,
      [playerID]: {
        ...G.players[playerID],
        coins: G.players[playerID].coins + 2,
      },
    },
  };
}

function Tax({ G, playerID }) {
  const treasury = G.treasury - 3;

  return {
    ...G,
    treasury,
    players: {
      ...G.players,
      [playerID]: {
        ...G.players[playerID],
        coins: G.players[playerID].coins + 3,
      },
    },
  };
}

function BlockForeignAid({ G, playerID }) {
  return {
    ...G,
    action: {}
  };
}

export const ACTION_TO_RESOLUTION_MAP = {
  [ACTION.FOREIGN_AID]: ForeignAid,
  [ACTION.TAX]: Tax,
  [COUNTERACTION.BLOCK_FOREIGN_AID]: BlockForeignAid,
};
