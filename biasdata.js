// procedural generation of cardsets.
var _biasPercent = .05;

function bias(uses) {
	let bias = uses * _biasPercent;
	return (Math.random() + bias) > 0.5;
}

function specialBias(uses, specialBias) {
	let bias = uses * specialBias;
	return (Math.random() + bias) > 0.5;	
}

function biasAttack(currentSet, availableCards) {
	let biasedSet = availableCards.slice();
	let filter = filterByTypes(availableCards, ['Attack']);
	let uses = filter.length;
	if(uses > 0) {
		if(bias(uses))
			biasedSet = filter;
	}
	return shuffle(biasedSet);
}

function biasTrash(currentSet, availableCards) {
	let biasedSet = availableCards.slice();
	let filter = filterByTrashCount(availableCards, 0);
	let uses = filter.length;
	if(uses > 0) {
		if(bias(uses))
			biasedSet = filter;
	}
	return shuffle(biasedSet);
}

function biasDuration(currentSet, availableCards) {
	let biasedSet = availableCards.slice();
	let filter = filterByTypes(availableCards, ['Duration']);
	let uses = filter.length;
	if(uses > 0) {
		if(bias(uses))
			biasedSet = filter;
	}
	return shuffle(biasedSet);
}

function biasBuys(currentSet, availableCards) {
	let biasedSet = availableCards.slice();
	let filter = filterByBuyCount(availableCards, 0);
	let uses = filter.length;
	if(uses > 0) {
		if(bias(uses))
			biasedSet = filter;
	}
	return shuffle(biasedSet);
}

/*SPECIAL, because for some reason night cards get more heavily biased than others*/
function biasNight(currentSet, availableCards) {
	let biasedSet = availableCards.slice();
	let filter = filterByTypes(availableCards, ['Night']);
	let uses = filter.length;
	if(uses > 0) {
		if(specialBias(uses, .025))
			biasedSet = filter;
	}
	return shuffle(biasedSet);
}

function biasTavern(currentSet, availableCards) {
	let biasedSet = availableCards.slice();
	let filter = filterByTavern(availableCards);
	let uses = filter.length;
	if(uses > 0) {
		if(bias(uses))
			biasedSet = filter;
	}
	return shuffle(biasedSet);
}

function biasVillagers(currentSet, availableCards) {
	let biasedSet = availableCards.slice();
	let filter = filterByVillagers(availableCards);
	let uses = filter.length;
	if(uses > 0) {
		if(bias(uses))
			biasedSet = filter;
	}
	return shuffle(biasedSet);
}

function biasCoffers(currentSet, availableCards) {
	let biasedSet = availableCards.slice();
	let filter = filterByCoffers(availableCards);
	let uses = filter.length;
	if(uses > 0) {
		if(bias(uses))
			biasedSet = filter;
	}
	return shuffle(biasedSet);
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

// function useEvents(currentSet) {
// 	// we could do a math.random here or set it based on the currentSet.
// 	// let uses = filterByTavern(currentSet);
// 	// if(bias(uses))
// 	// bias the events?
// }

// function useProjects() {
// 	//
// }

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
	biases = shuffle(biases);
	// biasTokens(currentSet, availableSet); // data isn't great on this one...
	return biases;
}

function displayNocturneBias(currentSet) {
	let biasData = [];
	if(hasNocturne(currentSet))
		biasData.push({
			type: 'Night',
			percent: filterByTypes(currentSet, ['Night']).length * _biasPercent
		});
	return biasData;
}

function displayAdventuresBias(currentSet) {
	let biasData = [];
	if(hasAdventures(currentSet))
		biasData.push({
			type: 'Tavern',
			percent: filterByTavern(currentSet).length * _biasPercent
		});
	return biasData;
}

function displayRenaissanceBias(currentSet) {
	let biasData = [];
	if(hasRenaissance(currentSet)) {
		biasData.push({
			type: 'Villagers',
			percent: filterByVillagers(currentSet).length * _biasPercent
		});

		biasData.push({
			type: 'Coffers',
			percent: filterByCoffers(currentSet).length * _biasPercent
		});
	}
	return biasData;
}

function displayAttackBias(currentSet) {
	let biasData = [];
	if(hasAttack(currentSet))
		biasData.push({
			type: 'Attack',
			percent: filterByTypes(currentSet, ['Attack']).length * _biasPercent
		});
	return biasData;
}

function displayTrashBias(currentSet) {
	let biasData = [];
	if(hasTrash(currentSet))
		biasData.push({
			type: 'Trash',
			percent: filterByTrashCount(currentSet, 1).length * _biasPercent
		});
	return biasData;
}

function displayDurationBias(currentSet) {
	let biasData = [];
	if(hasDuration(currentSet))
		biasData.push({
			type: 'Duration',
			percent: filterByTypes(currentSet, ['Duration']).length * _biasPercent
		});
	return biasData;
}

function displayBuysBias(currentSet) {
	let biasData = [];
	if(hasBuys(currentSet))
		biasData.push({
			type: 'Buys',
			percent: filterByBuyCount(currentSet, 1).length * _biasPercent
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
	return biasData;
}

function displayBiasData(currentSet) {
	clearBiasData();

	let biasData = getBiasData(currentSet);

	let biasDataUI = document.querySelector("#biasData");
	biasData.map((bias) => {
		let style = bias.percent > 0.2 ? 'background-color: #a62f00' : '';

		let percent = div(`${round(bias.percent, 2)}%`);
		percent.style = style;
		
		let type = div(bias.type);
		type.style = style;

		biasDataUI.appendChild(percent);
		biasDataUI.appendChild(type);
	});
}
