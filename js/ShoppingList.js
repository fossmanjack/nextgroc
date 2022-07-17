/***** ShoppingList class definition *****/
// I'm not gonna do this tonight but you have to make it so that _State.list
// points to the ID of the list, not the list itself, and instead of list you
// want to get _Lists[_State.list] as the actual list reference.

class ShoppingList {
/*
	constructor( {
		listName = 'New List',
		creationDate = Date.now(),
		modifyDate = creationDate,
		items = [],
		listID,
	} ) {
		this.listName = listName;
		this.creationDate = creationDate;
		this.modifyDate = modifyDate;
		this.items = items;
		this.listID = listID || genuuid();
	}
*/
	constructor(params) {
		params = typeof(params) === 'object' ? params : {};

		const { listName, creationDate, modifyDate, items, listID } = params;

		this.listName = listName ? listName : 'New List';
		this.creationDate = creationDate ? creationDate : Date.now();
		this.modifyDate = modifyDate ? modifyDate : creationDate;
		this.items = items && items.length ? items : [ new ListItem( { title: "Sample item", qty: 1 } ) ];
		this.listID = listID ? listID : genuuid();
	}
}

/***** _Lists management *****/

const initLists = _ => { // initialize _Lists object, used for storage
	if(window.localStorage.getItem("_Lists")) {
		debug && console.log('_Lists found in local storage!', window.localStorage.getItem("_Lists"));
		return window.localStorage.getItem("_Lists");
	}

	//debug && debugMsg("initLists", [ _State, _Lists ]);

	const newList = new ShoppingList();
	const lss = {};

	debug && console.log('Creating new _Lists with list', newList);
	lss[newList.listID] = newList;
	debug && debugMsg("initLists 1", [ _State ]);
	updateState("list", newList.listID);
	debug && debugMsg("initLists 2", [ _State]);
	window.localStorage.setItem("_Lists", JSON.stringify(lss));
	debug && debugMsg("initLists: addItem", [ newList, _State ]);
	//addItem(new ListItem( { name: "Sample item", qty: 1 } ));
	return lss;
}

const updateLists = (prop, val) => { // probably not actually needed
	const newLists = { ..._Lists, prop: val };
	window.localStorage.setItem("_Lists", JSON.stringify(newLists));
	return newLists;
}

const saveLists = _ => window.localStorage.setItem("_Lists", JSON.stringify(_Lists));

const addList = ls => { // add list to _Lists object (for storage)
	_Lists[ls.listID] = ls;
	saveLists();
}

const getList = str => {
	const byName = _Lists.find((list) => camelize(list.listName) === camelize(str));
	const byID = _Lists.find((list) => list.listID === str);

	return byName ? byName : byID ? byID : false;
}

// this should build a DOM for each list element and store it in a map, hopefully
// The "_RevEls" are accessible from the map value _DOM.get(item).desiredElement
// This isn't strictly necessary as you could access the elements directly using
// document.getElementById(`${idStr}-val`) but storing the reference is easier to
// manage, at least I think
const loadList = _ => currentList().items.forEach((item) => _DOM.set(item, buildDOM(item)));

const switchList = list => {
	updateState('list', list.listID);
	loadList();
	renderList();
}

const sortList = (items, opts) => {
	const [ field, asc ] = opts;
	sr = _State.mode === modeList ? items.filter((item) => item.state !== 2) : items;

	return sr.sort((a, b) => {
		let x = a[field].toString().toLowerCase();
		let y = b[field].toString().toLowerCase();

		if(asc) return x > y ? 1 : x < y ? -1 : 0;
		else return x > y ? -1 : x < y ? 1 : 0;
	});
}

const currentList = _ => _Lists[_State.list];
/***** ShoppingList management *****/
// ShoppingList originally had class methods but it's just easier to save and load
// from JSON making most everything simple objects and shifting the methods to
// functions

const findItem = input => {
	const list = currentList();

	switch(typeof input) {
		case 'string':
			return list.items.find((item) => camelize(item.title) === camelize(input));
		case 'object':
			return list.items.find((item) => item.title === input.title);
		default:
			return false;
	}
}

/*
const addItem = item => {
	const { list } = _State;

	if(findItem(item)) return false;
	list.items.push(item);
	return true;
}
*/

const addItem = input => {
	const { inputField } = _State;
	const list = currentList();
	var item, itemToAdd;

	if(!input) return false;

	switch(typeof input) {
		case 'string':
			let [ name, qty ] = input.split(',', 2);

			if(!qty) qty = 1;
			itemToAdd = new ListItem( { title: name, qty: qty } );
			break;
		case 'object':
			itemToAdd = input;
			break;
		default:
			return false;
	}
	item = findItem(itemToAdd);

	//item || { list.items.push(itemToAdd); item = itemToAdd; }
	if(!item) {
		list.items.push(itemToAdd);
		item = itemToAdd;
	}

	item.state = itemListed;
	_DOM.set(item, buildDOM(item));
	inputField.value = '';
	saveLists();
	renderList();
}

/*
const addItemByStr = val => { // add item from input field
	const { list, inputField } = _State;

	if(!val) return false; // if there's no text in the field don't add an item

	let [ name, qty ] = val.split(',', 2);
	//debug ? debugMsg('addItemByStr', [ name, qty ]) : null;

	if(!qty) qty = 1;

	const send = new ListItem({ title: name, qty: qty });
	const item = findItem(send);

	item ? item.state = itemListed : addItem(send);
	saveLists();
	inputField.value = '';
	_DOM.set(item, buildDOM(item));
	renderList();
	return true;
}
*/

const removeItem = item => {
	const list = currentList();
	const rem = findItem(item);

	if(rem) {
		list.items = list.items.splice(list.items.indexOf(rem), 1);
		_DOM.delete(rem);
		saveLists();
		renderList();
		return true;
	} else return false;
}

const editListName = str => {
	const list = currentList();

	list.listName = sanitize(str);
	list.modifyDate = Date.now();
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


/* Notes

75941.2
We need:
	- listID
	- listName
	- creationDate
	- modifyDate
	- items (array of objects for now, might need to make it an object later)

	- addItem (by object, probably not by name)
	- getListView (attach DOMElement to document div id="list-root")
	- getLibraryView (same)
	- removeItem (if for some reason you want to)

*/
