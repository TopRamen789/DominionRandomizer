import _cards from './data/cards_module';
import utilities from './utilities';
import validation from './validation';
import CardUtilities from './CardUtilities';

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
	let validatedCards = validation.validateCardSet(CardUtilities.filterByExpansions(_cards, checkedSets));
	let randomizedCardSet = [];
	cardNumbers.forEach((cardNumber, idx) => {
		for(let i = 0; i < cardNumber.number; i++) {
			validatedCards = CardUtilities.filterByOtherCardSet(validatedCards, randomizedCardSet);
			let cardSet = CardUtilities.filterByCost(validatedCards, cardNumber.cost);
			cardSet = CardUtilities.shuffle(cardSet);
			let card = cardSet.pop();
			randomizedCardSet.push(card);
		}
	});
	return randomizedCardSet;
}

let buildRandomCostDistributionFromSets = (checkedSets) => {
	let availableCards = CardUtilities.filterByExpansions(_cards, checkedSets);
	let costs = availableCards.filter(c => c.cost != "" && c.cost != null).map(c => c.cost);
	let standardDeviation = findStandardDeviation(costs);
}

let buildCostCurve = (checkedSets) => {
	let availableCards = validation.validateCardSet(_cards);
	let sets = [];

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

	sets = sets.filter(set => !menagerieSets.map(m => m[0]).some(m => m === set[0]));
	let chosenSet = CardUtilities.shuffle(sets).pop().map(card => card.replace(/^\w/, c => c.toUpperCase()));
	chosenSet = chosenSet.filter(c => c != "Potion");
	chosenSet = chosenSet.map(c => {
		if(c == "Jack of all Trades") {
			return "Jack of All Trades";
		}
		return c;
	});
	let filteredSet = CardUtilities.filterByNames(availableCards, chosenSet);
	let distinctCosts = CardUtilities.getDistinctCardCosts(filteredSet);
	let costAggregates = [];
	for(let i = 0; i < distinctCosts.length; i++) {
		let number = filteredSet.filter(f => f.cost == distinctCosts[i]).length;
		costAggregates.push({
			cost: distinctCosts[i],
			number: number
		});
	}
	return costAggregates;
}

let generateSideboardCards = (checkedSets) => {
	let sideboard = [];

	if(checkedSets.includes("Adventures") || checkedSets.includes("Empires")) {
		let eventCards = CardUtilities.getEventCards();
		eventCards = CardUtilities.filterByExpansions(eventCards, checkedSets);
		sideboard = sideboard.concat(CardUtilities.pickRandomCardsFromCardSet(eventCards, utilities.randomInRange(4,8)));
	}

	if(checkedSets.includes("Renaissance")) {
		let projectCards = CardUtilities.getProjectCards();
		projectCards = CardUtilities.filterByExpansions(projectCards, checkedSets);
		sideboard = sideboard.concat(CardUtilities.pickRandomCardsFromCardSet(projectCards, 4));
	}

	if(checkedSets.includes("Empires")) {
		let landmarkCards = CardUtilities.getLandmarkCards();
		landmarkCards = CardUtilities.filterByExpansions(landmarkCards, checkedSets);
		sideboard = sideboard.concat(CardUtilities.pickRandomCardsFromCardSet(landmarkCards, 2)); 
	}
	return sideboard;
}

let addSideboardCards = (checkedSets) => {
	return generateSideboardCards(checkedSets);
}

let displaySelectedSets = () => {
	let checkedSets = utilities.getCheckedExpansions();
	let sets = filterByExpansions(cards, checkedSets);
	buildCardSetUI(sets, document.querySelector("#displaySets"));
}

let randomize = () => {
	let checkedSets = utilities.getCheckedExpansions();
	let cardNumbers = buildCostCurve(checkedSets);
	let randomCards = buildRandomSetFromInputs(cardNumbers, checkedSets);
	CardUtilities.buildSelectedCardSet(randomCards);
	const sideboard = addSideboardCards(checkedSets);
	CardUtilities.buildSelectedSideboard(sideboard);
	while(!randomCards.length == 10) {
		randomize();
	}
	return randomCards;
}

export default {randomize};