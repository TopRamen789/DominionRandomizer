import _cards from './data/cards_module';
import Utilities from './utilities';
import validation from './validation';

class CardUtilities {
	constructor() { }
	
	static shuffle(array) {
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

	static pickRandomCardsFromCardSet(cardSet, numberOfCards) {
		let randomCards = [];
		while(randomCards.length < numberOfCards) {
			cardSet = this.shuffle(cardSet);
			randomCards.push(cardSet.pop());
		}
		return randomCards;
	}

	static filterByNames(cardSet, names) {
		return cardSet.filter((card) => {
			return names.includes(card.name);
		});
	}

	static filterByNotNames(cardSet, names) {
		return cardSet.filter((card) => {
			return !names.includes(card.name);
		});
	}

	static filterBySet(cardSet, set) {
		let setNames = set.map(card => card.name);
		return this.filterByNotNames(cardSet, setNames);
	}

	static filterByTavern(cardSet) {
		return cardSet.filter((card) => {
			return card.useTavern;
		});
	}

	static filterByVillagersAndCoffers(cardSet) {
		return cardSet.filter((card) => {
			return card.useVillagers || card.useCoffers;
		});
	}

	static filterByVillagers(cardSet) {
		return cardSet.filter((card) => {
			return card.useVillagers;
		});
	}

	static filterByCoffers(cardSet) {
		return cardSet.filter((card) => {
			return card.useCoffers;
		})
	}

	static filterByCardDraw(cardSet, cardDraw) {
		return cardSet.filter((card) => {
			return card.cards >= cardDraw;
		});
	}

	static filterByCardDrawCount(cardSet, cardCount) {
		return cardSet.filter((card) => {
			return card.cards == cardCount;
		});
	}

	static filterByGreaterThanActionCount(cardSet, actionCount) {
		return cardSet.filter((card) => {
			return card.actions >= actionCount;
		});
	}

	static filterByActionCount(cardSet, actionCount) {
		return cardSet.filter((card) => {
			return card.actions == actionCount;
		});
	}

	static filterByTypes(cardSet, filterTypes) {
		return cardSet.filter((card) => {
			let types = card.types.split(" - ");
			return types.filter(type => filterTypes.includes(type)).length > 0;
		});
	}

	static filterByNotType(cardSet, filterTypes) {
		return cardSet.filter((card) => {
			let types = card.types.split(" - ");
			return !types.filter(type => filterTypes.includes(type)).length > 0;
		});
	}

	static filterByCost(cardSet, cost) {
		return cardSet.filter((card) => {
			return card.cost === cost;
		});
	}

	static filterByTrashCount(cardSet, trashCount) {
		return cardSet.filter((card) => {
			return card.trash >= trashCount;
		});
	}

	static filterByBuyCount(cardSet, buyCount) {
		return cardSet.filter((card) => {
			return card.buys >= buyCount;
		});	
	}

	static filterSetByEverythingElse(currentSet) {
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

	static filterByExpansions(cardSet, sets) {
		return cardSet.filter((card) => {
			return sets.includes(card.set);
		});
	}

	static filterByOtherCardSet(cardSet, otherSet) {
		let names = otherSet.map(card => card.name);
		return cardSet.filter(card => !names.includes(card.name));
	}

	static sortByCost(cardSet) {
		return cardSet.sort((a,b) => {
			if(a.cost < b.cost)
				return -1;
			if(a.cost > b.cost)
				return 1;
			return 0;
		});
	}

	static getDistinctArrayValues(array) {
		return array.filter((value, index, self) => {
			return self.indexOf(value) === index;
		});
	}

	static getDistinctCardTypes(cardSet) {
		let types = cardSet.map(card => card.types.split(" - "));
		types = types.reduce((acc, value) => {
			return acc.concat(value);
		}, []);
		return this.getDistinctArrayValues(types);
	}

	static getCardsWithCostInSets(sets, cost) {
		return _cards.filter(card => card.cost).filter((card) => {
			return card.cost === cost && sets.includes(card.set);
		});
	}

	static getSelectedCards(selectedCards) {
		return _cards.filter((card) => {
			return selectedCards.includes(card.name);
		});
	}

	static buildHeader(cardsDiv) {
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

	// IDEA GET!
	// So first, you need to fix the dual supply piles, where they have 2 differently named cards take up the same pile.
	// You can fix this by having them display together all the time in the way the Dominion rules expect:
	// One card type is pointing horizontally underneath the other card type. 
	static buildCardSetUI(cardSet, cardsDiv) {
		cardSet.forEach((card) => {
			if(card == null || card.image == null)
				return;
			let image = Utilities.img();
			image.src = card.image;
			image.height = 200;
			image.className = "card-thumbnail";
			image.id = card.name;
			image.onclick = () => {
				// TODO: Wrap this with a div and put a sibling div in here
				// then when you hover the card, put some small text stating "Reroll?" such that it is slightly more intuitive.
				// in here, pick a new random with same cost
				let availableCards = validation.validateCardSet(_cards);
				availableCards = this.filterByOtherCardSet(availableCards, cardSet);
				availableCards = this.filterByCost(availableCards, card.cost);
				availableCards = this.shuffle(availableCards);
				let newCard = availableCards.pop();
				if(newCard == null) {
					console.log(availableCards);
					console.log(card.cost);
				}
				// if(card.bottomPile != null) {
				// 	document.getElementById(card.bottomPile).remove();
				// }
				image.src = newCard.image;
			};
			// if(card.topPile != null) {
			// 	// then this card is the bottom pile.
			// 	image.style.transform = 'rotate(-90deg)';
			// 	let topImage = Utilities.img();
			// 	let topCard = this.filterByNames(_cards, [card.topPile])[0];
			// 	topImage.className = "card-thumbnail";
			// 	topImage.src = topCard.image;
			// 	topImage.height = 200;
			// 	topImage.onclick = onclick.call(this, topImage);
			// 	cardsDiv.appendChild(topImage);
			// } else if (card.bottomPile != null) {
			// 	// then this card is the top pile.
			// 	let bottomImage = Utilities.img();
			// 	let bottomCard = this.filterByNames(_cards, [card.bottomPile])[0];
			// 	bottomImage.style.transform = 'rotate(-90deg)';
			// 	bottomImage.id = bottomCard.name;
			// 	bottomImage.className = "card-thumbnail";
			// 	bottomImage.src = bottomCard.image;
			// 	bottomImage.height = 200;
			// 	cardsDiv.appendChild(bottomImage);
			// 	image.onclick = onclick.call(this, bottomImage);
			// } else {
			// 	image.onclick = onclick.call(this, image);
			// }
			cardsDiv.appendChild(image);
		});
	}

	static buildRandomizedCardSetUI(cardSet) {
		let cardsDiv = document.querySelector("#randomizedCards");
		this.buildCardSetUI(cardSet, cardsDiv);
	}

	static clearCardData() {
		let cardsDiv = document.querySelector("#randomizedCards");
		Utilities.disposeChildren(cardsDiv);
	}

	static buildSelectedCardSet(cardSet) {
		this.clearCardData();
		this.buildRandomizedCardSetUI(cardSet);
	}

	static buildSelectedSideboard(sideboard) {
		let sideboardDiv = document.querySelector("#sideboard");
		Utilities.disposeChildren(sideboardDiv);
		sideboard.forEach((card) => {
			let sideboardCard = Utilities.img();
			sideboardCard.src = card.image;
			sideboardCard.height = 125;
			sideboardCard.className = "sideboard-thumbnail";
			sideboardCard.onclick = () => {
				// filter by expansions, then pick new card.
				let availableCards = this.filterByExpansions(_cards, card.set);
				availableCards = this.filterByTypes(availableCards, card.types);
				availableCards = this.filterByOtherCardSet(availableCards, sideboard);
				availableCards = this.shuffle(availableCards);
				let newCard = availableCards.pop();
				sideboardCard.src = newCard.image;
			};
			sideboardDiv.appendChild(sideboardCard);
		});
	}

	static fillCardProperties = (card) => {
		let filledCard = {};
		filledCard.name = card.name || "";
		filledCard.set = card.set || "";
		filledCard.types = card.types || "";
		filledCard.cost = card.cost || null;
		filledCard.text = card.text || "";
		filledCard.actions = card.actions || null;
		filledCard.cards = card.cards || null;
		filledCard.buys = card.buys || null;
		filledCard.coins = card.coins || "  ";
		filledCard.trash = card.trash || null;
		filledCard.junk = card.junk || "  ";
		filledCard.gain = card.gain || null;
		filledCard.points = card.points || null;
		filledCard.useTavern = card.useTavern || null;
		filledCard.useVillagers = card.useVillagers || null;
		filledCard.image = card.image || null;
		return filledCard;
	}

	static getDistinctCardCosts = (cardSet) => {
		return cardSet.filter(c => c.cost != null || c.debt != null).map(c => c.cost != null ? c.cost : c.debt).filter((val, index, self) => {
			return self.indexOf(val) === index;
		});
	}

	static getEventCards = () => {
		return this.filterByTypes(_cards, ["Event"]);
	}

	static getProjectCards = () => {
		return this.filterByTypes(_cards, ["Project"]);
	}

	static getLandmarkCards = () => {
		return this.filterByTypes(_cards, ["Landmark"]);
	}

	static getWayCards = () => {
		return this.filterByTypes(_cards, ["Way"]);
	}
}

export default CardUtilities;