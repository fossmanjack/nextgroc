
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


/***** List management functions *****/

const editListName = list, str => {
	list.listName = sanitize(str);
	list.modifyDate = Date.now();
	saveLists();
	renderList();
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
	_DOM.set(item, buildDOM(item));
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

