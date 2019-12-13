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
		"Estate",
		"Gardens",
		"Province",
		"Duchy"
	];
	return cardSet.filter(card => !basicSetCards.includes(card.name));
}

let validateNocturne = (cardSet) => {
	let nocturneTypes = [
		"Heirloom",
		"Spirit",
		"Zombie",
		"Boon",
		"Hex"
	];
 	return filterByNotType(cardSet, nocturneTypes);
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
	return cardSet.filter(card => !adventuresUpgradeCards.includes(card.name) && !card.types.includes("Event"));
}

let validateRenaissance = (cardSet) => {
	let renaissanceTypes = [
		"Project"
	];
	return filterByNotType(cardSet, renaissanceTypes);
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