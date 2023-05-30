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

  get gameState() {
    return this.coup.G;
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
    return !this.active;
  }

  get standingAction() {
    return (
      this.playerID !== this.currentPlayer &&
      this.gameState.action?.[this.currentPlayer]
    );
  }

  get opposingAction() {
    const opposer = Object.keys(this.gameState.action).findIndex(
      (playerID) => playerID !== this.playerID
    );

    if (this.currentTurn && opposer !== -1) {
      return {
        playerID: opposer,
        type: this.gameState.action[opposer].type,
        royal: this.gameState.action[opposer].royal,
      };
    }

    return null;
  }

  get challenged() {
    return this.context.activePlayers?.[this.playerID] === 'challenged';
  }

  @action
  triggerMove(moveName) {
    this.coup.triggerMove(moveName, {});
  }

  @action
  triggerMoveWithPosition(moveName, influencePosition) {
    this.coup.triggerMove(moveName, {
      influencePosition,
    });
  }
}
