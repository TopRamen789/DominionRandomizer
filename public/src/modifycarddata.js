let downloadJs = (content, filename) => {
  let json = JSON.stringify(content, null, 4);
  download(json, filename, ".js");
}

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
	downloadJs(cards, "ModifiedJson");
}

let modifyCardImages = (cards, images) => {
  cards.forEach((card) => {
    let imageObj = images.find(i => i.name === card.name);
    card.image = imageObj.image;
  });
  downloadJs(json, "ModifiedJson");
}
var imagesJson = {};

let readSingleFile = (e) => {
  let reader = getFileReader(e);
  reader.onload = function(e) {
    let contents = e.target.result;
    //console.log(contents.split("var _cards = ")[1].slice(0, -1));
    let json = JSON.parse(contents.split("var _cards = ")[1].slice(0, -1));
    // modifyCardsJson(json);
    modifyCardImages(json, imagesJson);
    displayContents(contents);
  };
  reader.readAsText(file);
}

let displayContents = (contents) => {
  let element = document.querySelector('#file-content');
  element.textContent = contents;
}

let readImages = (e) => {
  let file = e.target.files[0];
  if(!file)
    return;
  let reader = new FileReader();
  reader.onload = function(e) {
    let contents = e.target.result;
    let json = JSON.parse(contents);
    imagesJson = json;
  }
  reader.readAsText(file);
}

let modifyPredefinedSets = (set, file) => {
  // Overly complicated js array methods to get the job done.
  let filename = file.name.substring(file.name.indexOf('index.php_')+10, file.name.indexOf('#'));
  let refinedData = set.map(s => s.trim().split('\n')).map(s => s.filter(s => s != " " && s != "")).map(s => s.map(e => e.trim()));
  downloadJs(refinedData, `${filename}_sets`);
}

let readPredefinedSets = (e) => {
  let file = e.target.files[0];
  if(!file)
    return;
  let reader = new FileReader();
  reader.onload = function(e) {
    let contents = e.target.result;
    let json = JSON.parse(contents);
    modifyPredefinedSets(json, file);
  }
  reader.readAsText(file);
}

document.querySelector('#predefined-input')
  .addEventListener('change', readPredefinedSets, false);

document.querySelector('#image-input')
  .addEventListener('change', readImages, false);

document.querySelector('#file-input')
  .addEventListener('change', readSingleFile, false);