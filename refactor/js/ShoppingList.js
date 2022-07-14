class ShoppingList {
	constructor( {
		listName = 'Unnamed List',
		creationDate = Date.now(),
		modifyDate = creationDate,
		items = [],
		listID
	} ) {
		this.listName = 'Unnamed List';
		this.creationDate = creationDate;
		this.modifyDate = modifyDate;
		this.items = items;
		this.docRoot = ({});
		this.listID = listID ? listID : this.generateListID(listName, creationDate);
	}
	generateListID(name, date) {
		return `${name}-${date}`;
	}
	addItem(item, list) {
		if(list.findItem(item, list)) return false;
		list.items.push(item);
		return true;
	}
	findItem(input, list) {
		switch(typeof input)
		{
			case 'string':
				return list.items.find((item) => item.oid === camelize(input));
			case 'object':
				return list.items.find((item) => item.oid === input.oid);
			default:
				return false;
		}
	}
	findByName(ob, list) {
		return list.items.find((item) => ob.oid === item.oid);
	}
	getListView(list, root = document.getElementById('list-root')) {
		//debug ? debugMsg('getListView-pre', [ root ]) : null;

		root.innerHTML = '';
		//debug ? debugMsg('getListView', [ list, root ]) : null;
		list.items.filter((item) => item.state !== 2).forEach((item) => {
			//debug ? debugMsg("forEach", [ item ]) : null;
			item.btnFuns[0] = item.checkItem;
			item.styleHeader(item, _State.get('mode'));

			root.appendChild(item.DOMElement);
		});
	}
	getLibraryView(list, root = document.getElementById('list-root')) {

		root.innerHTML = '';
		// This is mostly for testing.  Implement "sort" buttons that select each
		// sort view.  This does work, however, as-is.
		const retarr = this.sorter(list.items, "title", true);
//		list.items.forEach((item) => {
		retarr.forEach((item) => {

			item.btnFuns[0] = item.toggleListing;
			item.styleHeader(item, 'library');

			root.appendChild(item.DOMElement);
		});
	}
	sorter(list, field, asc) {
		debug ? debugMsg("sorter", [ list, field, acc ]) : null;
		return list.sort((a, b) => {
			let x = a[field].toString().toLowerCase();
			let y = b[field].toString().toLowerCase();

			if(asc) return x > y ? 1 : x < y ? -1 : 0;
			else return x > y ? -1 : x < y ? 1 : 0;
		});
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
