let setBiasedCost = (biasedSet, costIdx) => {
	biasedSet.forEach((cost, idx) => {
		if(idx != costIdx)
			cost += 2;
	});
	return biasedSet;
}

let createBiasedSet = (availableSet) => {
	let currentSet = [];
	let biasedSet = [0,0,0,0,0];
	// biasCostCurve(currentSet, availableSet);

	while(currentSet.length != 10) {
		let currentlyAvailableSet = filterByOtherCardSet(availableSet, currentSet);

		// filter out cost if we manage to bias it.
		for(let i = 0; i < biasedSet.length; i++) {
			if(bias(biasedSet[i])) {
				biasedSet[i] -= 2;
				currentlyAvailableSet = filterByCost(currentlyAvailableSet, i+2);
				biasedSet = setBiasedCost(biasedSet, i);
				break;
			}
		}

		let biases = getBiases();
		while(biases.length > 0) {
			let bias = biases.pop();
			currentlyAvailableSet = bias(currentSet, currentlyAvailableSet);
		}

		let card = currentlyAvailableSet.pop();
		if(card != null)
			currentSet.push(card);
	}
	return currentSet;
}

let enforceEngineCards = (currentSet, availableCards) => {
	let newAvailableSet = [];
	let newSet = currentSet.slice();
	// we might be removing some bias if we do this.
	let newActionsCard;
	if(filterByGreaterThanActionCount(newSet, 2).length === 0) {
		newSet = shuffle(newSet);
		newSet.pop();
		newAvailableSet = filterByGreaterThanActionCount(availableCards, 2);
		newActionsCard = shuffle(newAvailableSet).pop();
		newSet.push(newActionsCard);
	}

	let otherSafeCounter = 0;

	// while we don't have a card that lets us draw 2 card, keep doing this.
	while(filterByCardDraw(newSet, 2).length === 0 && otherSafeCounter !== 10) {
		newSet = shuffle(newSet);

		// make sure we don't inadverntently undo our previous action
		if(newActionsCard == null)
			newActionsCard = shuffle(filterByGreaterThanActionCount(newSet, 2))[0];

		let topCard = newSet.pop();
		newAvailableSet = filterByCardDraw(availableCards, 2);
		
		if(topCard.name === newActionsCard.name)
			newSet.push(topCard);
		else {
			newCard = shuffle(newAvailableSet).pop();
			newSet.push(newCard);
		}
		otherSafeCounter++;
	}
	return newSet;
}

let proceduralGeneration = () => {
	let sets = getCheckedSets();
	let availableSet = filterBySets(_cards, sets);
	availableSet = validateNotBasicSet(availableSet);
	availableSet = validateNocturne(availableSet);
	availableSet = validateAdventures(availableSet);
	availableSet = validateRenaissance(availableSet);

	let currentSet = createBiasedSet(availableSet);
	currentSet = enforceEngineCards(currentSet, availableSet);
	// currentSet = eventsOrProjects(availableSet, currentSet);

	currentSet = sortByCost(currentSet);
	displayBiasData(currentSet);
	buildSelectedCardSet(currentSet);
}

let testNocturneBias = () => {
	//
}

/*
Dominion Wiki suggests there are 5 different kinds of strategies: Big Money - Combo - Rush - Slog - Engine
And perhaps I should bias on those, pick 1-2 maybe 3 cards from the biased set, and add them.
Anything that increases the amount of replayability the set has, the better.
If possible, multiple variations of said strategies would be pretty awesome.
*/