function getActionsPercent(currentSet) {
	let cardData = [];
	cardData.push({
		label: 'Actions'
	});
	for(let i = 0; i < 3; i++) {
		let number = filterByActionCount(currentSet, i).length;
		cardData.push({
			type: `+${i} Actions`,
			percent: number/currentSet.length,
			number: number
		});
	}
	return cardData;
}

function getCardsPercent(currentSet) {
	let cardData = [];
	cardData.push({
		label: 'Cards'
	});
	for(let i = 0; i < 5; i++) {
		let number = filterByCardDrawCount(currentSet, i).length;
		cardData.push({
			type: `+${i} Cards`,
			percent: number/currentSet.length,
			number: number
		});
	}
	return cardData;
}

function getTrashPercent(currentSet) {
	let cardData = [];
	cardData.push({
		label: 'Trash'
	});
	for(let i = 0; i < 5; i++) {
		let number = filterByTrashCount(currentSet, i).length;
		cardData.push({
			type: `+${i} Trash`,
			percent: number/currentSet.length,
			number: number
		});
	}
	return cardData;
}

function getBuyPercent(currentSet) {
	let cardData = [];
	cardData.push({
		label: 'Buy'
	});
	for(let i = 0; i < 5; i++) {
		let number = filterByBuyCount(currentSet, i).length;
		cardData.push({
			type: `+${i} Buy`,
			percent: number/currentSet.length,
			number: number
		});
	}
	return cardData;
}

function getSetPercent(currentSet) {
	let cardData = [];
	cardData.push({
		label: 'Set'
	});
	let sets = getCheckedSets();
	sets.forEach((set) => {
		let number = filterBySets(currentSet, [set]).length;
		cardData.push({
			type: set,
			percent: number/currentSet.length,
			number: number
		});
	});
	return cardData;
}

function getTypesPercent(currentSet) {
	let cardData = [];
	cardData.push({
		label: 'Types'
	});
	let types = getDistinctCardTypes(currentSet);
	types.forEach((type) => {
		let number = filterByTypes(currentSet, [type]).length;
		cardData.push({
			type: type,
			percent: number/currentSet.length,
			number: number
		});
	});
	return cardData;
}

function getPercentageData(currentSet) {
	let cardData = [];
	cardData = cardData.concat(getActionsPercent(currentSet));
	cardData = cardData.concat(getCardsPercent(currentSet));
	cardData = cardData.concat(getBuyPercent(currentSet));
	cardData = cardData.concat(getTrashPercent(currentSet));
	cardData = cardData.concat(getSetPercent(currentSet));
	cardData = cardData.concat(getTypesPercent(currentSet));
	return cardData;
}

function displayCardPercentages(currentSet) {
	let cardData = getPercentageData(currentSet);
	
	// build elements
	let cardDataUI = document.querySelector("#cardData");
	disposeChildren(cardDataUI);
	cardData.map((data) => {
		if(!data.label) {
			let style = data.percent >= 0.3 ? 'background-color: #a62f00' : '';

			let number = div(data.number)
			number.style = style;

			let percent = div(`${round(data.percent, 2)}%`);
			percent.style = style;
			
			let type = div(data.type);
			type.style = style;

			cardDataUI.appendChild(number);
			cardDataUI.appendChild(percent);
			cardDataUI.appendChild(type);
		} else {
			let style = "border-color: white; border-width: 0px; border-bottom-width: 1px; border-style: solid;";
			
			let label = div(data.label);
			label.style = style;
			
			let leftDiv = div();
			leftDiv.style = style;

			let rightDiv = div()
			rightDiv.style = style;
			
			cardDataUI.appendChild(leftDiv);
			cardDataUI.appendChild(label);
			cardDataUI.appendChild(rightDiv);
		}
	});
}