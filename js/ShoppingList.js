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
		return camelize(name)+"-"+date;
	}
	addItem(item, list)
	{
		if(list.items.find((ob) => ob === item)) return false;
		list.items.push(item);
		return true;
	}
	getListView(list, root) {
		!root ? root = document.getElementById("list-root") : null;

		root.innerHTML = '';
		debug ? debugMsg('getListView', [ list, root ]) : null;
		list.items.filter((item) => item.state !== 2).forEach((item) => {
		//const items = list.items.filter((item) => item.state !== 2);
		//items.forEach((item) => {
			debug ? debugMsg("forEach", [ item ]) : null;
			//const { btn0, title } = Object.fromEntries(item._RevEls);
			item.btnFuns[0] = item.checkItem;

			root.appendChild(item.DOMElement);
		});
	}
	getLibraryView(list, root) {
		!root ? root = document.getElementById('list-root') : null;

		//root.innerHTML = '';
		list.items.forEach((item) => {
			//const { btn0, title } = Object.fromEntries(item._RevEls);

			item.btnFuns[0] = item.toggleListing;

			root.appendChild(item.DOMElement);
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
