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
		let randomBias = biases.pop();
		// console.log(randomBias);
		currentlyAvailableSet = randomBias(currentSet, currentlyAvailableSet);
		let card = currentlyAvailableSet.pop();
		if(card != null)
			currentSet.push(card);
	}
	return currentSet;
}

function enforceEngineCards(currentSet, availableCards) {
	let newAvailableSet = [];
	let newSet = shuffle(currentSet);
	let actionsCard, drawCard;

	if(filterByGreaterThanActionCount(newSet, 2).length === 0) {
		newSet.pop();
		actionsCard = shuffle(filterByGreaterThanActionCount(availableCards, 2)).pop();
	}
	if(filterByCardDraw(newSet, 2).length === 0) {
		newSet.pop();
		drawCard = shuffle(filterByCardDraw(availableCards, 2)).pop();
	}

	if(drawCard != null && newSet.length !== 10)
		newSet.push(drawCard);
	if(actionsCard != null && newSet.length !== 10)
		newSet.push(actionsCard);
	return newSet;
}

function proceduralGeneration() {
	let sets = getCheckedSets();
	let availableSet = filterBySets(_cards, sets);
	availableSet = validateCardSet(availableSet);

	let currentSet = createBiasedSet(availableSet);
	currentSet = enforceEngineCards(currentSet, availableSet);
	
	currentSet = sortByCost(currentSet);
	currentSet = currentSet.concat(addSideboardCards(sets));

	displayBiasData(currentSet);
	buildSelectedCardSet(currentSet);
	console.log(currentSet.length);
}

// Run bias 500x, see which ones are consistent winners.
function testBias() {
	let aggregateData = [];
	let sets = getCheckedSets();
	let filteredSets = filterBySets(_cards, sets);
	filteredSets = validateCardSet(filteredSets);

	const iterations = 100;
	
	for(let i = 0; i < iterations; i++) {
		let currentSet = createBiasedSet(filteredSets);
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
	let actionsBias = aggregateData.filter(set => set.type === 'Actions').length;
	let cardsBias = aggregateData.filter(set => set.type === 'Cards').length;
	let victoryBias = aggregateData.filter(set => set.type === 'Victory').length;
	let treasureBias = aggregateData.filter(set => set.type === 'Treasure').length;
	let everythingElseBias = aggregateData.filter(set => set.type === 'Everything Else').length;

	console.clear();
	console.log(`Night: ${Math.round((nocturneBias/iterations)*100, 3)}%`);
	console.log(`Tavern: ${Math.round((adventuresBias/iterations)*100, 3)}%`);
	console.log(`Villagers/Coffers: ${Math.round((renaissanceBias/iterations)*100, 3)}%`);
	console.log(`Attack: ${Math.round((attackBias/iterations)*100, 3)}%`);
	console.log(`Trash: ${Math.round((trashBias/iterations)*100, 3)}%`);
	console.log(`Duration: ${Math.round((durationBias/iterations)*100, 3)}%`);
	console.log(`Buys: ${Math.round((buysBias/iterations)*100, 3)}%`);
	console.log(`Actions: ${Math.round((actionsBias/iterations)*100, 3)}%`);
	console.log(`Cards: ${Math.round((cardsBias/iterations)*100, 3)}%`);
	console.log(`Victory: ${Math.round((victoryBias/iterations)*100, 3)}%`);
	console.log(`Treasure: ${Math.round((treasureBias/iterations)*100, 3)}%`);
	console.log(`Everything Else: ${Math.round((everythingElseBias/iterations)*100, 3)}%`);
	console.log(`Expected win rates: ${Math.round(100/12, 3)}%`);
}

function countCards() {
	let sets = getCheckedSets();
	let filteredSets = filterBySets(_cards, sets);
	filteredSets = validateCardSet(filteredSets);

	console.log(`Night: ${filterByTypes(filteredSets, ['Night']).length}`)
	console.log(`Tavern: ${filterByTavern(filteredSets).length}`);
	console.log(`Villagers: ${filterByVillagers(filteredSets).length}`);
	console.log(`Coffers: ${filterByCoffers(filteredSets).length}`);
	console.log(`Attack: ${filterByTypes(filteredSets, ['Attack']).length}`);
	console.log(`Trash: ${filterByTrashCount(filteredSets, 1).length}`);
	console.log(`Duration: ${filterByTypes(filteredSets, ['Duration']).length}`);
	console.log(`Buys: ${filterByBuyCount(filteredSets, 1).length}`);
	console.log(`Cards: ${filterByCardDraw(filteredSets, 1).length}`);
	console.log(`Actions: ${filterByGreaterThanActionCount(filteredSets, 1).length}`);
	console.log(`Victory: ${filterByGreaterThanActionCount(filteredSets, 1).length}`);
	console.log(`Treasure: ${filterByTypes(filteredSets, ['Treasure']).length}`);
	console.log(`Everything Else: ' ${filterSetByEverythingElse(filteredSets).length}`);
}