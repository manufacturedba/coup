import { ROYAL } from './royals';
import { NUM_CHARACTER_COUNT } from './rules';

export function create() {
  let deck = [];
  for (let i = 0; i < NUM_CHARACTER_COUNT; i++) {
    deck.push(ROYAL.DUKE);
    deck.push(ROYAL.CAPTAIN);
    deck.push(ROYAL.ASSASSIN);
    deck.push(ROYAL.CONTESSA);
    deck.push(ROYAL.AMBASSADOR);
  }
  return deck;
}

export function shuffle(deck) {
  let shuffled = [];
  while (deck.length > 0) {
    let index = Math.floor(Math.random() * deck.length);
    shuffled.push(deck[index]);
    deck.splice(index, 1);
  }
  return shuffled;
}

export function draw(deck) {
  return deck.pop();
}

export function insert(deck, card) {
  return deck.push(card);
}
