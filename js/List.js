class BasicList {
	constructor(name="Grocery list", items=[ ]) {
		this.listName = name;
		this.listItems = items;
	}
	checkItem(listItem) {
		debug ? debugMsg("checkItem", [ listItem, this ]) : null;
		return listItem.getCamelName() === this.getCamelName();
	}
	filterNeeded(listItem) { return listItem.needed; }
	addItem(item) {
		debug ? debugMsg("addItem", [ item, this ]) : null;
		// If the item's already on the list we want to toggle its needed status
		const toAdd = this.listItems.find(this.checkItem, item);
		toAdd === undefined ? this.listItems.push(item) : toAdd.setState(0);
		//if(this.listItems.find(this.checkItem, item) !== undefined) {
		//	console.log(`Item ${item.itemName} is already listed!`);
		//	return false;
		//}
		//this.listItems.push(item);
		return true;
	}
	addItemByName(itemName) {
		debug ? debugMsg("addItemByName", [ itemName ]) : null;
		return this.addItem(new BasicItem(itemName));
	}
	getNeeded() {
		return this.listItems.filter(this.filterNeeded);
	}
	getLibrary() {
		return this.listItems;
	}
	sweep() {
		this.listItems.forEach(function(el) {
			el.needed && el.bought ? el.setState("swept") : null;
		});
	}
}
