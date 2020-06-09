let validateTenCardsTotal = (cardSet) => {
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

let validateNotBasicSet = (cardSet) => {
	let basicSetCards = [
		"Copper",
		"Silver",
		"Gold",
		"Platinum",
		"Estate",
		"Gardens",
		"Duchy",
		"Province",
		"Colony",
		"Curse"
	];
	return filterByNotNames(cardSet, basicSetCards);
}

let validateNocturne = (cardSet) => {
	let nocturneTypes = [
		"Heirloom",
		"Spirit",
		"Zombie",
		"Boon",
		"Hex"
	];
	 let nocturneCards = filterByNotType(cardSet, nocturneTypes);
	 return filterByNotNames(nocturneCards, ["Bat"]);
}

let validateAdventures = (cardSet) => {
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
	let adventuresCards = filterByNotNames(cardSet, adventuresUpgradeCards);
	return filterByNotType(adventuresCards, ["Event"]);
}

let validateRenaissance = (cardSet) => {
	let renaissanceTypes = [
		"Project",
		"Artifact"
	];
	return filterByNotType(cardSet, renaissanceTypes);
}

let validateEmpires = (cardSet) => {
	let empiresTypes = [
		"Event"
	];
	return filterByNotType(cardSet, empiresTypes);
}

let validateCornucopia = (cardSet) => {
	let cornucopiaType = [
		"Prize"
	];
	return filterByNotType(cardSet, cornucopiaType);
}

let validateDarkAges = (cardSet) => {
	let darkAgesTypes = [
		"Shelter",
		"Ruins"
	];
	let darkAgesSet = filterByNotType(cardSet, darkAgesTypes);
	return filterByNotNames(darkAgesSet, ["Spoils"]);
}

let getSetPossibilities = (currentSet) => {
	return getDistinctArrayValues(currentSet.map(card => card.set));
}

let hasAdventures = (currentSet) => {
	return getSetPossibilities(currentSet).includes("Adventures");
}

let hasNocturne = (currentSet) => {
	return getSetPossibilities(currentSet).includes("Nocturne");
}

let hasRenaissance = (currentSet) => {
	return getSetPossibilities(currentSet).includes("Renaissance");
}

let hasAttack = (currentSet) => {
	return getDistinctCardTypes(currentSet).includes('Attack');
}

let hasDuration = (currentSet) => {
	return getDistinctCardTypes(currentSet).includes('Duration');
}

let hasTrash = (currentSet) => {
	return filterByTrashCount(currentSet, 1).length > 0;
}

let hasBuys = (currentSet) => {
	return filterByBuyCount(currentSet, 1).length > 0;	
}

function validateCardSet(givenSet) {
	let availableSet = givenSet.slice();
	availableSet = validateNotBasicSet(availableSet);
	availableSet = validateNocturne(availableSet);
	availableSet = validateAdventures(availableSet);
	availableSet = validateRenaissance(availableSet);
	availableSet = validateEmpires(availableSet);
	availableSet = validateCornucopia(availableSet);
	availableSet = validateDarkAges(availableSet);
	return availableSet;
}