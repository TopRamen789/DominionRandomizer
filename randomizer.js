function getCheckedSets() {
	let inputs = [].slice.call(document.querySelectorAll("input"));
	let selectedCheckboxes = inputs.filter((input) => {
		return input.type === "checkbox" && input.checked 
			&& input.id !== "forceSets" 
			&& input.id !== "validateTenCards"
			&& input.id !== "hideControlsCheckbox";
	}).map((input) => {
		return [].find.call(input.parentNode.children, child => child.tagName.toLowerCase() === "label").textContent;
	});
	return selectedCheckboxes;
}

function getCardNumberInputs() {
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

function buildRandomSetFromInputs(cardNumbers, checkedSets) {
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
	let alreadyPickedCards = currentCards.filter(card => card.cost === cost);
	let validatedCards = getCardsWithCostInSets(sets, cost);
	validatedCards = filterByOtherCardSet(validatedCards, alreadyPickedCards);
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
		let allSetsPicked = checkedSets.filter(input => randomizedCardSet.map(card => card.set).includes(input));
		let randomCard = null;
		while(allSetsPicked.length > 0) {
			// filter for set that aren't in the randomized set
			allSetsPicked = checkedSets.filter(input => randomizedCardSet.map(card => card.set).includes(input));
			
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
	let randomizedCardSet = buildRandomSetFromInputs(cardNumbers, checkedSets);
	randomizedCardSet = enforceOneFromEachSet(checkedSets, randomizedCardSet);
	randomizedCardSet = sortByCost(randomizedCardSet);
	return randomizedCardSet;
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
		image.src = card.cost + ".png";

		let name = span(card.name);
		let set = span(card.set);
		let type = span(card.types);

		cardsDiv.appendChild(image);
		cardsDiv.appendChild(set);
		cardsDiv.appendChild(name);
		cardsDiv.appendChild(type);
	});
}

function buildSelectedCardSet(cardSet) {
	let cardsDiv = document.querySelector("#randomizedCards");
	disposeChildren(cardsDiv);
	buildCardSetUI(cardSet, cardsDiv);
}

function addEventCards() {
	let randomCards = [];
	let eventCardCount = document.querySelector("#eventInput").value;
	let eventCards = cards.filter((card) => {
		return card.types.includes("Event") && card.set.includes("Adventures");
	});
	for(let i = 0; i < eventCardCount; i++)
		randomCards.push(shuffle(eventCards).pop());
	return randomCards;
}


function addEventCards(checkedSets) {
	if(checkedSets.includes("Adventures") || checkedSets.includes("Empires")) {
		let randomCards = [];
		let eventCardCount = document.querySelector("#eventInput").value;
		let eventCards = cards.filter((card) => {
			return card.types.includes("Event") && checkedSets.includes(card.set);
		});
		for(let i = 0; i < eventCardCount; i++)
			randomCards.push(shuffle(eventCards).pop());
		return randomCards;
	}
	return [];
}

function addProjectCards(checkedSets) {
	if(checkedSets.includes("Renaissance")) {
		let randomCards = [];
		let projectCardCount = document.querySelector("#projectInput").value;
		let projectCards = cards.filter((card) => {
			return card.types.includes("Project") && card.set.includes("Renaissance");
		});
		for(let i = 0; i < projectCardCount; i++)
			randomCards.push(shuffle(projectCards).pop());
		return randomCards;
	}
	return [];
}

function displaySelectedSets() {
	let checkedSets = getCheckedSets();
	let sets = filterBySets(cards, checkedSets);
	buildCardSetUI(sets, document.querySelector("#displaySets"));
}

function randomize() {
	let checkedSets = getCheckedSets();
	let cardNumbers = getCardNumberInputs();
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