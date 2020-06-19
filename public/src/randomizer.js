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
	let randomizedCardSet = [];
	cardNumbers.forEach((cardNumber, idx) => {
		for(let i = 0; i < cardNumber.number; i++) {
			let cardSet = getAvailableCards(randomizedCardSet, checkedSets, cardNumber.cost);
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
	let availableCards = filterByExpansions(_cards, checkedSets);
	let firstGame = [2,2,3,3,3,4,4,4,5,5];
}

let getAvailableCards = (currentCards, sets, cost) => {
	let alreadyPickedCards = currentCards.filter(card => card.cost === cost);
	let validatedCards = getCardsWithCostInSets(sets, cost);
	validatedCards = filterByOtherCardSet(validatedCards, alreadyPickedCards);
	validatedCards = validateCardSet(validatedCards);
	return validatedCards;
}

let selectCards = (cardNumbers, checkedSets) => {
	let randomizedCardSet = buildRandomSetFromInputs(cardNumbers, checkedSets);
	return randomizedCardSet;
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
	let checkedSets = getCheckedSets();
	let sets = filterByExpansions(cards, checkedSets);
	buildCardSetUI(sets, document.querySelector("#displaySets"));
}

let randomize = () => {
	let checkedSets = getCheckedExpansions();
	// let cardNumbers = buildRandomCostDistributionFromSets(checkedSets);
	let cardNumbers = buildCostCurve(checkedSets);
	let randomCards = selectCards(cardNumbers, checkedSets);
	buildCardSetUI(randomCards);
	const sideboard = addSideboardCards(checkedSets);
	buildSelectedSideboard(sideboard);
	if(!validateTenCardsTotal(randomCards)) {
		return;
	}
	clearBiasData();
	buildSelectedCardSet(randomCards);
}