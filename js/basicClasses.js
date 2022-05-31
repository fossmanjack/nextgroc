const debug = false;

const debugMsg = (fun, params) => {
	console.log("****** DEBUG ******");
	console.log(`Calling function ${fun} with:`);
	for(i in params) {
		console.log("\t", params[i]);
	}
	console.log("*******************");
}

class BasicItem {
	constructor(name="list item", qty="1") {
		this.itemName = name;
		this.qty = qty;
		this.needed = true;
		this.bought = false;
	}
}

class BasicList {
	constructor(name="Grocery list", items=[ ]) {
		this.listName = name;
		this.listItems = items;
	}
	checkItem(listItem) {
		debug ? debugMsg("checkItem", [ listItem, this ]) : null;
		return listItem === this;
	}
	filterNeeded(listItem) { return listItem.needed; }
	addItem(item) {
		debug ? debugMsg("addItem", [ item, this ]) : null;
		if(this.listItems.find(this.checkItem, item) !== undefined) {
			console.log(`Item ${item.itemName} is already listed!`);
			return false;
		}
		this.listItems.push(item);
		return true;
	}
	addItemByName(itemName) {
		return this.addItem(new BasicItem(itemName));
	}
	getNeeded() {
		return this.listItems.filter(this.filterNeeded);
	}
}

function loadList(_List) {
	document.getElementById("list-title").innerHTML = _List.listName;
	for(i in _List.getNeeded()) {
		console.log(_List.getNeeded()[i]);
	}
}


function test() {
	testList = new BasicList("Test list");
	item1 = new BasicItem("Milk", "1 gal");
	item2 = new BasicItem("diet pepsi");
	testList.addItem(item1);
	testList.addItem(item2);
	testList.addItem(new BasicItem("cheese balls"));
	testList.addItemByName("chorizo");

	console.log(testList);
	console.log(testList.getNeeded());
	item1.needed = false;
	console.log(testList.getNeeded());
}

//test();
