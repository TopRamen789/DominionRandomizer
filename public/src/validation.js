// let validateTenCardsTotal = (cardSet) => {
// 	let inputIsChecked = document.querySelector("#validateTenCards").checked;
// 	if(!inputIsChecked)
// 		return true;
// 	let total = cardSet.length;
// 	let isGreaterThanOrEqualToTen = total >= 10;
// 	let text = "";
// 	if(!isGreaterThanOrEqualToTen)
// 		text = `10 cards in the supply require!\r\n You have ${total}!`;
// 	document.querySelector("#error").textContent = text;
// 	return isGreaterThanOrEqualToTen;
// }

let validateTenCardsTotal = (cardSet) => {
	return cardSet.length === 10;
}

let validateNotBasicSet = (cardSet) => {
	let basicSetCards = [
		"Copper",
		"Silver",
		"Gold",
		"Platinum",
		"Estate",
		"Gardens", // this is doing some weird stuff for the regular randomizer..
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
		"Event",
		"Castle" // I should put this somewhere more public, but for the moment, this has always had an interesting effect on our games, we generally include them by default no matter the set.
	];
	let castles = {
		"name": "Castles",
		"set": "Empires",
		"types": "Victory - Castle",
		"cost": 3,
		"image": "http://wiki.dominionstrategy.com/images/thumb/d/df/Castles.jpg/200px-Castles.jpg",
	}
	let empiresSet = filterByNotType(cardSet, empiresTypes)
	empiresSet.push(fillCardProperties(castles));
	return empiresSet;
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
		"Ruins",
		"Knight"
	];
	let darkAgesSet = filterByNotType(cardSet, darkAgesTypes);
    let knights = {
		"name": "Knights", 
		"set": "Dark Ages", 
		"types": "Action - Attack - Knight",
		"cost": 5,
		"image": "http://wiki.dominionstrategy.com/images/thumb/9/9a/Knights.jpg/200px-Knights.jpg"
	};
	darkAgesSet.push(fillCardProperties(knights));
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