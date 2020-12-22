let fs = require('fs');
const { performance } = require('perf_hooks');

try {
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    
    const t0 = performance.now();

    // build the 2 decks, 2 arrays where last element is the top card
    const playersRaw = inputData.split('\r\n\r\n');
    if (playersRaw.length !== 2) console.log('error, player data length is not 2');

    // console.log(playersRaw);

    const parsePlayerDeck = playerRaw => {
        let deck = [];

        const parts = playerRaw.split(':');
        if (parts.length !== 2) console.log('error, individual player data parts\' length is not 2');
        for (let card of parts[1].split('\r\n')) {
            if (card !== '') deck.unshift(parseInt(card));
        }

        return deck;
    }
    
    let deck1 = parsePlayerDeck(playersRaw[0]);
    let deck2 = parsePlayerDeck(playersRaw[1]);
    const winningCardCount = deck1.length + deck2.length;

    let finalWinnerDeck = deck1;

    // console.log(deck1);
    // console.log(deck2);

    // start the game: stop when one of the decks is empty
    let stop = false;
    while (!stop) {
        // grab the 2 top cards, remove them from the decks (use pop)
        const card1 = deck1.pop();
        const card2 = deck2.pop();

        // check who wins
        let winnerDeck = deck1;
        let winnerCard = card1;
        let loserCard = card2;

        if (card1 === card2) console.log('error, same value cards, what should I do?')
        if (card2 > card1) {
            winnerDeck = deck2;
            winnerCard = card2;
            loserCard = card1;
        }

        // put the cards in the winner's deck
        winnerDeck.unshift(winnerCard);
        winnerDeck.unshift(loserCard);

        if (winnerDeck.length === winningCardCount) {
            finalWinnerDeck = winnerDeck;
            stop = true;
        }
    }

    // at the end, calculate the winner's score
    let winnerScore = 0;

    for (let i = 0; i < finalWinnerDeck.length; i++) {
        winnerScore += finalWinnerDeck[i] * (i + 1);
    }

    console.log(`The winning player's score is: ${winnerScore}`);
    
    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}