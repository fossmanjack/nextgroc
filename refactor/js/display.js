const renderList = _ => { // render list display
	const mode, root, list, options = { _State };
	const dispArr = sortList(list.items, options.sortOrder);

	root.innerHTML = '';
	dispArr.forEach((item) => {
		item.btnFuns[0] = mode === modeList ? checkItem : toggleListing;
		styleHeader(item, mode);
		root.appendChild(_DOM.get(item).root);
	}
}

// sort and return the passed list according to the options
// _State.options.sortOrder should be [ itemField, ascending ? true : false ]
const sortList = (items, opts) => {
	const [ field, asc ] = opts;
	sr = mode === modeList ? items.filter((item) => item.state !== 2) : items;

	return sr.sort((a, b) => {
		let x = a[field].toString().toLowerCase();
		let y = b[field].toString().toLowerCase();

		if(asc) return x > y ? 1 : x < y ? -1 : 0;
		else return x > y ? -1 : x < y ? 1 : 0;
	});
}
