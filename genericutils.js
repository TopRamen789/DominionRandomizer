function hideControls() {
	let cbox = document.querySelector('#hideControlsCheckbox');
	let controls = document.querySelector('#controls');
	if(cbox.checked)
		controls.style = "display: none";
	else
		controls.style = "display: flex";
}

function round(value, decimals) {
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function disposeChildren(element) {
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