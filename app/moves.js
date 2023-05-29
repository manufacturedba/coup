import { ACTION, ACTION_TO_ROYAL_MAP } from './royals';

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

    minMoves: 0,

    maxMoves: 1,
  });

  return {
    ...G,
    players: {
      ...G.players,
      [playerID]: {
        ...G.players[playerID],
        chosenAction: ACTION.FOREIGN_AID,
      },
    },
  };
};

export const Coup = ({ G, ctx, playerID, events }) => {
  setStage('coup');
};

export const Tax = ({ G, ctx, playerID, events }) => {
  G.players[playerID].availableRoyals = ACTION_TO_ROYAL_MAP[ACTION.TAX];
  setStage('select_royal');
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
  setStage('challenge');
};

export const ChooseCoupTarget = ({ G, ctx, playerID, events }, player) => {
  // G.players[player]
};

export const LoseInfluence = ({ G, ctx, playerID, events }) => {};

export const Allow = ({ G, ctx, playerID, events }) => {};

export const Challenge = () => {};

export const Counter = () => {};

export const Reveal = () => {};
