// http://wiki.dominionstrategy.com/index.php/List_of_cards
function getCards() {
	let getCardsXhr = new XMLHttpRequest();
	getCarsdXhr.onload = (document) => {
		let rows = document.querySelector("tr");
		let cards = [];
		rows.forEach((row) => {
			let cells = row.children;
			let card = {};
			card.name = cells[0].textContent;
			card.set = cells[1].textContent;
			card.types = cells[2].textContent;
			card.cost = cells[3].textContent;
			card.text = cells[4].textContent;
			card.actions = cells[5].textContent;
			card.cards = cells[6].textContent;
			card.buys = cells[7].textContent;
			card.coins = cells[8].textContent;
			card.trash = cells[9].textContent;
			card.junk = cells[10].textContent;
			card.gain = cells[11].textContent;
			card.points = cells[12].textContent;
			cards.push(card);
		});
		download(cards, "DominionCards", ".json");
	};
	getCardsXhr.open("GET", "http://wiki.dominionstrategy.com/index.php/List_of_cards");
	getCardsXhr.responseType = "document";
	getCardsXhr.send();
}

function download(data, filename, type) {
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