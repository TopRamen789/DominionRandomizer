function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

function filterByTavern(cardSet) {
	return cardSet.filter((card) => {
		return card.useTavern;
	});
}

function filterByVillagersAndCoffers(cardSet) {
	return cardSet.filter((card) => {
		return card.useVillagers || card.useCoffers;
	});
}

function filterByVillagers(cardSet) {
	return cardSet.filter((card) => {
		return card.useVillagers;
	});
}

function filterByCoffers(cardSet) {
	return cardSet.filter((card) => {
		return card.useCoffers;
	})
}

function filterByCardDraw(cardSet, cardDraw) {
	return cardSet.filter((card) => {
		return card.cards >= cardDraw;
	});
}

function filterByCardDrawCount(cardSet, cardCount) {
	return cardSet.filter((card) => {
		return card.cards == cardCount;
	});
}

function filterByGreaterThanActionCount(cardSet, actionCount) {
	return cardSet.filter((card) => {
		return card.actions >= actionCount;
	});
}

function filterByActionCount(cardSet, actionCount) {
	return cardSet.filter((card) => {
		return card.actions == actionCount;
	});
}

function filterByTypes(cardSet, filterTypes) {
	return cardSet.filter((card) => {
		let types = card.types.split(" - ");
		return types.filter(type => filterTypes.includes(type)).length > 0;
	});
}

function filterByNotType(cardSet, filterTypes) {
	return cardSet.filter((card) => {
		let types = card.types.split(" - ");
		return !types.filter(type => filterTypes.includes(type)).length > 0;
	});
}

function filterByCost(cardSet, cost) {
	return cardSet.filter((card) => {
		return card.cost === cost;
	});
}

function filterByTrashCount(cardSet, trashCount) {
	return cardSet.filter((card) => {
		return card.trash >= trashCount;
	});
}

function filterByBuyCount(cardSet, buyCount) {
	return cardSet.filter((card) => {
		return card.buys >= buyCount;
	});	
}

function filterSetByEverythingElse(currentSet) {
	let biasedSet = currentSet.slice();
	let attackTypes = filterByTypes(currentSet, ['Attack']);
	biasedSet = biasedSet.filter(card => {
		return !attackTypes.includes(card);
	});
	let trashCount = filterByTrashCount(currentSet, 1);
	biasedSet = biasedSet.filter(card => {
		return !trashCount.includes(card);
	});
	let durationTypes = filterByTypes(currentSet, ['Duration']);
	biasedSet = biasedSet.filter(card => {
		return !durationTypes.includes(card);
	});
	let buyCount = filterByBuyCount(currentSet, 1);
	biasedSet = biasedSet.filter(card => {
		return !buyCount.includes(card);
	});
	let nightTypes = filterByTypes(currentSet, ['Night']);
	biasedSet = biasedSet.filter(card => {
		return !nightTypes.includes(card);
	});
	let tavern = filterByTavern(currentSet);
	biasedSet = biasedSet.filter(card => {
		return !tavern.includes(card);
	});
	let villagers = filterByVillagers(currentSet);
	biasedSet = biasedSet.filter(card => {
		return !villagers.includes(card);
	});
	let coffers = filterByCoffers(currentSet);
	biasedSet = biasedSet.filter(card => {
		return !coffers.includes(card);
	});
	return biasedSet;
}

function filterBySets(cardSet, sets) {
	return cardSet.filter((card) => {
		return sets.includes(card.set);
	});
}

function filterByOtherCardSet(cardSet, otherSet) {
	let names = otherSet.map(card => card.name);
	return cardSet.filter(card => !names.includes(card.name));
}

function sortByCost(cardSet) {
	return cardSet.sort((a,b) => {
		if(a.cost < b.cost)
			return -1;
		if(a.cost > b.cost)
			return 1;
		return 0;
	});
}

function getDistinctArrayValues(array) {
	return array.filter((value, index, self) => {
		return self.indexOf(value) === index;
	});
}

function getDistinctCardTypes(cardSet) {
	let types = cardSet.map(card => card.types.split(" - "));
	types = types.reduce((acc, value) => {
		return acc.concat(value);
	}, []);
	return getDistinctArrayValues(types);
}

function getCardsWithCostInSets(sets, cost) {
	return _cards.filter(card => card.cost).filter((card) => {
		return card.cost === cost && sets.includes(card.set);
	});
}

function getSelectedCards(selectedCards) {
	return _cards.filter((card) => {
		return selectedCards.includes(card.name);
	});
}

function buildHeader(cardsDiv) {
	let cost = span("Cost");
	let set = span("Set");
	let name = span("Name");
	let type = span("Type");

	cardsDiv.appendChild(cost);
	cardsDiv.appendChild(set);
	cardsDiv.appendChild(name);
	cardsDiv.appendChild(type);
}

function buildCardSetUI(cardSet, cardsDiv) {
	let header = buildHeader(cardsDiv);
	cardSet.forEach((card) => {
		if(card == null)
			return;
		let image = img();
		image.src = `gold/${card.cost}.png`;

		let name = span(card.name);
		let set = span(card.set);
		let type = span(card.types);

		cardsDiv.appendChild(image);
		cardsDiv.appendChild(set);
		cardsDiv.appendChild(name);
		cardsDiv.appendChild(type);
	});
}

function buildRandomizedCardSetUI(cardSet) {
	let cardsDiv = document.querySelector("#randomizedCards");
	buildCardSetUI(cardSet, cardsDiv);
}

function clearCardData() {
	let cardsDiv = document.querySelector("#randomizedCards");
	disposeChildren(cardsDiv);
}

function buildSelectedCardSet(cardSet) {
	clearCardData();
	displayCardPercentages(cardSet);
	buildRandomizedCardSetUI(cardSet);
}