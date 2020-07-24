import CardUtilities from './CardUtilities';

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
		"Curse",
		// For our preferences...
		"Potion",
		"Island",
		"Distant Lands",
		"Feodum",
	];
	return CardUtilities.filterByNotNames(cardSet, basicSetCards);
}

let validateNocturne = (cardSet) => {
	let nocturneTypes = [
		"Heirloom",
		"Spirit",
		"Zombie",
		"Boon",
		"Hex"
	];
	 let nocturneCards = CardUtilities.filterByNotType(cardSet, nocturneTypes);
	 return CardUtilities.filterByNotNames(nocturneCards, ["Bat"]);
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
	let adventuresCards = CardUtilities.filterByNotNames(cardSet, adventuresUpgradeCards);
	return CardUtilities.filterByNotType(adventuresCards, ["Event"]);
}

let validateRenaissance = (cardSet) => {
	let renaissanceTypes = [
		"Project",
		"Artifact"
	];
	return CardUtilities.filterByNotType(cardSet, renaissanceTypes);
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
	};
	let splitPiles = [
		["Encampment","Plunder"],
		["Patrician", "Emporium"],
		["Settlers","Bustling Village"],
		["Catapult","Rocks"],
		["Gladiator","Fortune"]
	];
	// set bottom and top pile properties for split piles.
	let topPiles = splitPiles.map(m => m[0]);
	let bottomPiles = splitPiles.map(m => m[1]);
	CardUtilities.filterByNames(cardSet, topPiles).forEach((c) => {
		c.bottomPile = splitPiles.filter(s => s.indexOf(c.name) > -1)[0][1];
	});
	CardUtilities.filterByNames(cardSet, bottomPiles).forEach((c) => {
		c.topPile = splitPiles.filter(s => s.indexOf(c.name) > -1)[0][0];
	});
	let empiresSet = CardUtilities.filterByNotType(cardSet, empiresTypes)
	empiresSet.push(CardUtilities.fillCardProperties(castles));
	return empiresSet;
}

let validateCornucopia = (cardSet) => {
	let cornucopiaType = [
		"Prize"
	];
	return CardUtilities.filterByNotType(cardSet, cornucopiaType);
}

let validateDarkAges = (cardSet) => {
	let darkAgesTypes = [
		"Shelter",
		"Ruins",
		"Knight"
	];
	let darkAgesSet = CardUtilities.filterByNotType(cardSet, darkAgesTypes);
    let knights = {
		"name": "Knights", 
		"set": "Dark Ages", 
		"types": "Action - Attack - Knight",
		"cost": 5,
		"image": "http://wiki.dominionstrategy.com/images/thumb/9/9a/Knights.jpg/200px-Knights.jpg"
	};
	darkAgesSet.push(CardUtilities.fillCardProperties(knights));
	return CardUtilities.filterByNotNames(darkAgesSet, ["Spoils"]);
}

let validateMenagerie = (cardSet) => {
	let menagerieTypes = [
		"Way",
	];
	let menagerieCards = [
		"Horse"
	];
	let menagerieSet = CardUtilities.filterByNotNames(cardSet, menagerieCards);
	return CardUtilities.filterByNotType(menagerieSet, menagerieTypes);
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
	return CardUtilities.filterByTrashCount(currentSet, 1).length > 0;
}

let hasBuys = (currentSet) => {
	return CardUtilities.filterByBuyCount(currentSet, 1).length > 0;	
}

let validateCardSet = (givenSet) => {
	let availableSet = givenSet.slice();
	availableSet = validateNotBasicSet(availableSet);
	availableSet = validateNocturne(availableSet);
	availableSet = validateAdventures(availableSet);
	availableSet = validateRenaissance(availableSet);
	availableSet = validateEmpires(availableSet);
	availableSet = validateCornucopia(availableSet);
	availableSet = validateDarkAges(availableSet);
	availableSet = validateMenagerie(availableSet);
	return availableSet;
}

export default {validateCardSet};