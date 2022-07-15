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

/***** _State management *****/

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
			sortOrder: [ 'title', true ] // make this more bitwise
		}
	};
	window.localStorage.setItem("_State", JSON.stringify(st));
	return st;
}

const updateState = (prop, val) => { // immutably update and save state object
	const newState = { ..._State, prop: val };
	window.localStorage.setItem("_State", JSON.stringify(newState));
	_History.push(_State);
	_State = newState;
}

/***** _Lists management *****/

const initLists = _ => { // initialize _Lists object, used for storage
	const newList = createList();
	const lss = {};

	lss[newList.listID] = newList;
	_State = updateState("list", lss[newList.listID]);
	window.localStorage.setItem("_Lists", JSON.stringify(lss));
	return lss;
}

const updateLists = (prop, val) => { // probably not actually needed
	const newLists = { ..._Lists, prop: val };
	window.localStorage.setItem("_Lists", JSON.stringify(newLists));
	return newLists;
}

const saveLists = _ => window.localStorage.setItem("_Lists", JSON.stringify(_Lists));

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

// this should build a DOM for each list element and store it in a map, hopefully
// The "_RevEls" are accessible from the map value _DOM.get(item).desiredElement
// This isn't strictly necessary as you could access the elements directly using
// document.getElementById(`${idStr}-val`) but storing the reference is easier to
// manage, at least I think
const loadList = _ => _State.list.items.forEach((item) => _DOM.set(item, buildDOM(item)));

const switchList = list => {
	updateState('list', list);
	loadList();
	renderList();
}

/***** Display and Rendering *****/

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

const toggleMode = _ => { // toggle between list and pantry modes
	const { mode, title, btnX, btnY, list, root } = _State;

	if(mode === modeList) { // switch to pantry view
		btnX.classList.remove('fa-broom');
		btnX.classList.add('fa-plus');
		_State = updateState('funs', { ..._State.funs, 'btnX': addStaples });
		btnY.classList.remove('fa-bookmark');
		btnY.classList.add('fa-list');
		title.textContent = `${list.listName}: Pantry`;
		_State = updateState('mode', modePantry);
	} else {
		btnX.classList.remove('fa-plus');
		btnX.classList.add('fa-broom');
		_State = updateState('funs', { ..._State.funs, 'btnX': sweepList });
		btnY.classList.remove('fa-list');
		btnY.classList.add('fa-bookmark');
		title.textContent = `${list.listName}: List`;
		_State = updateState('mode', modeList);
	}
	renderList();
}

/***** List management functions *****/

const editListName = list, str => {
	list.listName = sanitize(str);
	list.modifyDate = Date.now();
	saveLists();
	renderList();
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

const addItemByStr = val => { // add item from input field
	const { list, root, inputField } = _State;

	if(!val) return false; // if there's no text in the field don't add an item

	let [ name, qty ] = val.split(',', 2);
	//debug ? debugMsg('addItemByStr', [ name, qty ]) : null;

	if(!qty) qty = 1;

	const send = new ListItem({ title: name, qty: qty, listParent: list });
	const item = findItem(send, list);

	item ? item.state = itemListed : addItemToList(list, item);
	saveLists();
	inputField.value = '';
	renderList();
	return true;
}

const addStaples = _ => { // add all items flagged as staples to the list view
	const { mode, list, root } = _State;
	list.items.filter((item) => item.staple).forEach((item) => {
		item.state = itemListed;
		if(item.interval)
			debug && debugMsg('addStaples-pre', [ item.purBy, item.history[0], item.interval ]);
			item.purBy = (item.history[0] ? item.history[0] : Date.now()) + (item.interval * 86400000);
			_DOM.get(item).purBy = (item.purBy ? parseDate(item.purBy) : '-');
			debug && debugMsg('addStaples', [ item.purBy ]);
		styleHeader(item);
	});
	saveLists();
	renderList();
}

const sweepList = _ => { // remove all items flagged as bought from the list view
	const { mode, list } = _State;
	list.items.filter((item) => item.state === itemBought)
		.forEach((item) => {
			item.state = itemUnlisted;
			styleHeader(item, mode);
			updateHistory(item);
		});
	saveLists();
	renderList();
}

const validateItemInput = e => { // validate the input field input
	const { inputField } = _State;
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

/***** Item management functions *****/

const updateHistory = item => { // adds timestamp to item.history and updates item's 'last' DOM element
	item.history.unshift(Date.now());
	_DOM.get(item).last.textContent = parseDate(item.history[0]);
	saveLists();
}

const styleHeader = item => { // changes the title style and btn0 function based on state and mode
	const { btn0, title } = _DOM.get(item);
	const { state } = item;

	if(_State.mode === modePantry) {
		if(state !== itemUnlisted) { // listed -- no strikethrough, btn0 is red minus
			btn0.classList.remove('fa-regular', 'fa-square', 'fa-square-check', 'fa-plus', 'btn-success');
			btn0.classList.add('fa-solid', 'fa-minus', 'btn-danger');
			title.style.textDecoration = '';
		} else { // unlisted -- no strikethrough, btn0 is green plus
			btn0.classList.remove('fa-regular', 'fa-square-check', 'fa-square', 'btn-danger', 'fa-minus');
			btn0.classList.add('fa-solid', 'fa-plus', 'btn-success');
			title.style.textDecoration = '';
		}
	} else { // list view
		if(state === itemBought) { // bought -- strikethrough, btn0 is checked box
			btn0.classList.remove('fa-solid', 'fa-square', 'fa-plus', 'fa-minus', 'btn-danger', 'btn-success');
			btn0.classList.add('fa-regular', 'fa-square-check');
			title.style.textDecoration = 'line-through';
		} else { // for state 0 -- unchecked, btn0 is empty box; state 2 isn't shown
			btn0.classList.remove('fa-solid', 'fa-square-check', 'fa-plus', 'fa-minus', 'btn-danger', 'btn-success');
			btn0.classList.add('fa-regular', 'fa-square');
			title.style.textDecoration = '';
		}
	}
}

/***** Button functions *****/

// Button 0: checkItem and toggleListed

const checkItem = item => {
	item.state = !item.state;
	styleHeader(item);
	saveLists();
}

const toggleListed = item => {
	(!item.state || item.state === itemBought) ? item.state = itemUnlisted : item.state = itemListed;
	styleHeader(item);
	saveLists();
}

// Button 1: toggleStaple and editPhoto

const toggleStaple = item => {
	const { btn1 } = _DOM.get(item);

	if(item.staple) {
		item.staple = false;
		btn1.classList.remove('fa-toggle-on');
		btn1.classList.add('fa-toggle-off');
	} else {
		item.staple = true;
		btn1.classList.remove('fa-toggle-off');
		btn1.classList.add('fa-toggle-on');
	}
	ob.modifyDate = Date.now();
	saveLists();
}

const editPhoto = item => {
	/* nyi */
	return false;
}

// Button 2: editItem and commitEdit

const editItem = item => {
	const { btn1, btn2, btn3, acBtn } = _DOM.get(item);
	const validator = /[a-zA-Z0-9\!@#&()\-+=_\/:; ]/;

	acBtn.setAttribute('data-bs-toggle', ''); // turn off accordion button

	// btn1 becomes "add picture"

	/* nyi */

	// btn2 becomes "commit changes"

	btn2.classList.remove('btn-primary', 'fa-pencil');
	btn2.classList.add('btn-success', 'fa-check');
	item.btnFuns[2] = commitEdit;

	// btn3 becomes "cancel changes"

	btn3.classList.remove('btn-warning', 'fa-broom');
	btn3.classList.add('btn-danger', 'fa-xmark');
	item.btnFuns[3] = cancelEdit;

	// add edit properties and outlines to all data-edit-target elements

	Object.values(_DOM.get(item)).forEach((el) => {
		if(el.hasAttribute('data-edit-target')) {
			el.contentEditable = true;
			el.classList.add('edit-target');
			el.addEventListener('beforeinput', el.validateInput = function validateInput(e) {
				debug && console.log(`Key: ${e.data}, Type: ${e.inputType}`);
				if(e.inputType !== 'deleteContentBackward' && !validator.test(e.data)) {
					e.preventDefault();
					alert('Valid characters for input are A-Z, a-z, 0-9, !@#&-+=_ and space');
				}
			});
		};
	});
}

const commitEdit = item => {
	const { btn1, btn2, btn3, acBtn } = _DOM.get(item);

	acBtn.setAttribute('data-bs-toggle', 'collapse'); // turn on accordion button

	// btn1 becomes "toggleStaple"

	/* nyi */

	// btn2 becomes "edit item"

	btn2.classList.remove('btn-success', 'fa-check');
	btn2.classList.add('btn-primary', 'fa-pencil');
	item.btnFuns[2] = editItem;

	// btn3 becomes "sweep item"

	btn3.classList.remove('btn-danger', 'fa-xmark');
	btn3.classList.add('btn-warning', 'fa-broom');
	item.btnFuns[3] = sweepItem;

	Object.entries(_DOM.get(item)).forEach((entry) => {
		const [ key, el ] = entry;

		if(el.hasAttribute('data-edit-target')) {
			el.contentEditable = false;
			el.classList.remove('edit-target');
			el.removeEventListener('beforeinput', validateInput);
			!el.textContent && el.textContent = '-';
			item[key] = el.textContent;
		}
	});
	item.modifyDate = Date.now();
	saveLists();
}

// Button 3: sweepItem and cancelEdit

const cancelEdit = item => {
	const { btn1, btn2, btn3, acBtn } = _DOM.get(item);

	acBtn.setAttribute('data-bs-toggle', 'collapse');

	// btn1 becomes "toggleStaple"

	/* nyi */

	// btn2 becomes "edit item"

	btn2.classList.remove('btn-success', 'fa-check');
	btn2.classList.add('btn-primary', 'fa-pencil');
	item.btnFuns[2] = editItem;

	// btn3 becomes "sweep item"

	btn3.classList.remove('btn-danger', 'fa-xmark');
	btn3.classList.add('btn-warning', 'fa-broom');
	item.btnFuns[3] = sweepItem;

	Object.entries(_DOM.get(item)).forEach((entry) => {
		const [ key, el ] = entry;

		if(el.hasAttribute('data-edit-target')) {
			el.contentEditable = false;
			el.classList.remove('edit-target');
			el.removeEventListener('beforeinput', validateInput);
			el.textContent = item[key];
		}
	});
}

const sweepItem = item => {
	item.state === 1 && updateHistory(item);
	item.state = 2;
	saveLists();
	renderList();
}
