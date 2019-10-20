function buildSetChecklist() {
	let setsList = [
		" Base, 1E",
		" Base, 2E",
		" Base ",
		" Intrigue, 2E",
		" Intrigue, 1E",
		" Intrigue ",
		" Seaside ",
		" Alchemy ",
		" Prosperity ",
		" Cornucopia ",
		" Hinterlands ",
		" Dark Ages ",
		" Guilds ",
		" Adventures ",
		" Empires ",
		" Nocturne ",
		" Renaissance ",
		" Promo "
	];

	let ownedList = [
		" Base, 1E",
		" Base ",
		" Intrigue, 2E",
		" Intrigue ",
		" Nocturne ",
		" Adventures ",
	];

	let setElements = document.querySelector("#sets");
	setsList.forEach((set) => {
		let setElement = document.createElement("span");
		let checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.value = "value";
		checkbox.name = "name";
		checkbox.id = set;
		checkbox.checked = ownedList.indexOf(set) > -1;
		let label = document.createElement("label");
		label.textContent = set.trim();
		label.htmlFor = set;
		setElement.appendChild(checkbox);
		setElement.appendChild(label);
		setElements.appendChild(setElement);
		setElements.appendChild(document.createElement("br"));
	});
}

buildSetChecklist();