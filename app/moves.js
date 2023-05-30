import { ACTION, ACTION_TO_ROYAL_MAP } from './royals';
import { ROYAL, COUNTERACTION_TO_ROYAL_MAP, COUNTERACTION } from './royals';
import { shuffle, draw, insert } from './deck';

// Royal actions
export const Income = ({ G, playerID, events }) => {
  const treasury = G.treasury - 1;

  events.endTurn();

  return {
    ...G,
    treasury,
    players: {
      ...G.players,
      [playerID]: {
        ...G.players[playerID],
        coins: G.players[playerID].coins + 1,
      },
    },
  };
};

export const ForeignAid = ({ G, playerID, events }) => {
  events.setActivePlayers({
    others: 'counteraction',

    maxMoves: 2,
  });

  return {
    ...G,
    action: {
      [playerID]: {
        type: ACTION.FOREIGN_AID,
      },
    },
    players: {
      ...G.players,
      [playerID]: {
        ...G.players[playerID],
      },
    },
  };
};

export const Coup = ({ G, ctx, playerID, events }) => {
  setStage('coup');
};

export const Tax = ({ G, ctx, playerID, events }) => {
  events.setActivePlayers({
    others: 'challenge_influence',

    minMoves: 0,

    maxMoves: 1,
  });

  return {
    ...G,
    openChallenge: playerID,
    action: {
      [playerID]: {
        royal: ROYAL.DUKE,
        type: ACTION.TAX,
      },
    },
    players: {
      ...G.players,
      [playerID]: {
        ...G.players[playerID],
      },
    },
  };
};

export const Assassinate = () => {
  G.players[playerID].availableRoyals = ACTION_TO_ROYAL_MAP[ACTION.ASSASSINATE];
  setStage('select_royal');
};

export const Exchange = () => {
  G.players[playerID].availableRoyals = ACTION_TO_ROYAL_MAP[ACTION.EXCHANGE];
  setStage('select_royal');
};

export const Steal = () => {
  G.players[playerID].availableRoyals = ACTION_TO_ROYAL_MAP[ACTION.STEAL];
  setStage('select_royal');
};

// Prompted actions

export const SelectRoyal = ({ G, ctx, playerID, events }, royal) => {
  G.players[playerID].chosenRoyal = royal;
  G.players[playerID].availableRoyals = null;
  setStage('challenge_influence');
};

export const ChooseCoupTarget = ({ G, ctx, playerID, events }, player) => {
  // G.players[player]
};

export const Allow = ({ G, ctx, playerID, events }) => {
  const remainingPlayers = ctx.activePlayers.filter(player !== playerID);

  if (remainingPlayers.length) {
    return;
  }

  events.endTurn();

  return {
    ...G,
    openChallenge: null,
  };
};

export const AllowCounter = ({ G, ctx, playerID, events }) => {
  debugger;
};

export const ChallengeInfluence = ({ G, ctx, playerID, events }) => {
  const from = playerID;
  const to = G.openChallenge;

  events.setActivePlayers({
    value: {
      [target]: 'challenged',
    },

    maxMoves: 1,
  });

  return {
    ...G,
    conflict: {
      ...G.conflict,
      from,
      to,
    },
  };
};

export const ChallengeCounter = ({ G, playerID, events }) => {
  const from = playerID;
  const to = G.openChallenge;

  events.setActivePlayers({
    value: {
      [target]: 'challenged',
    },

    maxMoves: 1,
  });

  return {
    ...G,
    conflict: {
      ...G.conflict,
      from,
      to,
    },
  };
};

export const Block = ({ G, ctx, playerID, events }) => {
  if (G.action[ctx.currentPlayer].type === ACTION.FOREIGN_AID) {
    const otherPlayers = [ctx.currentPlayer, ...ctx.activePlayers.filter(player !== playerID)];
    const value = otherPlayers.reduce((acc, playerID) => {
      acc[playerID] = 'challenge_counter';
      return acc;
    }, {});
    events.setActivePlayers({
      value
    });

    return {
      ...G,
      openChallenge: playerID,
      action: {
        ...G.action,
        [playerID]: {
          royal: COUNTERACTION_TO_ROYAL_MAP[COUNTERACTION.BLOCK_FOREIGN_AID][0],
          type: COUNTERACTION.BLOCK_FOREIGN_AID,
        },
      },
    };
  }
};

export const LoseInfluence = ({ G, ctx, playerID, events }) => { };

export const Reveal = ({ G, playerID, events }, { influencePosition }) => {
  const { from, to } = G.conflict;
  const influence = G.players[playerID].influence[influencePosition];
  const remainingInfluence =
    G.players[playerID].influence.slice(influencePosition);

  // Challenger loses
  if (G.action[to].type === influence) {
    const deck = shuffle(insert(G.secret.deck, influence));
    const replacement = draw(deck);

    remainingInfluence.push(replacement);

    events.setActivePlayers({
      value: {
        [from]: 'lose_influence',
      },

      minMoves: 0,

      maxMoves: 2,
    });

    return {
      ...G,
      conflict: {},
      players: {
        ...G.players,
        [playerID]: {
          ...G.players[playerID],
          influence: remainingInfluence,
        },
      },
    };

    // Challenger wins
  } else {
    return {
      ...G,
      revealed: {
        ...G.revealed,
        [playerID]: influence,
      },
      conflict: {},
      players: {
        ...G.players,
        [playerID]: {
          ...G.players[playerID],
          influence: remainingInfluence,
        },
      },
    };
  }
};
