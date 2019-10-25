function setBiasedCost(biasedSet, costIdx) {
	biasedSet.forEach((cost, idx) => {
		if(idx != costIdx)
			cost += 2;
	});
	return biasedSet;
}

function createBiasedSet(availableSet) {
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

function enforceEngineCards(currentSet, availableCards) {
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

function proceduralGeneration() {
	let sets = getCheckedSets();
	let availableSet = filterBySets(cards, sets);
	availableSet = validateNotBasicSet(availableSet);
	availableSet = validateNocturne(availableSet);
	availableSet = validateAdventures(availableSet);
	availableSet = validateRenaissance(availableSet);

	let currentSet = createBiasedSet(availableSet);
	currentSet = enforceEngineCards(currentSet, availableSet);
	// currentSet = eventsOrProjects(availableSet, currentSet);

	currentSet = sortByCost(currentSet);
	displayBiasData(currentSet);
	displayCardPercentages(currentSet);
	buildSelectedCardSet(currentSet);
}

function testNocturneBias() {
	//
}