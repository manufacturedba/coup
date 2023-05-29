import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class IndexRoute extends Route {
  @service coup;

  queryParams = {
    player: {
      refreshModel: true,
    },
  };

  model(params) {
    this.coup.create(params.player);

    return this.coup;
  }
}
