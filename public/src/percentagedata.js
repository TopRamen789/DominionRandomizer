let getActionsPercent = (currentSet) => {
	let cardData = [];
	cardData.push({
		label: 'Actions'
	});
	for(let i = 0; i < 3; i++) {
		if(i === 0)
			continue;
		let number = filterByActionCount(currentSet, i).length;
		cardData.push({
			type: `+${i} Actions`,
			percent: (number/currentSet.length)*100,
			number: number
		});
	}
	return cardData;
}

let getCardsPercent = (currentSet) => {
	let cardData = [];
	cardData.push({
		label: 'Cards'
	});
	for(let i = 0; i < 5; i++) {
		if(i === 0)
			continue;
		let number = filterByCardDrawCount(currentSet, i).length;
		cardData.push({
			type: `+${i} Cards`,
			percent: (number/currentSet.length)*100,
			number: number
		});
	}
	return cardData;
}

let getTrashPercent = (currentSet) => {
	let cardData = [];
	cardData.push({
		label: 'Trash'
	});
	for(let i = 0; i < 5; i++) {
		if(i === 0)
			continue;
		let number = filterByTrashCount(currentSet, i).length;
		cardData.push({
			type: `+${i} Trash`,
			percent: (number/currentSet.length)*100,
			number: number
		});
	}
	return cardData;
}

let getBuyPercent = (currentSet) => {
	let cardData = [];
	cardData.push({
		label: 'Buy'
	});
	for(let i = 0; i < 5; i++) {
		if(i === 0)
			continue;
		let number = filterByBuyCount(currentSet, i).length;
		cardData.push({
			type: `+${i} Buy`,
			percent: (number/currentSet.length)*100,
			number: number
		});
	}
	return cardData;
}

let getSetPercent = (currentSet) => {
	let cardData = [];
	cardData.push({
		label: 'Set'
	});
	let expansions = getCheckedExpansions();
	expansions.forEach((set) => {
		let number = filterByExpansions(currentSet, [set]).length;
		cardData.push({
			type: set,
			percent: (number/currentSet.length)*100,
			number: number
		});
	});
	return cardData;
}

let getTypesPercent = (currentSet) => {
	let cardData = [];
	cardData.push({
		label: 'Types'
	});
	let types = getDistinctCardTypes(currentSet);
	types.forEach((type) => {
		let number = filterByTypes(currentSet, [type]).length;
		cardData.push({
			type: type,
			percent: (number/currentSet.length)*100,
			number: number
		});
	});
	return cardData;
}

let getPercentageData = (currentSet) => {
	let cardData = [];
	let measuredSet = filterOutSideboard(currentSet);
	cardData = cardData.concat(getActionsPercent(measuredSet));
	cardData = cardData.concat(getCardsPercent(measuredSet));
	cardData = cardData.concat(getBuyPercent(measuredSet));
	cardData = cardData.concat(getTrashPercent(measuredSet));
	cardData = cardData.concat(getSetPercent(measuredSet));
	cardData = cardData.concat(getTypesPercent(measuredSet));
	return cardData;
}

let displayCardPercentages = (currentSet) => {
	let cardData = getPercentageData(currentSet);
	
	// build elements
	let cardDataUI = document.querySelector("#cardData");
	disposeChildren(cardDataUI);
	cardData.map((data) => {
		if(!data.label) {
			let className = '';
			if(data.percent >= 30)
				className = 'anomalousHigh';
			if(data.percent <= 5)
				className = 'anomalousLow'

			let number = div(data.number, {className: className});
			let percent = div(`${round(data.percent, 2)}%`, {className: className});
			let type = div(data.type, {className: className});
			cardDataUI.appendChild(number);
			cardDataUI.appendChild(percent);
			cardDataUI.appendChild(type);
		} else {
			let className = 'header';
			let label = div(data.label, {className: className});
			let leftDiv = div('', {className: className});
			let rightDiv = div('', {className: className});
			cardDataUI.appendChild(leftDiv);
			cardDataUI.appendChild(label);
			cardDataUI.appendChild(rightDiv);
		}
	});
}