function buildSetChecklist() {
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
		"Promo"
	];

	let ownedList = [
		"Base, 1E",
		"Base",
		"Intrigue, 2E",
		"Intrigue",
		"Nocturne",
		"Adventures",
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
		displayEventInput(set, checkbox);
		displayProjectInput(set, checkbox);
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

function displayEventInput(set, checkbox) {
	if(set.indexOf("Adventures") > -1 || set.indexOf("Empires") > -1)
		checkbox.onchange = (event) => {
			let events = document.querySelector('#displayEvents');
			if(event.target.checked)
				events.style = 'display: block;';
			else
				events.style = 'display: hidden;';
		};
}

function displayProjectInput(set, checkbox) {
	if(set.indexOf("Renaissance") > -1)
		checkbox.onchange = (event) => {
			let projects = document.querySelector('#displayProjects');
			if(event.target.checked)
				projects.style = 'display: block;';
			else
				projects.style = 'display: hidden;';
		};
}

buildSetChecklist();