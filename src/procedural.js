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
	// I need to mess with this more.
	while(currentSet.length != 10) {
		let currentlyAvailableSet = filterByOtherCardSet(availableSet, currentSet);
		// filter out cost if we manage to bias it.
		for(let i = 0; i < biasedSet.length; i++) {
			if(bias(biasedSet[i])) {
				//biasedSet[i] -= 3;
				currentlyAvailableSet = filterByCost(currentlyAvailableSet, i+2);
				biasedSet = setBiasedCost(biasedSet, i);
				break;
			}
		}
		let biases = getBiases();
		while(biases.length > 0) {
			let randomBias = biases.pop();
			console.log(randomBias);
			currentlyAvailableSet = randomBias(currentSet, currentlyAvailableSet);
			console.log(currentlyAvailableSet);
			biases = shuffle(biases);
		}
		let card = currentlyAvailableSet.pop();
		if(card != null)
			currentSet.push(card);
	}

	console.log(biasedSet);
	return currentSet;
}

let enforceEngineCards = (currentSet, availableCards) => {
	let newAvailableSet = [];
	let newSet = currentSet.slice();
	let actionsCard;
	console.log('begin', currentSet.length);
	newAvailableSet = filterBySet(availableCards, currentSet);
	let needActions = filterByGreaterThanActionCount(newSet, 2).length === 0; 
	// if we don't have a card in the current set that has at least 2 actions, add one.
	if(needActions) {
		newSet = shuffle(newSet);
		newSet.pop();
		actionsCard = shuffle(filterByGreaterThanActionCount(newAvailableSet, 2)).pop();
		while(newSet.find(card => card.name == actionsCard.name)) {
			actionsCard = shuffle(filterByGreaterThanActionCount(newAvailableSet, 2)).pop();
		}
		newSet.push(actionsCard);
	}
	// make sure we don't inadverntently undo our previous action or remove a 2 action card
	// if(actionsCard == null)
	// 	actionsCard = shuffle(filterByGreaterThanActionCount(newSet, 2)).pop();
	// newSet = newSet.filter((card) => {
	// 	return card.name !== actionsCard.name;
	// });
	// if we don't have a card that lets us draw 2 cards, add one.
	if(filterByCardDraw(newSet, 2).length === 0) {
		newSet = shuffle(newSet);
		if(needActions)
			newSet = newSet.filter(card => card.name !== actionsCard.name);
		newSet.pop();
		newCard = shuffle(filterByCardDraw(newAvailableSet, 2)).pop();
		while(newSet.find(card => card.name == newCard.name)) {
			newCard = shuffle(filterByCardDraw(newAvailableSet, 2)).pop();
		}
		newSet.push(newCard);
		if(needActions)
			newSet.push(actionsCard);
	}
	console.log('end', newSet.length);
	return newSet;
}

let proceduralGeneration = () => {
	let expansions = getCheckedExpansions();
	let availableSet = filterByExpansions(_cards, expansions);
	availableSet = validateCardSet(availableSet);
	let currentSet = createBiasedSet(availableSet);
	currentSet = enforceEngineCards(currentSet, availableSet);
	currentSet = sortByCost(currentSet);
	// currentSet = currentSet.concat(addSideboardCards(sets));
	currentSet.push({
		name: currentSet.length,
		types: '',
		set: ''
	});
	displayBiasData(currentSet);
	buildSelectedCardSet(currentSet);
}

let generateSideboard = () => {
	let expansions = getCheckedExpansions();
	let sideboard = addSideboardCards(expansions);
	buildSelectedSideboard(sideboard);
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

// Run bias 500x, see which ones are consistent winners.
let testBias = () => {
	let aggregateData = [];
	let expansions = getCheckedExpansions();
	let filteredExpansions = filterByExpansions(_cards, expansions);
	filteredExpansions = validateCardSet(filteredExpansions);
	const iterations = 1000;
	for(let i = 0; i < iterations; i++) {
		let currentSet = createBiasedSet(filteredExpansions);
		let biasData = getBiasData(currentSet);
		aggregateData.push(biasData.reduce((max, current) => current.percent >= max.percent ? current : max));
	}
	let nocturneBias = aggregateData.filter(set => set.type === 'Night').length;
	let adventuresBias = aggregateData.filter(set => set.type === 'Tavern').length;
	let renaissanceBias = aggregateData.filter(set => set.type === 'Villagers/Coffers').length;
	let attackBias = aggregateData.filter(set => set.type === 'Attack').length;
	let trashBias = aggregateData.filter(set => set.type === 'Trash').length;
	let durationBias = aggregateData.filter(set => set.type === 'Duration').length;
	let buysBias = aggregateData.filter(set => set.type === 'Buys').length;
	let everythingElseBias = aggregateData.filter(set => set.type === 'Everything Else').length;
	console.log(`Night: ${Math.round((nocturneBias/iterations)*100, 2)}%`);
	console.log(`Tavern: ${Math.round((adventuresBias/iterations)*100, 2)}%`);
	console.log(`Villagers/Coffers: ${Math.round((renaissanceBias/iterations)*100, 2)}%`);
	console.log(`Attack: ${Math.round((attackBias/iterations)*100, 2)}%`);
	console.log(`Trash: ${Math.round((trashBias/iterations)*100, 2)}%`);
	console.log(`Duration: ${Math.round((durationBias/iterations)*100, 2)}%`);
	console.log(`Buys: ${Math.round((buysBias/iterations)*100, 2)}%`);
	console.log(`Everything Else: ${Math.round((everythingElseBias/iterations)*100, 2)}%`);
	console.log(`Expected win rates: ${Math.round(100/7, 2)}%`);
}

let countCards = () => {
	let expansions = getCheckedExpansions();
	let filteredSets = filterByExpansions(_cards, expansions);
	filteredSets = validateCardSet(filteredSets);
	console.log(`Night: ${filterByTypes(filteredSets, ['Night']).length}`)
	console.log(`Tavern: ${filterByTavern(filteredSets).length}`);
	console.log(`Villagers: ${filterByVillagers(filteredSets).length}`);
	console.log(`Coffers: ${filterByCoffers(filteredSets).length}`);
	console.log(`Attack: ${filterByTypes(filteredSets, ['Attack']).length}`);
	console.log(`Trash: ${filterByTrashCount(filteredSets, 1).length}`);
	console.log(`Duration: ${filterByTypes(filteredSets, ['Duration']).length}`);
	console.log(`Buys: ${filterByBuyCount(filteredSets, 1).length}`);
	console.log(`Everything Else: ' ${filterSetByEverythingElse(filteredSets).length}`);
}

export default {proceduralGeneration};