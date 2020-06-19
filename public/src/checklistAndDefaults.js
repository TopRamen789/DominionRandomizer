let buildSetChecklist = () => {
	let setsList = [
		"Base, 1E",
		"Base, 2E",
		"Base",
		"Intrigue, 2E",
		"Intrigue, 1E",
		"Intrigue",
		"Seaside",
		"Alchemy",
		"Prosperity",
		"Cornucopia",
		"Hinterlands",
		"Dark Ages",
		"Guilds",
		"Adventures",
		"Empires",
		"Nocturne",
		"Renaissance",
		"Promo "
	];

	// these are sets that me/family currently own, if you're browsing this, feel free to rip this out.
	let ownedList = [
		"Base, 1E",
		"Base",
		"Intrigue, 2E",
		"Intrigue",
		"Seaside",
		"Alchemy",
		"Prosperity",
		"Cornucopia",
		"Hinterlands",
		"Dark Ages",
		"Guilds",
		"Adventures",
		"Empires",
		"Nocturne",
		"Renaissance"
	];

	let setElements = document.querySelector("#sets");
	setsList.forEach((set) => {
		let setElement = document.createElement("span");
		let checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.value = "value";
		checkbox.name = "name";
		checkbox.id = set;
		checkbox.checked = ownedList.indexOf(set) > -1; // don't forget this too!
		let label = document.createElement("label");
		label.textContent = set.trim();
		label.htmlFor = set;
		setElement.appendChild(checkbox);
		setElement.appendChild(label);
		setElements.appendChild(setElement);
		setElements.appendChild(document.createElement("br"));
	});
}

document.onload = buildSetChecklist();