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

function filterByCardDraw(cardSet, cardDraw) {
	return cardSet.filter((card) => {
		return card.cards >= cardDraw;
	});
}

function filterByActionCount(cardSet, actionCount) {
	return cardSet.filter((card) => {
		return card.actions >= actionCount;
	});
}

function filterByType(cardSet, filterTypes) {
	return cardSet.filter((card) => {
		let types = card.types.split(" - ");
		return !types.filter(type => filterTypes.indexOf(type) > -1).length > 0;
	});
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

function getCheckedSets() {
	let inputs = [].slice.call(document.querySelectorAll("input"));
	let selectedCheckboxes = inputs.filter((input) => {
		return input.type === "checkbox" && input.checked && input.id !== "forceSets" && input.id !== "validateTenCards";
	}).map((input) => {
		return [].find.call(input.parentNode.children, child => child.tagName.toLowerCase() === "label").textContent;
	});
	return selectedCheckboxes;
}

function getCardNumbers() {
	let inputs = [].slice.call(document.querySelectorAll("input"));
	let cardNumbers = inputs.filter((input) => {
		return !isNaN(parseInt(input.attributes["id"].value[0], 10)) && input.attributes["id"].value.indexOf("cost") > 0;
	}).map((input) => {
		let card = {
			number: parseInt(input.value, 10),
			cost: parseInt(input.attributes["id"].value[0], 10)
		};
		return card;
	});
	return cardNumbers;
}

function validateTenCardsTotal(cardSet) {
	let inputIsChecked = document.querySelector("#validateTenCards").checked;
	if(!inputIsChecked)
		return true;
	
	let total = cardSet.length;
	let isExactlyTen = total === 10;
	let text = "";
	if(!isExactlyTen)
		text = `10 cards in the supply require!\r\n You have ${total}!`;

	document.querySelector("#error").textContent = text;
	return isExactlyTen;
}

function validateNotBasicSet(cardSet) {
	let basicSetCards = [
		"Copper",
		"Silver",
		"Gold",
		"Estate",
		"Gardens",
		"Province",
		"Duchy"
	];
	return cardSet.filter(card => basicSetCards.indexOf(card.name) === -1);
}

function validateNocturne(cardSet) {
	let nocturneTypes = [
		"Heirloom",
		"Spirit",
		"Zombie"
	];
 	return filterByType(cardSet, nocturneTypes);
}

function validateAdventures(cardSet) {
	let adventuresUpgradeCards = [
		"Soldier",
		"Fugitive",
		"Disciple",
		"Teacher",
		"Treasure Hunter",
		"Warrior",
		"Hero",
		"Champion"
	];
	return cardSet.filter(card => adventuresUpgradeCards.indexOf(card.name) === -1 && card.types.indexOf("Event") === -1);
}

function validateRenaissance(cardSet) {
	let renaissanceTypes = [
		"Project"
	];
	return filterByType(cardSet, renaissanceTypes);
}

function filterNonPicks(cardSet, alreadyPicked) {
	return cardSet.filter(card => alreadyPicked.indexOf(card.name) === -1);
}

function getCardsWithCostInSets(sets, cost) {
	return cards.filter(card => card.cost).filter((card) => {
		return card.cost === cost && sets.indexOf(card.set) !== -1;
	});
}

function buildRandomSet(cardNumbers, checkedSets) {
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

function getAvailableCards(currentCards, sets, cost) {
	let alreadyPickedCards = currentCards.filter(card => card.cost === cost).map(card => card.name);
	let validatedCards = getCardsWithCostInSets(sets, cost);
	validatedCards = filterNonPicks(validatedCards, alreadyPickedCards);
	validatedCards = validateNotBasicSet(validatedCards);
	validatedCards = validateNocturne(validatedCards);
	validatedCards = validateAdventures(validatedCards);
	validatedCards = validateRenaissance(validatedCards);
	return validatedCards;
}

function enforceOneFromEachSet(checkedSets, currentSelection) {
	let randomizedCardSet = currentSelection.slice();
	let forceSets = document.querySelector("#forceSets").checked;
	if(forceSets) {
		let allSetsPicked = checkedSets.filter(input => randomizedCardSet.map(card => card.set).indexOf(input) === -1);
		let randomCard = null;
		while(allSetsPicked.length > 0) {
			// filter for set that aren't in the randomized set
			allSetsPicked = checkedSets.filter(input => randomizedCardSet.map(card => card.set).indexOf(input) === -1);
			
			// pick a card
			randomizedCardSet = shuffle(randomizedCardSet);
			randomCard = randomizedCardSet.pop();
			
			// we also have to ensure that there are more available cards based on cost and set.
			let availableCardsFromSets = getAvailableCards(randomizedCardSet, allSetsPicked, randomCard.cost);
			availableCardsFromSets = shuffle(availableCardsFromSets);

			// if there's no card, we'll put it back into the list and try again
			if(availableCardsFromSets.length > 0)
				randomizedCardSet.push(availableCardsFromSets.pop());
			else
				randomizedCardSet.push(randomCard);
		}
	}
	return randomizedCardSet;
}

function selectCards(cardNumbers, checkedSets) {
	let randomizedCardSet = buildRandomSet(cardNumbers, checkedSets);
	randomizedCardSet = enforceOneFromEachSet(checkedSets, randomizedCardSet);
	randomizedCardSet = sortByCost(randomizedCardSet);
	return randomizedCardSet;
}

function buildCardSetUI(cardSet, cardsDiv) {
	cardSet.forEach((card) => {
		if(card == null)
			return;
		let img = document.createElement("img");
		img.src = card.cost + ".png";

		let name = document.createElement("span");
		name.textContent = card.name;

		let set = document.createElement("span");
		set.textContent = card.set;

		cardsDiv.appendChild(img);
		cardsDiv.appendChild(set);
		cardsDiv.appendChild(name);
	});
}

function buildSelectedCardSet(cardSet) {
	let cardsDiv = document.querySelector("#randomizedCards");
	while(cardsDiv.firstChild)
		cardsDiv.removeChild(cardsDiv.firstChild);
	buildCardSetUI(cardSet, cardsDiv);
}

function addEventCards() {
	let randomCards = [];
	let eventCardCount = document.querySelector("#eventInput").value;
	let eventCards = cards.filter((card) => {
		return card.types.indexOf("Event") > -1 && card.set.indexOf("Adventures") > -1;
	});
	for(let i = 0; i < eventCardCount; i++)
		randomCards.push(shuffle(eventCards).pop());
	return randomCards;
}


function addEventCards(checkedSets) {
	if(checkedSets.indexOf("Adventures") > -1 || checkedSets.indexOf("Empires") > -1) {
		let randomCards = [];
		let eventCardCount = document.querySelector("#eventInput").value;
		let eventCards = cards.filter((card) => {
			return card.types.indexOf("Event") > -1 && checkedSets.indexOf(card.set) > -1;
		});
		for(let i = 0; i < eventCardCount; i++)
			randomCards.push(shuffle(eventCards).pop());
		return randomCards;
	}
	return [];
}

function addProjectCards(checkedSets) {
	if(checkedSets.indexOf("Renaissance") > -1) {
		let randomCards = [];
		let projectCardCount = document.querySelector("#projectInput").value;
		let projectCards = cards.filter((card) => {
			return card.types.indexOf("Project") > -1 && card.set.indexOf("Renaissance") > -1;
		});
		for(let i = 0; i < projectCardCount; i++)
			randomCards.push(shuffle(projectCards).pop());
		return randomCards;
	}
	return [];
}

function displaySelectedSets() {
	let checkedSets = getCheckedSets();
	let sets = cards.filter((card) => {
		return checkedSets.indexOf(card.set) > -1;
	});
	buildCardSetUI(sets, document.querySelector("#displaySets"));
	console.log(sets.length);
}

function randomize() {
	let checkedSets = getCheckedSets();
	let cardNumbers = getCardNumbers();
	let total = cardNumbers.reduce((acc, val) => {
		return acc += val.number;
	}, 0);
	document.querySelector("#total").value = total;
	let randomCards = selectCards(cardNumbers, checkedSets);
	const eventCards = addEventCards(checkedSets);
	const projectCards = addProjectCards(checkedSets);
	if(!validateTenCardsTotal(randomCards)) {
		return;
	}
	randomCards = randomCards.concat(eventCards);
	randomCards = randomCards.concat(projectCards);
	buildSelectedCardSet(randomCards);
}

// procedural generation of cardsets.
function createBias(attribute) {
	// ok, so we have an attribute
	// we need to figure out what it is.
}

function proceduralGeneration() {
	// let i = 0; do {i++;} while(i < 10);
	// find mechanic theme from current cards
	// find current card costs and distribute
	// enforce engine cards
	// at least one card with 2 cards
	// at least one card with 2 actions
	// filterByActions(cards, 2);
	// filterByCards(cards, 2);
}