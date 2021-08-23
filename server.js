const { Server, Origins } = require("boardgame.io/server");
const { Coup } = require("./game");

const server = Server({
  games: [Coup],
  origins: [Origins.LOCALHOST],
});

server.run(8000);
