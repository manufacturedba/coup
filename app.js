import { Client } from "boardgame.io/client";
import { SocketIO } from "boardgame.io/multiplayer";
import { Coup } from "./game";
import { moves } from "./moves";

const PLAYER_ID_QUERY_PARAMETER = "playerID";

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
        <div class="board__hand" id="hand"></div>
        <div class="board__coins" id="coins"></div>
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
      <div class="character">${character}</div>
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
   * @param {Number} currentPlayer
   */
  updateActionBar(currentPlayer) {
    const actionBar = document.getElementById("action_bar");
    let actions = "";
    moves.forEach((move) => {
      const moveElement = document.createElement("div");
      moveElement.innerHTML = `
        <button class="move" data-action="${move.action}">${move.name}</button>
      `;
      actions += moveElement.outerHTML;
    });
    actionBar.innerHTML = actions;
    actionBar.querySelectorAll(".move").forEach((button) => {
      button.disabled = this.playerID !== currentPlayer;
      button.onclick = (event) => {
        const actionName = event.target.dataset.action;
        const action = this.client.moves[actionName];

        if (!action) {
          throw new Error("Missing action is not a valid circumstance");
        }
        action();
      };
    });
  }

  /**
   * Displays the current player on board
   * TODO: Translate this to actual player's name
   *
   * @param {Number} currentPlayer
   */
  updateCurrentPlayer(currentPlayer) {
    document.getElementById(
      "current_player"
    ).textContent = `Current player: ${currentPlayer}`;
  }
  /**
   * This method is called for almost any event meaning it knows
   * about current players
   * @param {Object} state
   */
  update(state) {
    if (state) {
      const player = state.G.players[this.playerID];
      const currentPlayer = state.ctx.currentPlayer;

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
      this.updateActionBar(currentPlayer);
      this.updateCurrentPlayer(currentPlayer);
    }
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
