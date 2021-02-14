// I'm sort of telling this how to play a game?
determineHandProbabilities = (cardSet) => {
    let initialDeck = [];
    for(let i = 0; i < 7; i++) {
        initialDeck.push("copper");
    }
    for(let i = 0; i < 3; i++) {
        initialDeck.push("estate");
    }
    let cardNameCounts = [];
    initialDeck.forEach((card) => {
        if(!cardNameCounts[card.name])
            cardNameCounts[card.name] = 0;
        cardNameCounts[card.name]++;
    });
};