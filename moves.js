import { ACTION, ACTION_TO_ROYAL_MAP } from "./constants";

export function Income({ G, ctx, playerID, events }) {
  G.treasury.withdraw(1);
  G.players[playerID].coins += 1;
}

export function ForeignAid({ G, ctx, playerID, events }) {
  G.players[playerID].chosenAction = ACTION.FOREIGN_AID;

  events.setActivePlayers({
    others: "challenge",
    maxMoves: 1,
    next: {
      others: "counteraction",
      maxMoves: 1,
    }
  });
}

export function Coup({ G, ctx, playerID, events }) {
  setStage("coup");
}

export function Tax({ G, ctx, playerID, events }) {
  G.players[playerID].availableRoyals = ACTION_TO_ROYAL_MAP[ACTION.TAX];
  setStage("select_royal");
}

export function Assassinate() {
  G.players[playerID].availableRoyals = ACTION_TO_ROYAL_MAP[ACTION.ASSASSINATE];
  setStage("select_royal");
}

export function Exchange() {
  G.players[playerID].availableRoyals = ACTION_TO_ROYAL_MAP[ACTION.EXCHANGE];
  setStage("select_royal");
}

export function Steal() {
  G.players[playerID].availableRoyals = ACTION_TO_ROYAL_MAP[ACTION.STEAL];
  setStage("select_royal");
}

export function SelectRoyal({ G, ctx, playerID, events }, royal) {
  G.players[playerID].chosenRoyal = royal;
  G.players[playerID].availableRoyals = null;
  setStage("challenge");
}

export function ChooseCoupTarget({ G, ctx, playerID, events }, player) {
  // G.players[player]
}

export function LoseInfluence({G, ctx, playerID, events }) {

}