/* I was thinking of using a hash identifier but I don't think it's
 * necessary.  Under normal usage the item name won't actually be
 * edited all that often so we can just check for collisions on the
 * rare occasion when it is.  The camelCase name will be the authoritative
 * ID for each object.
 */

class Item {
	constructor(name, qty=" ") {
		this.itemName = sanitize(name) ? sanitize(name) : "list item";	// string
		this.oid = camelize(this.itemName);								// ID string, must be unique
		this.qty = qty;													// string
		this.state = 0;													// 0: listed, 1: bought, 2: unlisted
		this.price = " ";												// string
		this.location = " ";											// string
		this.url = " ";													// string
		this.staple = false;											// bool
		this.interval = 0;												// int
		this.history = [ ];												// Array of ints
		this.image = 'img/default.png';									// string
		this.creationDate = Date.now();
		this.modifyDate = this.creationDate;
		this.DOMElement = this.generateDOM();
	}
	getCamelName() { return camelize(this.itemName); }
	setState(state) {
		// Mostly updates styles
		state !== 0 ?
			(state !== 1 ?
				(state !== 2 ? {
					console.log(`Invalid state ${state}!`);
					this.state = 0;
				} : this.state = 2) :
			this.state = 1) :
		this.state = 0);
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
		this.modifyDate = Date.now();
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
		const idStr = this.oid;

		root = document.createElement('div'); // accordion-item
		root.classList.add('accordion-item');
		root.id = `${idStr}-root`;

		header = document.createElement('div'); // accordion-header
		header.classList.add('accordion-header');
		header.id = `${idStr}-header`;
		root.appendChild(header);

		unfurl = document.createElement('button'); // accordion control button
		unfurl.classList.add('accordion-button');
		unfurl.classList.add('collapsed');
		unfurl.classList.add('notoggle');
		unfurl.type = 'button';
		unfurl.setAttribute('data-bs-toggle', 'collapse');
		unfurl.setAttribute('data-bs-target', `${idStr}-card`);
		unfurl.id = `{idStr}-expand`;
		header.appendChild(unfurl);

		titleBar = document.createElement('div'); // accordion title bar
		titleBar.classList.add('container-fluid');
		unfurl.appendChild(titleBar);

		trow = document.createElement('div');
		trow.classList.add('row');
		title.appendChild(trow);

		tcol1 = document.createElement('div');
		tcol1.classList.add('col-8');
		trow.appendChild(tcol1);

		checkBox = document.createElement('span'); // check box
		checkBox.classList.add('fa-regular');
		checkBox.classList.add(this.state === 1 ? 'fa-square-check' : 'fa-square');
		checkBox.type = 'button';
		checkBox.id = `${idStr}-checkbox`;
		tcol1.appendChild(checkBox);

		title = document.createElement('span'); // item name
		title.id = `${idStr}-title`;
		title.textContent = this.itemName;
		this.state === 1 ? title.style.textDecoration = "line-through" : null;
		tcol1.appendChild(title);

		qtyDiv = document.createElement('div');
		qtyDiv.classList.add('col');
		qtyDiv.classList.add('text-end');
		tcol1.appendChild.qtyDiv;

		qtyText = document.createElement('span'); // Qty:
		qtyText.classList.add('label-text');
		qtyText.textContent = 'Qty: ';
		qtyDiv.appendChild(qtyText);

		qty = document.createElement('span'); // item quantity
		qty.id = `${idStr}-qty`;
		qty.textContent = this.qty;
		qtyDiv.appendChild(qty);

		return root;
	}
	updateDOM(prop, str) {
		document.getElementById(`${this.oid}-${prop}`).innerText = str;
	}
}
