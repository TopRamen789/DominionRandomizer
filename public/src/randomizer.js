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

	let chosenSet = CardUtilities.shuffle(sets).pop().map(card => card.replace(/^\w/, c => c.toUpperCase()));
	chosenSet = chosenSet.slice(1, 11);
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
	let unfinishedSet = costAggregates.reduce((acc,val) => {return acc+val.number;},0) != 10;
	let fourCost = chosenSet.filter(c => c == "Gardens" || c == "Potion" || c == "Island" || c == "Feodum");
	let fiveCost = chosenSet.filter(c => c == "Distant Lands");
	if(fourCost.length > 0 && unfinishedSet) {
		let costFourAggregate = costAggregates.filter(c => c.cost == 4);
		if(costFourAggregate.length === 0) {
			costAggregates.push({cost: 4, number: 0});
		}
		costAggregates.filter(c => c.cost == 4)[0].number += fourCost.length;
	}
	if(fiveCost.length > 0 && unfinishedSet) {
		let costFiveAggregate = costAggregates.filter(c => c.cost == 5);
		if(costFiveAggregate.length === 0) {
			costAggregates.push({cost: 5, number: 0});
		}
		costAggregates.filter(c => c.cost == 5)[0].number++;
	}
	let stillUnfinishedSet = costAggregates.reduce((acc,val) => {return acc+val.number;},0) != 10;
	if(stillUnfinishedSet)
		console.log(costAggregates, chosenSet);
	return costAggregates;
}

let pickRandomCardsFromFilteredCards = (cards, expansions, number) => {
	let filteredCards = CardUtilities.filterByExpansions(cards, expansions);
	return CardUtilities.pickRandomCardsFromCardSet(filteredCards, number);
}

let generateSideboardCards = (checkedSets) => {
	let sideboard = [];

	if(checkedSets.includes("Adventures") || checkedSets.includes("Empires")) {
		let eventCards = pickRandomCardsFromFilteredCards(CardUtilities.getEventCards(), checkedSets, utilities.randomInRange(4,8));
		sideboard = sideboard.concat(eventCards);
	}

	if(checkedSets.includes("Renaissance")) {
		let projectCards = pickRandomCardsFromFilteredCards(CardUtilities.getProjectCards(), checkedSets, 4);
		sideboard = sideboard.concat(CardUtilities.pickRandomCardsFromCardSet(projectCards, 4));
	}

	if(checkedSets.includes("Empires")) {
		let landmarkCards = pickRandomCardsFromFilteredCards(CardUtilities.getLandmarkCards(), checkedSets, 2);
		sideboard = sideboard.concat(landmarkCards); 
	}

	if(checkedSets.includes("Menagerie")) {
		let wayCards = pickRandomCardsFromFilteredCards(CardUtilities.getWayCards(), checkedSets, 2);
		sideboard = sideboard.concat(wayCards);
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