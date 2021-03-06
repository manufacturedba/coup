import { Client } from "boardgame.io/client";
import { SocketIO } from "boardgame.io/multiplayer";
import { Coup } from "./game";

const PLAYER_ID_QUERY_PARAMETER = "playerID";
const TIME_TO_DECIDE = 1000 * 15;

class CoupClient {
  constructor(rootElement, { playerID }) {
    this.client = Client({
      game: Coup,
      multiplayer: SocketIO({ server: "localhost:8000" }), // Turn off to run local
      playerID,
    });

    this.client.start();
    this.client.subscribe((state) => this.update(state));
    this.rootElement = rootElement;
    this.playerID = playerID;
    this.hasCreatedPlayerInterface = false; // Needs to happen in a single update cycle
    this.createBoard(this.client);
  }

  /**
   * Creates generic play area for game prior to game start
   * @param {*} client
   */
  createBoard(client) {
    // TODO
    // Influence panel (part of hidden state)
    // Action bar
    this.rootElement.innerHTML = `
      <div class="board">
        <h1 class="board__current_player" id="current_player"></h1>
        <h2 class="board__treasury" id="treasury"></h2>
        <div class="board__hand" id="hand"></div>
        <div class="board__coins" id="coins"></div>
        <div class="board__timer" id="timer"></div>
        <div class="board__action_bar" id="action_bar"></div>
      </div>
    `;
  }

  attachListeners() {
    // All actions need UI mapping
  }

  createCard(character) {
    const hand = document.getElementById("hand");
    const card = document.createElement("div");
    card.innerHTML = `
      <div class="character">${character.type}</div>
    `;

    hand.appendChild(card);
  }

  /**
   * Shows player's current coin count
   * @param {Object} player
   */
  updateCoins(player) {
    const coins = document.getElementById("coins");
    coins.innerHTML = `
      <div class="coins">Number of coins: ${player.coins || 0}<div>
    `;
  }

  /**
   * Create all the actions available to the player including attaching listeners
   *
   * @param {Number} currentPlayerID
   */
  updateActionBar(currentPlayerID, activePlayers) {
    const actionBar = document.getElementById("action_bar");
    actionBar.innerHTML = '';

    const stage = activePlayers && activePlayers[this.playerID];
    let moves;
    if (stage) {
      moves = this.client.game.turn.stages[stage].moves;
    } else if (this.playerID === currentPlayerID) {
      moves = this.client.game.moves;
    }

    Object.keys(moves).forEach((move) => {
      const moveElement = document.createElement("button");
      moveElement.textContent = move;
      moveElement.classList.add("move");
      //moveElement.disabled = move.cost > player.coins; How can I get this back?
      moveElement.onclick = () => {
        const action = this.client.moves[move];

        if (!action) {
          throw new Error("Missing action is not a valid circumstance");
        }
        action();
      };
      actionBar.appendChild(moveElement);
    });
  }

  /**
   * Displays the current player on board
   * TODO: Translate this to actual player's name
   *
   * @param {Number} currentPlayerID
   */
  updateCurrentPlayer(currentPlayerID) {
    const currentPlayerElement = document.getElementById("current_player");
    if (this.playerID === currentPlayerID) {
      currentPlayerElement.textContent = `It's your turn!`;
    } else {
      currentPlayerElement.textContent = `Current player: ${currentPlayerID}`;
    }
  }

  /**
   * Update treasury with remaining coins
   *
   * @param {Number} amount
   */
  updateTreasury(amount) {
    const treasury = document.getElementById("treasury");
    treasury.textContent = `Remaining coins in treasury: ${amount}`;
  }

  updateTimer() {
    const timerElement = document.getElementById("timer");
    if (this.showTimer) {
      timerElement.textContent = `
        FOOBAR is doing BLAH as a BLAH.
        You have ${TIME_TO_DECIDE / 1000} seconds to challenge or block
      `;
    } else {
      timerElement.textContent = "";
    }
  }

  /**
   * This method is called for almost any event meaning it knows
   * about current players
   * @param {Object} state
   */
  update(state) {
    if (state === null) {
      return null;
    }

    const player = state.G.players[this.playerID];
    const currentPlayerID = state.ctx.currentPlayer;
    const activePlayers = state.ctx.activePlayers;
    // Other players are given a limit to take an action
    if (activePlayers && activePlayers[this.playerID] === "counter") {
      this.showTimer = true;
      setTimeout(() => {
        this.showTimer = false;
        this.client.events.endStage();
      }, TIME_TO_DECIDE);
    }

    if (!this.hasCreatedPlayerInterface) {
      player.influence.forEach((character) => {
        // TODO: This is the wrong way of thinking
        // Update state should be interpreted as a "frame" so we always refresh
        // all of UI
        this.createCard(character);
      });

      this.hasCreatedPlayerInterface = true;
    }

    this.updateCoins(player);
    // Need to base action bar on available actions for player in stage
    this.updateActionBar(currentPlayerID, activePlayers);
    this.updateCurrentPlayer(currentPlayerID);
    this.updateTreasury(state.G.treasury);
    this.updateTimer();
  }
}

const appElement = document.getElementById("app");
const playerID = new URL(window.location).searchParams.get(
  PLAYER_ID_QUERY_PARAMETER
);

if (!playerID) {
  throw new Error("Exploding because I have no real error handler");
}

const app = new CoupClient(appElement, { playerID });
