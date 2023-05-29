class Treasury {
    constructor(startingCoins) {
        this.coins = startingCoins;
    }

    withdraw(amount) {
        this.coins -= amount;
    }

    deposit(amount) {
        this.coins += amount;
    }
}