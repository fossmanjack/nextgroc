const addItemByStr = (val, m) => {
	const { list, root, inputField } = Object.fromEntries(m);

	let [ name, qty ] = val.split(',', 2);
	debug ? debugMsg('addItemByStr', [ name, qty ]) : null;

	if(!qty) qty = 1;

	send = new ListItem({ title: name, qty: qty, listParent: list });

	if(!list.addItem(send, list)) {
		alert(`Item with ID "${send.oid}" already on list!`);
		return false;
	}
	m.get('mode') === 'library' ? list.getLibraryView(list, root) : list.getListView(list, root);
	inputField.value = '';
	return true;
}
