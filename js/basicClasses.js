//import { debugMsg } from './debug.mjs';
/*
const debugMsg = (fun, params) => {
	console.log("****** DEBUG ******");
	console.log(`Calling function ${fun} with:`);
	for(i in params) {
		console.log("\t", params[i]);
	}
	console.log("*******************");
}

const debug = false;
*/

const camelize = str => str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, c) => c.toUpperCase());
const sanitize = str => str.replace(/[~!@#$%^&*().,<>?_=+:;\'\"\/\-\[\]\{\}\\\|\`]/g, '');
// ! @ # $ % ^ & * ( ) - _ = + [ ] { } \ | , . < > ? / ' " : ; ` ~
// it may not be necessary to strip all this out

class BasicItem {
	constructor(name, qty="1") {
		this.itemName = sanitize(name) ? sanitize(name) : "list item";
		this.qty = qty;
		this.needed = true;
		this.bought = false;
		this.creationDate = Date.now();
		this.modifyDate = this.creationDate;
		this.oid = this.generateOid();
		this.DOMElement = this.generateDOM();
	}
	generateOid() {
		let str = `${this.itemName}${this.creationDate}`;
		return window.btoa(unescape(encodeURIComponent( str ))).slice(0, 12);
	}
	getOid() { return this.oid; }
	getCamelName() { return camelize(this.itemName); }
	setState(state) {
	// there are three states:
	// needed: item listed, needed = true, bought = false
	// bought: item listed, needed = true, bought = true
	// swept: item not listed, needed = false, bought = false
		switch(state) {
			case 0: case "needed":
				this.needed = true;
				this.bought = false;
				break;
			case 1: case "bought":
				this.needed = true;
				this.bought = true;
				break;
			case 2: case "swept":
				this.needed = false;
				this.bought = false;
				break;
			default: // default to state 0
				this.needed = true;
				this.bought = false;
		}
	}
	setName(str) {
	//	this.itemName = sanitize(name) ? sanitize(name) : "list item";
		str = sanitize(str);
		debug ? debugMsg('setName', [ str ]) : null;
		if(str) {
			this.itemName = str;
			return true;
		} else {
			return false;
		}
	}
	setProp(prop, str) {
		debug ? debugMsg('setProp', [ prop, str ]) : null;
		if(prop === "itemName") {
			return this.setName(str);
		} else {
			this[prop] = str;
			this.updateDOM(prop, str);
			return true;
		}
	}
	generateDOM() {
		// this builds a ... hm.  This might not actually work.  The plan here
		// was to build a DOM element that the object could carry with it, and
		// that might actually still work.  I'm pretty sure carrying the DOM with
		// the object will make ordering the lists easier and might even enable
		// dragging items from one list to another in the sidebar.
		// While we're building it, might as well make it an accordion
		// Also gonna need a Library version since that renders different
		div = document.createElement('div');
	}
	updateDOM(prop, str) {
		document.getElementById(`${this.oid}-${prop}`).innerText = str;
	}
}

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

function loadList(_List) {
	document.getElementById("list-title").innerHTML = _List.listName;
	/*
	for(i in _List.getNeeded()) {
		console.log(_List.getNeeded()[i]);
	}
	*/
	_List.getNeeded().forEach(function(o) {
		console.log(o);
	});
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
