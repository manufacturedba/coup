import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class PlayAreaComponent extends Component {
  @service coup;

  get playerID() {
    return this.client?.playerID;
  }

  get currentPlayer() {
    return this.context?.currentPlayer;
  }

  get currentTurn() {
    if (this.playerID === this.currentPlayer) {
      return true;
    }

    return false;
  }

  get active() {
    return this.game.flow.isPlayerActive(
      this.game,
      this.context,
      this.playerID
    );
  }

  get playerState() {
    return this.coup.G.players[this.args.playerID];
  }

  get game() {
    return this.coup.game;
  }

  get client() {
    return this.coup.client;
  }

  get context() {
    return this.coup.ctx;
  }

  get moveList() {
    return this.game.moveNames.filter((name) => {
      return this.game.flow.getMove(this.context, name, this.playerID);
    });
  }

  get stalled() {
    return this.context?.activePlayers?.[this.playerID] === 'pending_challenge';
  }

  @action
  triggerMove(moveName) {
    this.coup.triggerMove(moveName);
  }
}
