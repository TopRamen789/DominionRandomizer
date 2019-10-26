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
				biasedSet[i] -= 3;
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
	let actionsCard;

	// if we don't have a card in the current set that has at least 2 actions, add one.
	if(filterByGreaterThanActionCount(newSet, 2).length === 0) {
		newSet = shuffle(newSet);
		newSet.pop();
		actionsCard = shuffle(filterByGreaterThanActionCount(availableCards, 2)).pop();
		newSet.push(actionsCard);
	}

	// make sure we don't inadverntently undo our previous action or remove a 2 action card
	if(actionsCard == null)
		actionsCard = shuffle(filterByGreaterThanActionCount(newSet, 2)).pop();
	newSet = newSet.filter((card) => {
		return card.name !== actionsCard.name;
	});

	// while we don't have a card that lets us draw 2 card, keep doing this.
	while(filterByCardDraw(newSet, 2).length === 0) {
		newSet = shuffle(newSet);
		newCard = shuffle(filterByCardDraw(availableCards, 2)).pop();
		newSet.push(newCard);
	}

	newSet.push(actionsCard);
	return newSet;
}

function proceduralGeneration() {
	let sets = getCheckedSets();
	let availableSet = filterBySets(_cards, sets);
	availableSet = validateNotBasicSet(availableSet);
	availableSet = validateNocturne(availableSet);
	availableSet = validateAdventures(availableSet);
	availableSet = validateRenaissance(availableSet);

	let currentSet = createBiasedSet(availableSet);
	currentSet = enforceEngineCards(currentSet, availableSet);
	
	currentSet = sortByCost(currentSet);
	currentSet = currentSet.concat(addSideboardCards(sets));

	displayBiasData(currentSet);
	buildSelectedCardSet(currentSet);
}

function testNocturneBias() {
	//
}