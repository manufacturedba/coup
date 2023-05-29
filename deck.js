import { ROYAL_NAMES } from './constants.js';
import { NUM_CHARACTER_COUNT } from './rules.js';

export function create() {
    let deck = [];
    for (let i = 0; i < NUM_CHARACTER_COUNT; i++) {
        deck.push(ROYAL_NAMES.DUKE);
        deck.push(ROYAL_NAMES.CAPTAIN);
        deck.push(ROYAL_NAMES.ASSASSIN);
        deck.push(ROYAL_NAMES.CONTESSA);
        deck.push(ROYAL_NAMES.AMBASSADOR);
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