let getCardNumberInputs = () => {
	let inputs = [].slice.call(document.querySelectorAll("input"));
	let cardNumbers = inputs.filter((input) => {
		return !isNaN(parseInt(input.attributes["id"].value[0], 10)) && input.attributes["id"].value.includes("cost");
	}).map((input) => {
		let card = {
			number: parseInt(input.value, 10),
			cost: parseInt(input.attributes["id"].value[0], 10)
		};
		return card;
	});
	return cardNumbers;
}

let buildRandomSetFromInputs = (cardNumbers, checkedSets) => {
	let validatedCards = validateCardSet(_cards);
	let randomizedCardSet = [];
	cardNumbers.forEach((cardNumber, idx) => {
		for(let i = 0; i < cardNumber.number; i++) {
			validatedSet = filterByOtherCardSet(validatedCards, randomizedCardSet);
			let cost = parseInt(cardNumber.cost);
			let cardSet = filterByCost(validatedCards, cost);
			cardSet = shuffle(cardSet);
			let card = cardSet.pop();
			randomizedCardSet.push(card);
		}
	});
	return randomizedCardSet;
}

let buildRandomCostDistributionFromSets = (checkedSets) => {
	let availableCards = filterByExpansions(_cards, checkedSets);
	// let validatedCards = validateCardSet(availableCards);
	let costs = availableCards.filter(c => c.cost != "" && c.cost != null).map(c => c.cost);
	let standardDeviation = findStandardDeviation(costs);
	console.log(costs, standardDeviation);
	
	// let minCost = Math.min(...costs);
	// let maxCost = Math.max(...costs);
	// so our standardDeviation has been found.
	// now we can build a standarddistribution with it.
	// randomInRange(minCost,maxCost);
}

let buildCostCurve = (checkedSets) => {
	let availableCards = validateCardSet(filterByExpansions(_cards, checkedSets));
	let sets = [];
	if(checkedSets.indexOf('Alchemy') > -1)
		sets = sets.concat(alchemySets);
	if(checkedSets.indexOf('Cornucopia') > -1)
		sets = sets.concat(cornucopiaSets);
	if(checkedSets.indexOf('Dark Ages') > -1)
		sets = sets.concat(darkAgesSets);
	if(checkedSets.indexOf('Base, 1E') > -1)
		sets = sets.concat(dominionBaseSets);
	if(checkedSets.indexOf('Empires') > -1)
		sets = sets.concat(empiresSets);
	if(checkedSets.indexOf('Guilds') > -1)
		sets = sets.concat(guildsSets);
	if(checkedSets.indexOf('Hinterlands') > -1)
		sets = sets.concat(hinterlandsSets);
	if(checkedSets.indexOf('Intrigue 2E') > -1)
		sets = sets.concat(intrigueSets);
	if(checkedSets.indexOf('Menagerie') > -1)
		sets = sets.concat(menagerieSets);
	if(checkedSets.indexOf('Nocturne') > -1)
		sets = sets.concat(nocturneSets);
	if(checkedSets.indexOf('Prosperity') > -1)
		sets = sets.concat(prosperitySets);
	if(checkedSets.indexOf('Renaissance') > -1)
		sets = sets.concat(renaissanceSets);
	if(checkedSets.indexOf('Seaside') > -1)
		sets = sets.concat(seasideSets);
	console.log(sets);
	let chosenSet = shuffle(sets).pop();
	// let chosenSet = shuffle(chosenExpansion).pop();
	// console.log(chosenExpansion);
	let filteredSet = filterByNames(availableCards, chosenSet);
	// console.log(chosenSet);
	console.log(chosenSet, filteredSet);
	let distinctCosts = getDistinctCardCosts(filteredSet);
	console.log(distinctCosts);
	let costAggregates = [];
	for(let distinctCost in distinctCosts) {
		let number = filteredSet.filter(f => f.cost == distinctCost).length;
		costAggregates.push({
			cost: distinctCost,
			number: number
		});
	}
	return costAggregates;
}

let getEventCards = (checkedSets) => {
	if(checkedSets.includes("Adventures") || checkedSets.includes("Empires")) {
		let randomCards = [];
		randomCards = _cards.filter((card) => {
			return card.types.includes("Event") && checkedSets.includes(card.set);
		});
		return randomCards;
	}
	return [];
}

let getProjectCards = (checkedSets) => {
	if(checkedSets.includes("Renaissance")) {
		let randomCards = [];
		randomCards = _cards.filter((card) => {
			return card.types.includes("Project") && checkedSets.includes(card.set);
		});
		return randomCards;
	}
	return [];
}

let getLandmarkCards = (checkedSets) => {
	if(checkedSets.includes("Empires")) {
		let randomCards = [];
		randomCards = _cards.filter((card) => {
			return card.types.includes("Landmark") && checkedSets.includes(card.set);
		});
		return randomCards;
	}
	return [];
}

let generateSideboardCards = (checkedSets) => {
	let sideboard = [];
	eventCards = getEventCards(checkedSets);
	projectCards = getProjectCards(checkedSets);
	landmarkCards = getLandmarkCards(checkedSets);
	sideboard = sideboard.concat(pickRandomCardsFromCardSet(eventCards, randomInRange(4,8)));
	sideboard = sideboard.concat(pickRandomCardsFromCardSet(projectCards, 4));
	sideboard = sideboard.concat(pickRandomCardsFromCardSet(landmarkCards, 2)); 
	return sideboard;
}

let addSideboardCards = (checkedSets) => {
	return generateSideboardCards(checkedSets);
}

let displaySelectedSets = () => {
	let checkedSets = getCheckedExpansions();
	let sets = filterByExpansions(cards, checkedSets);
	buildCardSetUI(sets, document.querySelector("#displaySets"));
}

let randomize = () => {
	let checkedSets = getCheckedExpansions();
	// let cardNumbers = buildRandomCostDistributionFromSets(checkedSets);
	let cardNumbers = buildCostCurve(checkedSets);
	let randomCards = buildRandomSetFromInputs(cardNumbers, checkedSets);
	console.log(randomCards);
	buildSelectedCardSet(randomCards);
	const sideboard = addSideboardCards(checkedSets);
	buildSelectedSideboard(sideboard);
	if(!validateTenCardsTotal(randomCards)) {
		return;
	}
	clearBiasData();
}