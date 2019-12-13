let downloadJson = (data, filename, type) => {
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

let modifyCardsJson = (cards) => {
	// cards.forEach((card) => {
	// 	delete card.costSrc;
	// });
	let json = JSON.stringify(cards, null, 4);
	downloadJson(json, "ModifiedJson", ".js")
}

let readSingleFile = (e) => {
  let file = e.target.files[0];
  if (!file)
    return;
  let reader = new FileReader();
  reader.onload = function(e) {
    let contents = e.target.result;
    console.log(contents.split("var cards = ")[1].slice(0, -1));
    let json = JSON.parse(contents.split("var cards = ")[1].slice(0, -1));
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