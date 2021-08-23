import {
  INCOME,
  FOREIGN_AID,
  TAX,
  STEAL,
  ASSASSINATE,
  EXCHANGE,
} from "./actions";

import { DUKE, CAPTAIN, ASSASSIN, CONTESSA, AMBASSADOR } from "./characters";

const income = {
  name: "Income",
  action: INCOME,
  cost: 0,
  gain: 1,
  performedBy: null,
  blockedBy: null,
  canChallenge: false,
  task: function (G /* ctx */) {
    G.currencyPool = G.currencyPool - this.gain;
  },
};

const foreignAid = {
  name: "Foreign aid",
  action: FOREIGN_AID,
  cost: 0,
  gain: 2,
  performedBy: null,
  blockedBy: [DUKE],
  canChallenge: false,
};

const tax = {
  name: "Tax",
  action: TAX,
  cost: 0,
  gain: 3,
  performedBy: [DUKE],
  blockedBy: null,
  canChallenge: true,
};

const steal = {
  name: "Steal",
  action: STEAL,
  cost: 0,
  gain: 2, // technically it takes from another so is this correct modeling?
  performedBy: [CAPTAIN],
  blockedBy: [CAPTAIN, AMBASSADOR],
  canChallenge: true,
};

const assassinate = {
  name: "Assassinate",
  action: ASSASSINATE,
  cost: 3,
  gain: 0,
  performedBy: [ASSASSIN],
  blockedBy: [CONTESSA],
  canChallenge: true,
};

export const moves = [income, foreignAid, steal, assassinate];

/*
{
  name: String,   // Human readable

  action: Action,

  cost: Number, // Pay in

  gain: Number, // Pay out

  performedBy: optional array[Characters], // Who can perform | null is all

  blockedBy: optional array[Characters], // Who can block | null is no one

  canChallenge: Boolean

  task: Function
}
*/
