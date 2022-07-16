/***** Utility Functions *****/

const camelize = str => str ? str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, c) => c.toUpperCase()) : false;
const sanitize = str => str ? str.replace(/[~!@#$%^&*().,<>?_=+:;\'\"\/\-\[\]\{\}\\\|\`]/g, '') : false;
const genuuid = _ => crypto.randomUUID();
const parseDate = i => new Date(i).toISOString().split("T")[0];
const daysBetween = (i, j) => (j - i) / (86400000);

const debugMsg = (fun, params) => {
	console.log("****** DEBUG ******");
	console.log(`Calling function ${fun} with:`);
	for(i in params) {
		console.log("\t", params[i]);
	}
	console.log("*******************");
}

const renderList = _ => { // render list display
	const { mode, root, list, options } = _State;
	const dispArr = sortList(list.items, options.sortOrder);

	root.innerHTML = '';
	dispArr.forEach((item) => {
		item.btnFuns[0] = mode === modeList ? checkItem : toggleListing;
		styleHeader(item, mode);
		root.appendChild(_DOM.get(item).root);
	});
}
