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

		list.items.filter((item) => item.state !== 2).forEach((item) => {
		//const items = list.items.filter((item) => item.state !== 2);
		//items.forEach((item) => {
			const { btn0, title } = Object.fromEntries(item._RevEls);

			switch(item.state) {
				case 0:
					btn0.classList.remove('fa-square-check');
					btn0.classList.add('fa-square');
					item.btnFuns[0] = item.checkItem;
					title.style.textDecoration = '';
					break;
				case 1:
					btn0.classList.remove('fa-square');
					btn0.classList.add('fa-square-check');
					title.style.textDecoration = 'line-through';
					item.btnFuns[0] = item.checkItem;
					break;
				default: // default to 0
					btn0.classList.remove('fa-square-check');
					btn0.classList.add('fa-square');
					item.btnFuns[0] = item.checkItem;
					title.style.textDecoration = '';
					console.log("Item state default encountered:", item);
			}

			root.appendChild(item.DOMElement);
		});
	}
	getLibraryView(list, root) {
		!root ? root = document.getElementById('list-root') : null;

		list.items.forEach((item) => {
			const { btn0, title } = Object.fromEntries(item._RevEls);

			switch(item.state) {
				case 0: case 1:
					btn0.classList.remove('fa-square');
					btn0.classList.add('fa-square-check');
					title.style.textDecoration = '';
					break;
				default:
					btn0.classList.remove('fa-square-check');
					btn0.classList.add('fa-square');
					title.style.textDecoration = '';
			}

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
