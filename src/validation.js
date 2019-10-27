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
	return cardSet.filter(card => !basicSetCards.includes(card.name));
}

function validateNocturne(cardSet) {
	let nocturneTypes = [
		"Heirloom",
		"Spirit",
		"Zombie",
		"Boon",
		"Hex"
	];
 	return filterByNotType(cardSet, nocturneTypes).filter(card => card.name !== "Bat");
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
	return cardSet.filter(card => !adventuresUpgradeCards.includes(card.name) && !card.types.includes("Event"));
}

function validateRenaissance(cardSet) {
	let renaissanceTypes = [
		"Project",
		"Artifact"
	];
	return filterByNotType(cardSet, renaissanceTypes);
}

function getSetPossibilities(currentSet) {
	return getDistinctArrayValues(currentSet.map(card => card.set));
}

function hasAdventures(currentSet) {
	return getSetPossibilities(currentSet).includes("Adventures");
}

function hasNocturne(currentSet) {
	return getSetPossibilities(currentSet).includes("Nocturne");
}

function hasRenaissance(currentSet) {
	return getSetPossibilities(currentSet).includes("Renaissance");
}

function hasAttack(currentSet) {
	return getDistinctCardTypes(currentSet).includes('Attack');
}

function hasDuration(currentSet) {
	return getDistinctCardTypes(currentSet).includes('Duration');
}

function hasTrash(currentSet) {
	return filterByTrashCount(currentSet, 1).length > 0;
}

function hasBuys(currentSet) {
	return filterByBuyCount(currentSet, 1).length > 0;	
}

function validateCardSet(givenSet) {
	let availableSet = givenSet.slice();
	availableSet = validateNotBasicSet(availableSet);
	availableSet = validateNocturne(availableSet);
	availableSet = validateAdventures(availableSet);
	availableSet = validateRenaissance(availableSet);
	return availableSet;
}