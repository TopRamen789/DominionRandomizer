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
	let validatedCards = validateCardSet(filterByExpansions(_cards, checkedSets));
	let randomizedCardSet = [];
	cardNumbers.forEach((cardNumber, idx) => {
		for(let i = 0; i < cardNumber.number; i++) {
			validatedCards = filterByOtherCardSet(validatedCards, randomizedCardSet);
			let cardSet = filterByCost(validatedCards, cardNumber.cost);
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
	
	// let minCost = Math.min(...costs);
	// let maxCost = Math.max(...costs);
	// so our standardDeviation has been found.
	// now we can build a standarddistribution with it.
	// randomInRange(minCost,maxCost);
}

let buildCostCurve = (checkedSets) => {
	// argh, this method is dedicated to building a card cost set,
	// so we don't really care about the contents of the set, UNLESS
	// I don't have cards from the set in my cards.js
	console.log(checkedSets);
	// filterByExpansions is required based on expansions the user owns.
	// validateCardSet is so we don't inadvertently get landmarks or projects or events
	// from our cards.js supply.
	let availableCards = validateCardSet(_cards);
	let sets = [];
	// this sorting logic has to be a little more sophisticated..
	// because sometimes we're getting cards from expansions we don't have access to
	// and that is happening because one of the other expansions that has a mix with that expansion
	// so, that means that I need to learn how to filter the sets further down.

	// Extra set checking because the sets don't have a primary key to the expansion they came from.
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

	// this removes any set that has a name equivalent to one of the menagerie sets.
	// this way, we can add all of the expansions predefined sets, but effectively remove menagerie.
	sets = sets.filter(set => !menagerieSets.map(m => m[0]).some(m => m === set[0]));
	// sets = sets.filter(set => filterBySet(base1ECards, set).length > 0)
	// 	.filter(set => filterBySet(base2ECards, set).length > 0)
	// 	.filter(set => filterBySet(intrigue2ECards, set).length > 0);
	let chosenSet = shuffle(sets).pop().map(card => card.replace(/^\w/, c => c.toUpperCase()));
	chosenSet = chosenSet.filter(c => c != "Potion");
	chosenSet = chosenSet.map(c => {
		if(c == "Jack of all Trades") {
			return "Jack of All Trades";
		}
		return c;
	});
	// let chosenSet = shuffle(chosenExpansion).pop();
	// console.log(chosenSet);
	let filteredSet = filterByNames(availableCards, chosenSet);
	// why do I need to filter by names?
	//ah, so this filters the cards I filtered at the top to just the chosen set.
	// the chosen set keeps getting filtered until I can get distinct costs of each of the cards.
	let distinctCosts = getDistinctCardCosts(filteredSet);
	console.log('chosenSet', chosenSet);
	console.log('filteredSet', filteredSet);
	let costAggregates = [];
	for(let i = 0; i < distinctCosts.length; i++) {
		let number = filteredSet.filter(f => f.cost == distinctCosts[i]).length;
		costAggregates.push({
			cost: distinctCosts[i],
			number: number
		});
	}
	console.log(costAggregates);
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
	let eventCards = getEventCards(checkedSets);
	let projectCards = getProjectCards(checkedSets);
	let landmarkCards = getLandmarkCards(checkedSets);
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
	buildSelectedCardSet(randomCards);
	const sideboard = addSideboardCards(checkedSets);
	buildSelectedSideboard(sideboard);
	if(!validateTenCardsTotal(randomCards)) {
		return;
	}
	clearBiasData();
}

export default {randomize};