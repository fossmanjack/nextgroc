const addItemByStr = (val, m) => {
	const { list, root, inputField } = Object.fromEntries(m);

	if(!val) return false; // if there's no text in the field don't add an item

	let [ name, qty ] = val.split(',', 2);
	debug ? debugMsg('addItemByStr', [ name, qty ]) : null;

	if(!qty) qty = 1;

	const send = new ListItem({ title: name, qty: qty, listParent: list });
	const item = list.findItem(send, list);

	item ? item.setState(item, 0) : list.addItem(send, list);
	/*
	if(item) {
		item.setState(0);
	} else {
		list.addItem(send, list);
	}
	if(!list.addItem(send, list)) {
		alert(`Item with ID "${send.oid}" already on list!`);
		return false;
	}
*/
	m.get('mode') === 'library' ? list.getLibraryView(list, root) : list.getListView(list, root);
	inputField.value = '';
	return true;
}
