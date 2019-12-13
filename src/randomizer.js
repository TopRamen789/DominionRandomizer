let getCheckedSets = () => {
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

let getAvailableCards = (currentCards, sets, cost) => {
	let alreadyPickedCards = currentCards.filter(card => card.cost === cost);
	let validatedCards = getCardsWithCostInSets(sets, cost);
	validatedCards = filterByOtherCardSet(validatedCards, alreadyPickedCards);
	validatedCards = validateNotBasicSet(validatedCards);
	validatedCards = validateNocturne(validatedCards);
	validatedCards = validateAdventures(validatedCards);
	validatedCards = validateRenaissance(validatedCards);
	return validatedCards;
}

let enforceOneFromEachSet = (checkedSets, currentSelection) => {
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

let selectCards = (cardNumbers, checkedSets) => {
	let randomizedCardSet = buildRandomSetFromInputs(cardNumbers, checkedSets);
	randomizedCardSet = enforceOneFromEachSet(checkedSets, randomizedCardSet);
	randomizedCardSet = sortByCost(randomizedCardSet);
	return randomizedCardSet;
}

let addEventCards = (checkedSets) => {
	if(checkedSets.includes("Adventures") || checkedSets.includes("Empires")) {
		let randomCards = [];
		let eventCardCount = document.querySelector("#eventInput").value;
		let eventCards = _cards.filter((card) => {
			return card.types.includes("Event") && checkedSets.includes(card.set);
		});
		for(let i = 0; i < eventCardCount; i++)
			randomCards.push(shuffle(eventCards).pop());
		return randomCards;
	}
	return [];
}

let addProjectCards = (checkedSets) => {
	if(checkedSets.includes("Renaissance")) {
		let randomCards = [];
		let projectCardCount = document.querySelector("#projectInput").value;
		let projectCards = _cards.filter((card) => {
			return card.types.includes("Project") && card.set.includes("Renaissance");
		});
		for(let i = 0; i < projectCardCount; i++)
			randomCards.push(shuffle(projectCards).pop());
		return randomCards;
	}
	return [];
}

let displaySelectedSets = () => {
	let checkedSets = getCheckedSets();
	let sets = filterBySets(cards, checkedSets);
	buildCardSetUI(sets, document.querySelector("#displaySets"));
}

let randomize = () => {
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
	clearBiasData();
	buildSelectedCardSet(randomCards);
}