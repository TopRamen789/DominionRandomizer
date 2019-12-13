let modifyCardsJson = (cards) => {
	let actionRegex = /([^,]+\+[0-9]+\s(Action)+.*)+/g;
  let cardRegex = /([^,]+\+[0-9]+\s(Card)+.*)+/g;
  cards.forEach((card) => {
    let actions = actionRegex.exec(card.text);
    let cardDraw = cardRegex.exec(card.text);
    if(actions)
      card.actions = actions[0].match(/(\d+)/)[0];
    if(cardDraw)
      card.cardDraw = cardDraw[0].match(/(\d+)/)[0];
	});
	// let json = JSON.stringify(cards, null, 4);
	// download(json, "ModifiedJson", ".js")
}

let readSingleFile = (e) => {
  let file = e.target.files[0];
  if (!file)
    return;
  let reader = new FileReader();
  reader.onload = function(e) {
    let contents = e.target.result;
    //console.log(contents.split("var _cards = ")[1].slice(0, -1));
    let json = JSON.parse(contents.split("var _cards = ")[1].slice(0, -1));
    modifyCardsJson(json);
    displayContents(contents);
  };
  reader.readAsText(file);
}

let displayContents = (contents) => {
  let element = document.querySelector('#file-content');
  element.textContent = contents;
}

document.querySelector('#file-input')
  .addEventListener('change', readSingleFile, false);