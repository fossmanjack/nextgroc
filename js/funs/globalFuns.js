const addItemByStr = (val, m) => {
	const { list, root, inputField } = Object.fromEntries(m);

	if(!val) return false; // if there's no text in the field don't add an item

	let [ name, qty ] = val.split(',', 2);
	//debug ? debugMsg('addItemByStr', [ name, qty ]) : null;

	if(!qty) qty = 1;

	const send = new ListItem({ title: name, qty: qty, listParent: list });
	const item = list.findItem(send, list);

	item ? item.setState(item, 0) : list.addItem(send, list);
	m.get('mode') === 'library' ? list.getLibraryView(list, root) : list.getListView(list, root);
	inputField.value = '';
	return true;
}

const addStaples = m => {
	m.get('list').items.filter((item) => item.staple).forEach((item) => {
		item.setState(item, 0);
		item.styleHeader(item, m.get('mode'));
	});
	m.get('mode') === 'list' ?
		m.get('list').getListView(m.get('list'), m.get('root')) :
		m.get('list').getLibraryView(m.get('list'), m.get('root'));
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
		title.textContent = `${list.listName}: Library`;
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

