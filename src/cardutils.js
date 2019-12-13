let shuffle = (array) => {
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

let filterByTavern = (cardSet) => {
	return cardSet.filter((card) => {
		return card.useTavern;
	});
}

let filterByVillagers = (cardSet) => {
	return cardSet.filter((card) => {
		return card.useVillagers;
	});
}

let filterByCoffers = (cardSet) => {
	return cardSet.filter((card) => {
		return card.useCoffers;
	})
}

let filterByCardDraw = (cardSet, cardDraw) => {
	return cardSet.filter((card) => {
		return card.cards >= cardDraw;
	});
}

let filterByCardDrawCount = (cardSet, cardCount) => {
	return cardSet.filter((card) => {
		return card.cards == cardCount;
	});
}

let filterByGreaterThanActionCount = (cardSet, actionCount) => {
	return cardSet.filter((card) => {
		return card.actions >= actionCount;
	});
}

let filterByActionCount = (cardSet, actionCount) => {
	return cardSet.filter((card) => {
		return card.actions == actionCount;
	});
}

let filterByTypes = (cardSet, filterTypes) => {
	return cardSet.filter((card) => {
		let types = card.types.split(" - ");
		return types.filter(type => filterTypes.includes(type)).length > 0;
	});
}

let filterByNotType = (cardSet, filterTypes) => {
	return cardSet.filter((card) => {
		let types = card.types.split(" - ");
		return !types.filter(type => filterTypes.includes(type)).length > 0;
	});
}

let filterByCost = (cardSet, cost) => {
	return cardSet.filter((card) => {
		return card.cost === cost;
	});
}

let filterByTrashCount = (cardSet, trashCount) => {
	return cardSet.filter((card) => {
		return card.trash >= trashCount;
	});
}

let filterByBuyCount = (cardSet, buyCount) => {
	return cardSet.filter((card) => {
		return card.buys >= buyCount;
	});	
}

let filterBySets = (cardSet, sets) => {
	return cardSet.filter((card) => {
		return sets.includes(card.set);
	});
}

let filterByOtherCardSet = (cardSet, otherSet) => {
	let names = otherSet.map(card => card.name);
	return cardSet.filter(card => !names.includes(card.name));
}

let sortByCost = (cardSet) => {
	return cardSet.sort((a,b) => {
		if(a.cost < b.cost)
			return -1;
		if(a.cost > b.cost)
			return 1;
		return 0;
	});
}

let getDistinctArrayValues = (array) => {
	return array.filter((value, index, self) => {
		return self.indexOf(value) === index;
	});
}

let getDistinctCardTypes = (cardSet) => {
	let types = cardSet.map(card => card.types.split(" - "));
	types = types.reduce((acc, value) => {
		return acc.concat(value);
	}, []);
	return getDistinctArrayValues(types);
}

let getCardsWithCostInSets = (sets, cost) => {
	return _cards.filter(card => card.cost).filter((card) => {
		return card.cost === cost && sets.includes(card.set);
	});
}

let getSelectedCards = (selectedCards) => {
	return _cards.filter((card) => {
		return selectedCards.includes(card.name);
	});
}

let buildHeader = (cardsDiv) => {
	let cost = span("Cost");
	let set = span("Set");
	let name = span("Name");
	let type = span("Type");

	cardsDiv.appendChild(cost);
	cardsDiv.appendChild(set);
	cardsDiv.appendChild(name);
	cardsDiv.appendChild(type);
}

let buildCardSetUI = (cardSet, cardsDiv) => {
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

let buildRandomizedCardSetUI = (cardSet) => {
	let cardsDiv = document.querySelector("#randomizedCards");
	buildCardSetUI(cardSet, cardsDiv);
}

let clearCardData = () => {
	let cardsDiv = document.querySelector("#randomizedCards");
	disposeChildren(cardsDiv);
}

let buildSelectedCardSet = (cardSet) => {
	clearCardData();
	displayCardPercentages(cardSet);
	buildRandomizedCardSetUI(cardSet);
}