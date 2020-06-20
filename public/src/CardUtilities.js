import _cards from './cards';

class CardUtils {
	constructor() { }
	
	shuffle(array) {
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

	pickRandomCardsFromCardSet(cardSet, numberOfCards) {
		let randomCards = [];
		while(randomCards.length < numberOfCards) {
			cardSet = this.shuffle(cardSet);
			randomCards.push(cardSet.pop());
		}
		return randomCards;
	}

	filterByNames(cardSet, names) {
		return cardSet.filter((card) => {
			return names.includes(card.name);
		});
	}

	filterByNotNames(cardSet, names) {
		return cardSet.filter((card) => {
			return !names.includes(card.name);
		});
	}

	filterBySet(cardSet, set) {
		let setNames = set.map(card => card.name);
		return this.filterByNotNames(cardSet, setNames);
	}

	filterByTavern(cardSet) {
		return cardSet.filter((card) => {
			return card.useTavern;
		});
	}

	filterByVillagersAndCoffers(cardSet) {
		return cardSet.filter((card) => {
			return card.useVillagers || card.useCoffers;
		});
	}

	filterByVillagers(cardSet) {
		return cardSet.filter((card) => {
			return card.useVillagers;
		});
	}

	filterByCoffers(cardSet) {
		return cardSet.filter((card) => {
			return card.useCoffers;
		})
	}

	filterByCardDraw(cardSet, cardDraw) {
		return cardSet.filter((card) => {
			return card.cards >= cardDraw;
		});
	}

	filterByCardDrawCount(cardSet, cardCount) {
		return cardSet.filter((card) => {
			return card.cards == cardCount;
		});
	}

	filterByGreaterThanActionCount(cardSet, actionCount) {
		return cardSet.filter((card) => {
			return card.actions >= actionCount;
		});
	}

	filterByActionCount(cardSet, actionCount) {
		return cardSet.filter((card) => {
			return card.actions == actionCount;
		});
	}

	filterByTypes(cardSet, filterTypes) {
		return cardSet.filter((card) => {
			let types = card.types.split(" - ");
			return types.filter(type => filterTypes.includes(type)).length > 0;
		});
	}

	filterByNotType(cardSet, filterTypes) {
		return cardSet.filter((card) => {
			let types = card.types.split(" - ");
			return !types.filter(type => filterTypes.includes(type)).length > 0;
		});
	}

	filterByCost(cardSet, cost) {
		return cardSet.filter((card) => {
			return card.cost === cost;
		});
	}

	filterByTrashCount(cardSet, trashCount) {
		return cardSet.filter((card) => {
			return card.trash >= trashCount;
		});
	}

	filterByBuyCount(cardSet, buyCount) {
		return cardSet.filter((card) => {
			return card.buys >= buyCount;
		});	
	}

	filterSetByEverythingElse(currentSet) {
		let biasedSet = currentSet.slice();
		let attackTypes = this.filterByTypes(currentSet, ['Attack']);
		biasedSet = biasedSet.filter(card => {
			return !attackTypes.includes(card);
		});
		let trashCount = this.filterByTrashCount(currentSet, 1);
		biasedSet = biasedSet.filter(card => {
			return !trashCount.includes(card);
		});
		let durationTypes = this.filterByTypes(currentSet, ['Duration']);
		biasedSet = biasedSet.filter(card => {
			return !durationTypes.includes(card);
		});
		let buyCount = this.filterByBuyCount(currentSet, 1);
		biasedSet = biasedSet.filter(card => {
			return !buyCount.includes(card);
		});
		let nightTypes = this.filterByTypes(currentSet, ['Night']);
		biasedSet = biasedSet.filter(card => {
			return !nightTypes.includes(card);
		});
		let tavern = this.filterByTavern(currentSet);
		biasedSet = biasedSet.filter(card => {
			return !tavern.includes(card);
		});
		let villagers = this.filterByVillagers(currentSet);
		biasedSet = biasedSet.filter(card => {
			return !villagers.includes(card);
		});
		let coffers = this.filterByCoffers(currentSet);
		biasedSet = biasedSet.filter(card => {
			return !coffers.includes(card);
		});
		return biasedSet;
	}

	filterByExpansions(cardSet, sets) {
		return cardSet.filter((card) => {
			return sets.includes(card.set);
		});
	}

	filterByOtherCardSet(cardSet, otherSet) {
		let names = otherSet.map(card => card.name);
		return cardSet.filter(card => !names.includes(card.name));
	}

	sortByCost(cardSet) {
		return cardSet.sort((a,b) => {
			if(a.cost < b.cost)
				return -1;
			if(a.cost > b.cost)
				return 1;
			return 0;
		});
	}

	getDistinctArrayValues(array) {
		return array.filter((value, index, self) => {
			return self.indexOf(value) === index;
		});
	}

	getDistinctCardTypes(cardSet) {
		let types = cardSet.map(card => card.types.split(" - "));
		types = types.reduce((acc, value) => {
			return acc.concat(value);
		}, []);
		return this.getDistinctArrayValues(types);
	}

	getCardsWithCostInSets(sets, cost) {
		return _cards.filter(card => card.cost).filter((card) => {
			return card.cost === cost && sets.includes(card.set);
		});
	}

	getSelectedCards(selectedCards) {
		return _cards.filter((card) => {
			return selectedCards.includes(card.name);
		});
	}

	buildHeader(cardsDiv) {
		let cost = this.span("Cost");
		let set = this.span("Set");
		let name = this.span("Name");
		let type = this.span("Type");

		cardsDiv.appendChild(cost);
		cardsDiv.appendChild(set);
		cardsDiv.appendChild(name);
		cardsDiv.appendChild(type);
	}

	wikiPath = "http://wiki.dominionstrategy.com/";

	buildCardSetUI(cardSet, cardsDiv) {
		cardSet.forEach((card) => {
			if(card == null || card.image == null)
				return;
			let image = this.img();
			image.src = card.image;
			cardsDiv.appendChild(image);
		});
	}

	buildRandomizedCardSetUI(cardSet) {
		let cardsDiv = document.querySelector("#randomizedCards");
		this.buildCardSetUI(cardSet, cardsDiv);
	}

	clearCardData() {
		let cardsDiv = document.querySelector("#randomizedCards");
		this.disposeChildren(cardsDiv);
	}

	buildSelectedCardSet(cardSet) {
		this.clearCardData();
		this.displayCardPercentages(cardSet);
		this.buildRandomizedCardSetUI(cardSet);
	}

	buildSelectedSideboard(sideboard) {
		let sideboardDiv = document.querySelector("#sideboard");
		this.disposeChildren(sideboardDiv);
		sideboard.forEach((card) => {
			let sideboardCard = this.img();
			sideboardCard.src = card.image;
			sideboardDiv.appendChild(sideboardCard);
		});
	}
}

export default CardUtils;