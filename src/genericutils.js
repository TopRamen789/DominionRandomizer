let download = (data, filename, type) => {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

let saveCardSet = () => {
	let savedSet = Array.prototype.slice.call(document.querySelector('#randomizedCards').childNodes);
	let counter = 0;
	savedSet = savedSet.reduce((acc, val, idx) => {
		if(counter !== 3) {
			if(counter === 2 && idx !== 2)
				acc.push(val);
			counter++;
		} else
			counter = 0;
		return acc;
	}, []);
	download(savedSet.map(card => card.textContent), 'newset', '.json');
}

let loadCardSet = (data) => {
	let file = document.querySelector("#loadFile").files[0];
	let reader = new FileReader();
	reader.readAsText(file, "UTF-8");
	reader.onload = (evt) => {
		let cardFile = evt.target.result.split(',');
		let loadedSet = getSelectedCards(cardFile);
		buildSelectedCardSet(loadedSet);
	};
}

let hideControls = () => {
	let cbox = document.querySelector('#hideControlsCheckbox');
	let controls = document.querySelector('#controls');
	if(cbox.checked)
		controls.style = "display: none";
	else
		controls.style = "display: flex";
}

let round = (value, decimals) => {
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

let disposeChildren = (element) => {
	while(element.firstChild)
		element.removeChild(element.firstChild);
}

function buildElement(text) {
	let element = document.createElement(this.name);
	element.textContent = text;
	return element;
}

let span = () => {};
let div = () => {};
let img = () => {};

span = buildElement.bind(span);
div = buildElement.bind(div);
img = buildElement.bind(img);