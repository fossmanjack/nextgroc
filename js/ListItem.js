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
