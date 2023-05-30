import Service from '@ember/service';
import { Client } from 'boardgame.io/client';
import { CoupGame } from '../game';
import { tracked } from '@glimmer/tracking';
import { run } from '@ember/runloop';
import { SocketIO } from 'boardgame.io/multiplayer';

export default class CoupService extends Service {
  constructor() {
    super(...arguments);
  }

  @tracked G = null;

  @tracked ctx = null;

  @tracked game = null;

  @tracked ready = false;

  create(playerID) {
    this.client = new Client({
      game: CoupGame,
      multiplayer: SocketIO({ server: 'localhost:8000' }),
      playerID,
    });

    this.client.subscribe(() => {
      run(() => {
        const state = this.client.getState();

        if (state === null) {
          return;
        }

        this.ready = true;
        this.game = this.client.game;
        this.G = state.G;
        this.ctx = state.ctx;
      });
    });

    this.client.start();
  }

  triggerMove(moveName, { influencePosition }) {
    const { G, ctx } = this.client.getState();

    this.client.moves[moveName]({ influencePosition });

    run(() => {
      const { G, ctx } = this.client.getState();
      this.G = G;
      this.ctx = ctx;
    });
  }
}
