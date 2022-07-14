const camelize = str => str ? str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, c) => c.toUpperCase()) : false;
const sanitize = str => str ? str.replace(/[~!@#$%^&*().,<>?_=+:;\'\"\/\-\[\]\{\}\\\|\`]/g, '') : false;

const debugMsg = (fun, params) => {
	console.log("****** DEBUG ******");
	console.log(`Calling function ${fun} with:`);
	for(i in params) {
		console.log("\t", params[i]);
	}
	console.log("*******************");
}

const renderList = _ => { // render list display
	const mode, root, list, options = { _State };
	const dispArr = sortList(list.items, _State.sortOrder, mode);

	root.innerHTML = '';
	dispArr.forEach((item) => {
		item.btnFuns[0] = mode === viewList ? checkItem : toggleListing;
		item.styleHeader(item, mode);
		root.appendChild(item.DOMElement);
	}
}

const updateState = (prop, val) => { // immutably update and save state object
	const newState = { ..._State, prop: val };
	window.localStorage.setItem("_State", JSON.stringify(newState));
	return newState;
	// could save current state to _History or something
}

const updateLists = (prop, val) => { // probably not actually needed
	const newLists = { ..._Lists, prop: val };
	window.localStorage.setItem("_Lists", JSON.stringify(newLists));
	return newLists;
}

const initState = _ => { // create and return a state object
	const st = {
		mode: list,
		list: null,
		root: document.getElementById('list-root'),
		title: document.getElementById('list-title'),
		inputField: document.getElementById('inputField'),
		btnX: document.getElementById('btnX'),
		btnY: document.getElementById('btnY'),
		funs: {
			inputFieldBlur: addItemByStr,
			inputFieldCheck: validateItemInput,
			btnX: sweepList,
			btnY: toggleView
		},
		options: {
			sortOrder: [ 'alphabetical', 'ascending' ] // make this more bitwise
		}
	};
	window.localStorage.setItem("_State", JSON.stringify(st));
	return st;
}

const initLists = _ => { // initialize _Lists object, used for storage
	const newList = createList();
	const lss = {};

	lss[newList.listID] = newList;
	updateState("list", lss[newList.listID]);
	window.localStorage.setItem("_Lists", JSON.stringify(lss));
	return lss;
}

const saveLists = _ => { // we'll be doing this a lot
	window.localStorage.setItem("_Lists", JSON.stringify(_Lists));
}

const createList = _ => { // create a new list
	return {
		listID: genuuid(),
		listName: "New List",
		creationDate: Date.now(),
		modifyDate: Date.now(),
		items: []
	}
}

const addList = ls => { // add list to _Lists object (for storage)
	_Lists[ls.listID] = ls;
	saveLists();
}

const addItemByStr = (val, st) => { // add item from input field
	const { list, root, inputField } = st;

	if(!val) return false; // if there's no text in the field don't add an item

	let [ name, qty ] = val.split(',', 2);
	//debug ? debugMsg('addItemByStr', [ name, qty ]) : null;

	if(!qty) qty = 1;

	const send = new ListItem({ title: name, qty: qty, listParent: list });
	const item = list.findItem(send, list);

	item ? item.setState(item, 0) : list.addItem(send, list);
	m.get('mode') === 'library' ? list.getLibraryView(list, root) : list.getListView(list, root);
	inputField.value = '';
	saveLists();
	return true;
}

const addStaples = st => {
	const { mode, list, root } = st;
	list.items.filter((item) => item.staple).forEach((item) => {
		item.setState(item, 0);
		if(item.interval)
			debugMsg('addStaples-pre', [ item.purBy, item.history[0], item.interval ]);
			item.purBy = (item.history[0] ? item.history[0] : Date.now()) + (item.interval * 86400000);
			item._RevEls.get('purBy').value = (item.purBy ? item.parseDate(item.purBy) : '-');
			debugMsg('addStaples', [ item.purBy ]);
		item.styleHeader(item, st.mode);
	});
	mode === list ? list.getListView(list, root) : list.getPantryView(list, root);
}

const sweepList = m => {
	m.get('list').items.filter((item) => item.state === 1)
		.forEach((item) => {
			item.setState(item, 2);
			item.styleHeader(item, m.get('mode'));
			item.updateHistory(item);
		});
	m.get('mode') === 'list' ?
		m.get('list').getListView(m.get('list'), m.get('root')) :
		m.get('list').getLibraryView(m.get('list'), m.get('root'));
}

const toggleView = m => {
	const { mode, title, btnX, btnY, list, root } = Object.fromEntries(m);

	if(mode === 'list') { // switch to library view
		btnX.classList.remove('fa-broom');
		btnX.classList.add('fa-plus');
		m.get('funs')['btnX'] = addStaples;
		btnY.classList.remove('fa-bookmark');
		btnY.classList.add('fa-list');
		title.textContent = `${list.listName}: Pantry`;
		m.set('mode', 'library');
		list.getLibraryView(list, root);
	} else {
		btnX.classList.remove('fa-plus');
		btnX.classList.add('fa-broom');
		m.get('funs')['btnX'] = sweepList;
		btnY.classList.remove('fa-list');
		btnY.classList.add('fa-bookmark');
		title.textContent = `${list.listName}: List`;
		m.set('mode', 'list');
		list.getListView(list, root);
	}
}

const validateItemInput = (e, m) => {
	const { inputField } = Object.fromEntries(m);
	//debug ? debugMsg('e.data and e.inputType', [ e.data, e.inputType ]) : null;
	validator = /[^<>?\/\\]/

	if(!validator.test(e.data)) {
		e.preventDefault();
		alert("Invalid characters: <>?\\\/");
	}
	if(e.inputType === 'insertLineBreak')
	{
		//debug ? debugMsg('validateItemInput', [ e.inputType ]) : null;
		inputField.blur;
	}
}

const genuuid = _ => {
	return crypto.randomUUID();
}

// Shopping List functions


