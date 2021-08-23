import { Client } from "boardgame.io/client";
import { SocketIO } from "boardgame.io/multiplayer";
import { Coup } from "./game";

class CoupClient {
  constructor(rootElement, { playerID } = {}) {
    this.client = Client({
      game: Coup,
      multiplayer: SocketIO({ server: "localhost:8000" }),
      playerID,
    });

    this.client.start();
    this.client.subscribe((state) => this.update(state));
    this.rootElement = rootElement;
    this.createBoard(this.client);
  }

  createBoard(client) {
    // TODO
    // Influence panel (part of hidden state)
    // Action bar
    debugger;
    this.rootElement.innerHTML = `
      <div>I am the board</div>
    `;
  }

  attachListeners() {
    // All actions need UI mapping
  }

  update(state) {
    // Read
  }
}

const appElement = document.getElementById("app");
const app = new CoupClient(appElement);
