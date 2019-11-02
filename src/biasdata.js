// procedural generation of cardsets.
const _biasPercent = .05;
const _setOffset = (getCheckedSets().length/2) * _biasPercent;
// I should perhaps create another offset that causes biases to win evenly

function normalizeBiases() {
	/*
	So in this method, we want to calculate card counts of each bias use that to even the percentages of each one winning
	*/
	let biases = getBiases();
	let biasCount = biases.length;
	// if(biases.indexOf(biasVillagers) > -1) // coffer/villager should be grouped methinks.
	// 	biasCount -= 1;
	// biasCount/cardCountOfType/totalCards = biasOffset?
	// 119 distinct cards
}

function bias(uses) {
	let bias = uses * _biasPercent;
	return (Math.random() + bias) > 0.5;
}

function specialBias(uses, specialBias) {
	let bias = uses * specialBias;
	return (Math.random() + bias) > 0.5;	
}

function biasAttack(currentSet, availableCards) {
	let biasedSet = shuffle(availableCards.slice());
	let filter = filterByTypes(availableCards, ['Attack']);
	// console.log(`Attack: ${filter.length}`);
	let uses = filterByTypes(currentSet, ['Attack']).length;
	if(bias(uses))
		biasedSet = filter;
	return biasedSet;
}

function biasTrash(currentSet, availableCards) {
	let biasedSet = shuffle(availableCards.slice());
	let filter = filterByTrashCount(availableCards, 1);
	// console.log(`Trash: ${filter.length}`);
	let uses = filterByTrashCount(currentSet, 1).length;
	if(bias(uses))
		biasedSet = filter;
	return biasedSet;
}

function biasDuration(currentSet, availableCards) {
	let biasedSet = shuffle(availableCards.slice());
	let filter = filterByTypes(availableCards, ['Duration']);
	// console.log(`Duration: ${filter.length}`);
	let uses = filterByTypes(currentSet, ['Duration']).length;
	if(bias(uses))
		biasedSet = filter;
	return biasedSet;
}

function biasBuys(currentSet, availableCards) {
	let biasedSet = shuffle(availableCards.slice());
	let filter = filterByBuyCount(availableCards, 1);
	// console.log(`Buys: ${filter.length}`);
	let uses = filterByBuyCount(currentSet, 1).length;
	if(bias(uses))
		biasedSet = filter;
	return biasedSet;
}

function biasNight(currentSet, availableCards) {
	let biasedSet = shuffle(availableCards.slice());
	let filter = filterByTypes(availableCards, ['Night']);
	// console.log(`Night: ${filter.length}`);
	let uses = filterByTypes(currentSet, ['Night']).length;
	if(bias(uses))
		biasedSet = filter;
	return biasedSet;
}

function biasTavern(currentSet, availableCards) {
	let biasedSet = shuffle(availableCards.slice());
	let filter = filterByTavern(availableCards);
	// console.log(`Tavern: ${filter.length}`);
	let uses = filterByTavern(currentSet).length;
	if(bias(uses))
		biasedSet = filter;
	return biasedSet;
}

function biasVillagers(currentSet, availableCards) {
	let biasedSet = shuffle(availableCards.slice());
	let filter = filterByVillagers(availableCards);
	// console.log(`Villagers: ${filter.length}`);
	let uses = filterByVillagers(currentSet).length;
	if(bias(uses))
		biasedSet = filter;
	return biasedSet;
}

function biasCoffers(currentSet, availableCards) {
	let biasedSet = shuffle(availableCards.slice());
	let filter = filterByCoffers(availableCards);
	// console.log(`Coffers: ${filter.length}`);
	let uses = filterByCoffers(currentSet).length;
	if(bias(uses))
		biasedSet = filter;
	return biasedSet;
}

// still need to modify the data set more for this one.
// function biasTokens(currentSet, availableCards) {
// 	let biasedSet = availableCards.slice();
// 	if(filterByTokens(availableCards).length > 0) {
// 		let uses = filterByTokens(currentSet);
// 		if(bias(uses))
// 			biasedSet = filterByTokens(availableCards);
// 	}
// 	return shuffle(biasedSet);
// }

function biasEverythingElse(currentSet, availableCards) {
	let biasedSet = shuffle(availableCards.slice());
	let filter = filterSetByEverythingElse(availableCards);
	let shortBiases = filter.map(card => card.name);
	let uses = currentSet.filter((card) => {
		return shortBiases.includes(card);
	}).length;
	if(bias(uses))
		biasedSet = filter;
	return biasedSet;
}

function getBiases() {
	let biases = [];
	biases.push(biasDuration);
	biases.push(biasBuys);
	biases.push(biasAttack);
	biases.push(biasTrash);
	biases.push(biasTavern);
	biases.push(biasVillagers);
	biases.push(biasCoffers);
	biases.push(biasNight);
	// biases.push(biaseTokens);
	biases.push(biasEverythingElse);
	biases = shuffle(biases);
	return biases;
}

function displayNocturneBias(currentSet) {
	let biasData = [];
	if(hasNocturne(currentSet))
		biasData.push({
			type: 'Night',
			percent: (filterByTypes(currentSet, ['Night']).length * _biasPercent)*100
		});
	return biasData;
}

function displayAdventuresBias(currentSet) {
	let biasData = [];
	if(hasAdventures(currentSet))
		biasData.push({
			type: 'Tavern',
			percent: (filterByTavern(currentSet).length * _biasPercent)*100
		});
	return biasData;
}

function displayRenaissanceBias(currentSet) {
	let biasData = [];
	if(hasRenaissance(currentSet)) {
		biasData.push({
			type: 'Villagers/Coffers',
			percent: ((filterByVillagers(currentSet).length * _biasPercent)*100) + ((filterByCoffers(currentSet).length * _biasPercent)*100)
		});
	}
	return biasData;
}

function displayAttackBias(currentSet) {
	let biasData = [];
	if(hasAttack(currentSet))
		biasData.push({
			type: 'Attack',
			percent: (filterByTypes(currentSet, ['Attack']).length * _biasPercent)*100
		});
	return biasData;
}

function displayTrashBias(currentSet) {
	let biasData = [];
	if(hasTrash(currentSet))
		biasData.push({
			type: 'Trash',
			percent: (filterByTrashCount(currentSet, 1).length * _biasPercent)*100
		});
	return biasData;
}

function displayDurationBias(currentSet) {
	let biasData = [];
	if(hasDuration(currentSet))
		biasData.push({
			type: 'Duration',
			percent: (filterByTypes(currentSet, ['Duration']).length * _biasPercent)*100
		});
	return biasData;
}

function displayBuysBias(currentSet) {
	let biasData = [];
	if(hasBuys(currentSet))
		biasData.push({
			type: 'Buys',
			percent: (filterByBuyCount(currentSet, 1).length * _biasPercent)*100
		});
	return biasData;
}

function displayEverythingElse(currentSet) {
	let biasData = [];
	biasData.push({
		type: 'Everything Else',
		percent: (filterSetByEverythingElse(currentSet).length * _biasPercent)*100
	});
	return biasData;

}

function clearBiasData() {
	let biasDataUI = document.querySelector("#biasData");
	disposeChildren(biasDataUI);
}

function getBiasData(currentSet) {
	let biasData = [];
	biasData = biasData.concat(displayNocturneBias(currentSet));
	biasData = biasData.concat(displayAdventuresBias(currentSet));
	biasData = biasData.concat(displayRenaissanceBias(currentSet));
	biasData = biasData.concat(displayAttackBias(currentSet));
	biasData = biasData.concat(displayTrashBias(currentSet));
	biasData = biasData.concat(displayDurationBias(currentSet));
	biasData = biasData.concat(displayBuysBias(currentSet));
	biasData = biasData.concat(displayEverythingElse(currentSet));
	return biasData;
}

function displayBiasData(currentSet) {
	clearBiasData();

	let biasData = getBiasData(currentSet);

	let biasDataUI = document.querySelector("#biasData");
	biasData.map((bias) => {
		let className = '';
		if(bias.percent > 20)
			className = 'anomalousHigh';
		if(bias.percent <= 5)
			className = 'anomalousLow';
		let percent = div(`${round(bias.percent, 2)}%`, {className: className});
		let type = div(bias.type, {className: className});
		biasDataUI.appendChild(percent);
		biasDataUI.appendChild(type);
	});
}