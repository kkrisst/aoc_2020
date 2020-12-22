let fs = require('fs');
const { performance } = require('perf_hooks');

const compareSimpleArrays = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }

    return true;
}

const playRecursiveCombat = (deck1Original, deck2Original) => {
    const winningCardCount = deck1Original.length + deck2Original.length;
    let stop = false;
    
    let deck1 = deck1Original.slice();
    let deck2 = deck2Original.slice();

    let previousDecks1 = [];
    let previousDecks2 = [];

    while (!stop) {
        /*
            Before either player deals a card, if there was a previous round
            in this game that had exactly the same cards in the same order
            in the same players' decks, the game instantly ends in a win for
            player 1. Previous rounds from other games are not considered.
            (This prevents infinite games of Recursive Combat, which everyone
            agrees is a bad idea.)
        */

        let unseenDeck1 = true;
        let unseenDeck2 = true;

        for (let deck of previousDecks1) {
            if (compareSimpleArrays(deck1, deck)) {
                unseenDeck1 = false;
                break;
            }
        }

        if (unseenDeck1) {
            for (let deck of previousDecks2) {
                if (compareSimpleArrays(deck2, deck)) {
                    unseenDeck2 = false;
                    break;
                }
            }
        }

        if (!unseenDeck1 || !unseenDeck2) {
            const card1 = deck1.pop();
            const card2 = deck2.pop();
            deck1.unshift(card1);
            deck1.unshift(card2);

            continue;
        }

        previousDecks1.push(deck1.slice());
        previousDecks2.push(deck2.slice());

        /*
            Otherwise, this round's cards must be in a new configuration; the
            players begin the round by each drawing the top card of their
            deck as normal.
        */

        const card1 = deck1.pop();
        const card2 = deck2.pop();

        /*
            If both players have at least as many cards remaining in their deck
            as the value of the card they just drew, the winner of the round
            is determined by playing a new game of Recursive Combat (see below).
        */

        if (deck1.length >= card1 && deck2.length >= card2) {
            let nextDeck1 = deck1.slice();
            while (nextDeck1.length > card1) nextDeck1.shift();
            let nextDeck2 = deck2.slice();
            while (nextDeck2.length > card2) nextDeck2.shift();

            const winnerID = playRecursiveCombat(nextDeck1, nextDeck2)[0];
            if (winnerID === 1) {
                deck1.unshift(card1);
                deck1.unshift(card2);
            } else {
                deck2.unshift(card2);
                deck2.unshift(card1);
            }
            
            continue;
        }

        /*
            Otherwise, at least one player must not have enough cards left in
            their deck to recurse; the winner of the round is the player with
            the higher-value card.
        */

        if (card1 > card2) {
            deck1.unshift(card1);
            deck1.unshift(card2);
        }
        else if (card1 === card2) console.log('error same value cards!')
        else {
            deck2.unshift(card2);
            deck2.unshift(card1);
        }

        if (deck1.length === winningCardCount || deck2.length === winningCardCount) {
            stop = true;
        }

    }

    if (deck1.length === winningCardCount) {
        return [1, deck1];
    } else return [2, deck2];
}

try {
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    
    const t0 = performance.now();

    // build the 2 decks, 2 arrays where last element is the top card
    const playersRaw = inputData.split('\r\n\r\n');
    if (playersRaw.length !== 2) console.log('error, player data length is not 2');

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

    const winnerData = playRecursiveCombat(deck1, deck2);
    finalWinnerDeck = winnerData[1];

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