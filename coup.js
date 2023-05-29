import { Server, Origins } from 'boardgame.io/server';
import { CoupGame } from './app/game';

const server = Server({
  games: [CoupGame],
  origins: [Origins.LOCALHOST],
});

server.run(8000);
