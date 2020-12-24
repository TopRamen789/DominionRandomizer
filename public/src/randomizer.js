import _cards from './data/cards_module';
import utilities from './utilities';
import validation from './validation';
import CardUtilities from './CardUtilities';
import CardEconomy from './CardEconomy';
import predefinedSets from './data/predefined_cost_curves';

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

let buildRandomSetFromInputs = (cardNumbers, checkedSets, validatedCards) => {
	if(validatedCards == null) {
		validatedCards = validation.validateCardSet(CardUtilities.filterByExpansions(_cards, checkedSets));
		validatedCards = CardUtilities.filterByNotNames(validatedCards, ["Castles"]); // because we leave this in the supply by default
	}
	let randomizedCardSet = [];
	// Check min/max capabilities of validated cards.
	let maxCost = Math.max.apply(null, cardNumbers.map(n => n.cost));
	let minCost = Math.min.apply(null, cardNumbers.filter(c => c.cost != "").map(n => n.cost));
	let noSuchMax = CardUtilities.filterByCost(validatedCards, maxCost).length == 0;
	let noSuchMin = CardUtilities.filterByCost(validatedCards, minCost).length == 0;
	let noSuchDebt = CardUtilities.filterByCost(validatedCards, "").length == 0 
		&& cardNumbers.find(c => c.cost == "") != null;

	while(noSuchMax) {
		//debugger;
		console.log(`Max cost ${maxCost} doesn't exist in available cards.`);
		cardNumbers.find(c => c.cost == maxCost).cost = maxCost-1;
		maxCost -= 1;
		noSuchMax = CardUtilities.filterByCost(validatedCards, maxCost).length == 0;
	}

	while(noSuchMin) {
		//debugger;
		console.log(`Min cost ${minCost} doesn't exist in available cards.`);
		cardNumbers.find(c => c.cost == maxCost).cost = minCost+1;
		minCost += 1;
		noSuchMin = CardUtilities.filterByCost(validatedCards, minCost).length == 0;
	}

	if(noSuchDebt) {
		//debugger;
		console.log("Debt doesn't exist in available cards.", cardNumbers);
		cardNumbers.find(c => c.cost == "").cost = Math.floor(Math.random() * (maxCost - minCost) + 1) + minCost;
	}

	let newCardNumbers = [];
	cardNumbers.forEach((cardNumber) => {
		for(let i = 0; i < cardNumber.number; i++) {
			validatedCards = CardUtilities.filterByOtherCardSet(validatedCards, randomizedCardSet);
			let cardSet = CardUtilities.filterByCost(validatedCards, cardNumber.cost);
			cardSet = CardUtilities.shuffle(cardSet);
			let card = cardSet.pop();
			// Some cost curves don't match the available cards - i.e. a "Bank" from Prosperity
			// costs 7, which is too high for some expansions to meet.
			// and sometimes, there's not enough validated cards to satisfy some costs in a cost curve.
			if(card == null) {
				// Spread remainders, if any.
				let numberDiff = cardNumber.number - i;
				if(numberDiff > 0) {
					console.log(i, cardNumber.number, numberDiff);
					console.log("Not enough cards in available set to satsify cost curve, redistributing...");
					let newCost = Math.floor(Math.random() * (maxCost - minCost) + 1) + minCost;
					while(newCost == cardNumber.cost) {
						newCost = Math.floor(Math.random() * (maxCost - minCost) + 1) + minCost;
					}
					for(let j = 0; j < numberDiff; j++) {
						let cardSet = CardUtilities.filterByCost(validatedCards, newCost);
						cardSet = CardUtilities.shuffle(cardSet);
						let card = cardSet.pop();
						randomizedCardSet.push(card);
					}
				}
				// console.error("UNDEFINED", validatedCards.map(v => v.name));
				// console.error("UNDEFINED", randomizedCardSet.map(v => v.name));
				// console.error("UNDEFINED", cardNumber.cost);
				// console.error("UNDEFINED", cardSet);
			} else {
				randomizedCardSet.push(card);
			}
		}
	});

	// if(randomizedCardSet.length == 10) {
	// 	console.log(randomizedCardSet);
	// }
	return randomizedCardSet;
}

let buildRandomCostDistributionFromSets = (checkedSets) => {
	let availableCards = CardUtilities.filterByExpansions(_cards, checkedSets);
	let costs = availableCards.filter(c => c.cost != "" && c.cost != null).map(c => c.cost);
	let standardDeviation = findStandardDeviation(costs);
}

let buildCostCurve = (checkedSets, withCheckedSetValidation) => {
	let availableCards = validation.validateCardSet(_cards);
	let sets = [];

	if(withCheckedSetValidation) {
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
	} else {
		// concat all of them
		sets = sets.concat(alchemySets);
		sets = sets.concat(cornucopiaSets);
		sets = sets.concat(darkAgesSets);
		sets = sets.concat(dominionBaseSets);
		sets = sets.concat(empiresSets);
		sets = sets.concat(guildsSets);
		sets = sets.concat(hinterlandsSets);
		sets = sets.concat(intrigueSets);
		sets = sets.concat(menagerieSets);
		sets = sets.concat(nocturneSets);
		sets = sets.concat(prosperitySets);
		sets = sets.concat(renaissanceSets);
		sets = sets.concat(seasideSets);
	}

	let chosenSet = CardUtilities.shuffle(sets).pop().map(card => card.replace(/^\w/, c => c.toUpperCase()));
	chosenSet = chosenSet.slice(1, 11);
	let filteredSet = CardUtilities.filterByNames(availableCards, chosenSet);
	let distinctCosts = CardUtilities.getDistinctCardCosts(filteredSet);
	let costAggregates = [];
	distinctCosts.forEach((cost) => {
		let number = filteredSet.filter(f => f.cost == cost).length;
		costAggregates.push({
			cost: cost,
			number: number
		});
	});
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
	// CardEconomy.rebuildPredefinedSetCostCurves();
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

const randomize = () => {
	const checkedSets = utilities.getCheckedExpansions();
	const cardNumbers = buildCostCurve(checkedSets, true);
	const randomCards = buildRandomSetFromInputs(cardNumbers, checkedSets);
	CardUtilities.buildSelectedCardSet(randomCards);
	const sideboard = addSideboardCards(checkedSets);
	CardUtilities.buildSelectedSideboard(sideboard);
	// this is pretty gross.
	while(!randomCards.length == 10) {
		randomize();
	}
	return randomCards;
}

// const buildRandomHolidaySet = (cardNumbers) => {
// 	const validatedCards = validation.validateCardSet(CardUtilities.filterByExpansions(_cards, ["Holiday"]));
// 	const randomizedCardSet = [];
// 	cardNumbers.forEach((cardNumber) => {
// 		for(let i = 0; i < cardNumber.number; i++) {
// 			validatedCards = CardUtilities.filterByOtherCardSet(validatedCards, randomizedCardSet);
// 			const cardSet = CardUtilities.filterByCost(validatedCards, cardNumber.cost);
// 			cardSet = CardUtilities.shuffle(cardSet);
// 			const card = cardSet.pop();
// 			randomizedCardSet.push(card);
// 		}
// 	});
// 	return randomizedCardSet;
// }

const holidayRandomize = () => {
	// we're not using checkedSets for anything but the sideboard
	const checkedSets = ["Adventures", "Empires", "Renaissance", "Menagerie", "Holiday"];
	const cardNumbers = buildCostCurve(checkedSets, false); // hence why we're passing false here.
	const randomCards = buildRandomSetFromInputs(cardNumbers, ["Holiday"]);
	CardUtilities.buildSelectedCardSet(randomCards);
	const sideboard = addSideboardCards(checkedSets);
	CardUtilities.buildSelectedSideboard(sideboard);
	// still gross.
	while(!randomCards.length == 10) {
		holidayRandomize();
	}
	return randomCards;
}

let winterSeasonalRandomize = () => {
	const checkedSets = utilities.getCheckedExpansions();
	const cardNumbers = buildCostCurve(checkedSets, false);

	// This is a handpicked set of Kingdom cards to best match a wintery season - since the holiday card set won't be here by Christmas, maybe this'll work.
	let validatedCards = CardUtilities.filterByNames(_cards, [
		"Snowy Village",
		"Sleigh",
		"Supplies",
		"Stockpile",
		"Goatherd",
		"Artisan",
		"Workshop",
		"Library",
		"Market",
		"Festival",
		"Cellar",
		"Chapel",
		"Moneylender",
		"Feast",
		"Warehouse",
		"Forge",
		"Grand Market",
		"Vault",
		"Candlestick Maker",
		"Baker",
		"Taxman",
		"Butcher",
		"Masterpiece",
		"Messenger",
		"Storyteller",
		"Artificer",
		"Coin of the Realm",
		"Charm",
		"City Quarter",
		"Royal Blacksmith",
		"Bustling Village",
		"Acting Troupe",
		"Treasurer",
		"Spices",
		"Priest"
	]);
	const randomCards = buildRandomSetFromInputs(cardNumbers, checkedSets, validatedCards);
	CardUtilities.buildSelectedCardSet(randomCards);
	const sideboard = addSideboardCards(checkedSets);
	CardUtilities.buildSelectedSideboard(sideboard);
	while(!randomCards.length == 10) {
		winterSeasonalRandomize();
	}
	return randomCards;
}

export default {randomize, holidayRandomize, winterSeasonalRandomize};