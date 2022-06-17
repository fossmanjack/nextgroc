/* I was thinking of using a hash identifier but I don't think it's
 * necessary.  Under normal usage the item name won't actually be
 * edited all that often so we can just check for collisions on the
 * rare occasion when it is.  The camelCase name will be the authoritative
 * ID for each object.
 */

class ListItem {
	constructor(props) {
		let { itemName,
			qty,
			state,
			loc,
			price,
			purBy,
			url,
			staple,
			interval,
			history,
			image,
			notes,
			creationDate,
			modifyDate,
			DOMElement } = props;
		this.itemName = sanitize(itemName) ? sanitize(itemName) : "list item";
		this.qty = qty ? qty : "1";
		this.loc = loc ? loc : "-";
		this.price = price ? price : "-";
		this.purBy = purBy ? purBy : "-";
		this.url = url ? url : "-";
		this.staple = staple ? true : false;
		this.interval = interval ? interval : 0;
		this.history = history && history.length ? history : [ ];
		this.image = image ? image : 'default.png';
		this.notes = notes ? notes : "";
		this.setState(state) ? null : this.state = 0;
		this.oid = camelize(this.itemName);
		this.creationDate = creationDate ? creationDate : Date.now();
		this.modifyDate = modifyDate ? modifyDate : creationDate;
		this.DOMElement = DOMElement ? DOMElement : this.generateDOM();
	}
	getCamelName() { return camelize(this.itemName); }
	setState(state) {
		if(!state || state !== 0 && state !== 1 && state !== 2)
		{
			console.log(`Invalid state ${state}!`);
			return false;
		}
		this.state = state;
		this.modifyDate = Date.now();
		this.DOMElement = this.generateDOM();
		return true;
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

		let root = document.createElement('div'); // accordion-item
		root.classList.add('accordion-item');
		root.id = `${idStr}-root`;

/* begin header */
		let header = document.createElement('div'); // accordion-header
		header.classList.add('accordion-header');
		header.id = `${idStr}-header`;
		root.appendChild(header);

		let unfurl = document.createElement('button'); // accordion control button
		unfurl.classList.add('accordion-button', 'collapsed', 'notoggle');
		//unfurl.classList.add('collapsed');
		//unfurl.classList.add('notoggle');
		unfurl.type = 'button';
		unfurl.setAttribute('data-bs-toggle', 'collapse');
		unfurl.setAttribute('data-bs-target', `#${idStr}-card`);
		unfurl.id = `${idStr}-expand`;
		header.appendChild(unfurl);

		let titleBar = document.createElement('div'); // accordion title bar
		titleBar.classList.add('container-fluid');
		unfurl.appendChild(titleBar);

		let trow = document.createElement('div');
		trow.classList.add('row');
		titleBar.appendChild(trow);

		let tcol1 = document.createElement('div');
		tcol1.classList.add('col-8');
		trow.appendChild(tcol1);

		let checkBox = document.createElement('i'); // check box
		checkBox.classList.add('fa-regular');
		checkBox.classList.add(this.state === 1 ? 'fa-square-check' : 'fa-square');
		checkBox.type = 'button';
		checkBox.id = `${idStr}-checkbox`;
		tcol1.appendChild(checkBox);
		checkBox.addEventListener('click', () => {
			if(!this.state) { // change from 0 to 1
				title.style.textDecoration = "line-through";
				checkBox.classList.remove('fa-square');
				checkBox.classList.add('fa-square-check');
				this.state = 1;
			} else { // change from 1 or 2 to 0
				title.style.textDecoration = "";
				checkBox.classList.remove('fa-square-check');
				checkBox.classList.add('fa-square');
				this.state = 0;
			}
		});
		let title = document.createElement('span'); // item name
		title.id = `${idStr}-title`;
		title.textContent = this.itemName;
		title.setAttribute('data-edit-target', true);
		this.state === 1 ? title.style.textDecoration = "line-through" : null;
		tcol1.appendChild(title);

		let qtyDiv = document.createElement('div');
		qtyDiv.classList.add('col', 'text-end');
		//qtyDiv.classList.add('text-end');
		trow.appendChild(qtyDiv);

		let qtyText = document.createElement('span'); // Qty:
		qtyText.classList.add('label-text');
		qtyText.textContent = 'Qty: ';
		qtyDiv.appendChild(qtyText);

		let qty = document.createElement('span'); // item quantity
		qty.id = `${idStr}-qty`;
		qty.textContent = (this.qty ? `${this.qty}` : " ");
		qtyDiv.appendChild(qty);
/* end header */

/* begin card */
		let card = document.createElement('div'); // accordion card div
		card.id=`${idStr}-card`
		card.classList.add('accordion-collapse', 'collapse');
		//card.classList.add('collapse');
		card.setAttribute('data-bs-parent', '#list-root'); // make sure to create this in the page
		root.appendChild(card);

		let acBody = document.createElement('div'); // accordion body
		acBody.classList.add('accordion-body');
		card.appendChild(acBody);

		let bodyRow = document.createElement('div'); // image on left, text on right
		bodyRow.classList.add('row');
		acBody.appendChild(bodyRow);

		let imgCol = document.createElement('div'); // image on left
		imgCol.classList.add('col-sm-6');
		bodyRow.appendChild(imgCol);

		let imgTag = document.createElement('img'); // eventually a carousel
		imgTag.classList.add('img-fluid');
		imgTag.id = `${idStr}-img`;
		imgTag.src = `img/${this.image}`
		imgCol.appendChild(imgTag);

		let detailCol = document.createElement('div'); // text on right
		detailCol.classList.add('col');
		bodyRow.appendChild(detailCol);

		let detailCont = document.createElement('div'); // detail container
		detailCont.classList.add('container-flush');
		detailCol.appendChild(detailCont);

		let detailRow = document.createElement('div');
		detailRow.classList.add('row');
		detailCont.appendChild(detailRow);

		let btnCol = document.createElement('div'); // button column
		btnCol.classList.add('col');
		detailRow.appendChild(btnCol);

		let stpTxt = document.createElement('span');
		stpTxt.classList.add('label-text');
		stpTxt.textContent = "Staple?"
		btnCol.appendChild(stpTxt);

		let btn1 = document.createElement('button');
		btn1.type = 'button';
		btn1.id = `${idStr}-btn1`;
		btn1.classList.add('btn', 'fa-solid', 'fa-lg');
		btn1.classList.add(this.staple ? 'fa-toggle-on' : 'fa-toggle-off');
		btnCol.appendChild(btn1);

		let btn2 = document.createElement('button');
		btn2.type = 'button';
		btn2.id = `${idStr}-btn2`;
		btn2.classList.add('btn', 'btn-success', 'fa-solid', 'fa-lg', 'fa-pencil');
		btnCol.appendChild(btn2);
		//btn2.addEventListener('click', (
		btn2.addEventListener('click', this.editItem);

		let btn3 = document.createElement('button');
		btn3.type = 'button';
		btn3.id = `${idStr}-btn3`;
		btn3.classList.add('btn', 'btn-primary', 'fa-solid', 'fa-lg', 'fa-broom');
		btnCol.appendChild(btn3);
		btn3.addEventListener('click', this.sweepItem);

		let locRow = document.createElement('div'); // location row and column
		locRow.classList.add('row');
		detailCont.appendChild(locRow);

		let locCol = document.createElement('div');
		locCol.classList.add('col');
		locRow.appendChild(locCol);

		let locText = document.createElement('span');
		locText.classList.add('label-text');
		locText.textContent = 'Location:';
		locCol.appendChild(locText);

		let locVal = document.createElement('span');
		locVal.id = `${idStr}-loc`;
		locVal.setAttribute('data-edit-target', true);
		locVal.textContent = (this.loc ? `${this.loc}` : '-');
		locCol.appendChild(locVal);

		let priceRow = document.createElement('div'); // price row and column
		priceRow.classList.add('row');
		detailCont.appendChild(priceRow);

		let priceCol = document.createElement('div');
		priceCol.classList.add('col');
		priceRow.appendChild(priceCol);

		let priceText = document.createElement('span');
		priceText.classList.add('label-text');
		priceText.textContent = 'Price:';
		priceCol.appendChild(priceText);

		let priceVal = document.createElement('span');
		priceVal.id = `${idStr}-price`;
		priceVal.setAttribute('data-edit-target', true);
		priceVal.textContent = (this.price ? `${this.price}` : '-');
		priceCol.appendChild(priceVal);

		let urlRow = document.createElement('div'); // url row and column
		urlRow.classList.add('row');
		detailCont.appendChild(urlRow);

		let urlCol = document.createElement('div');
		urlCol.classList.add('col');
		urlRow.appendChild(urlCol);

		let urlText = document.createElement('span');
		urlText.classList.add('label-text');
		urlText.textContent = 'URL:';
		urlCol.appendChild(urlText);

		let urlVal = document.createElement('span');
		urlVal.id = `${idStr}-url`;
		urlVal.setAttribute('data-edit-target', true);
		urlVal.textContent = (this.url ? `${this.url}` : '-');
		urlCol.appendChild(urlVal);

		let purByRow = document.createElement('div'); // purchase by row and column
		purByRow.classList.add('row');
		detailCont.appendChild(purByRow);

		let purByCol = document.createElement('div');
		purByCol.classList.add('col');
		purByRow.appendChild(purByCol);

		let purByText = document.createElement('span');
		purByText.classList.add('label-text');
		purByText.textContent = 'Purchase By:';
		purByCol.appendChild(purByText);

		let purByVal = document.createElement('span');
		purByVal.id = `${idStr}-purBy`;
		purByVal.setAttribute('data-edit-target', true);
		purByVal.textContent = (this.purBy ? `${this.purBy}` : '-');
		purByCol.appendChild(purByVal);

		let lastRow = document.createElement('div'); // last purchase row and column
		lastRow.classList.add('row');
		detailCont.appendChild(lastRow);

		let lastCol = document.createElement('div');
		lastCol.classList.add('col');
		lastRow.appendChild(lastCol);

		let lastText = document.createElement('span');
		lastText.classList.add('label-text');
		lastText.textContent = 'Last Purchased:';
		lastCol.appendChild(lastText);

		let lastVal = document.createElement('span');
		lastVal.id = `${idStr}-last`;
		lastVal.setAttribute('data-edit-target', true);
		lastVal.textContent = (this.history[0] ? `${this.history[0]}` : '-');
		lastCol.appendChild(lastVal);

		let intervalRow = document.createElement('div'); // purchase interval row and column
		intervalRow.classList.add('row');
		detailCont.appendChild(intervalRow);

		let intervalCol = document.createElement('div');
		intervalCol.classList.add('col');
		intervalRow.appendChild(intervalCol);

		let intervalText = document.createElement('span');
		intervalText.classList.add('label-text');
		intervalText.textContent = 'Interval:';
		intervalCol.appendChild(intervalText);

		let intervalVal = document.createElement('span');
		intervalVal.id = `${idStr}-interval`;
		intervalVal.setAttribute('data-edit-target', true);
		intervalVal.textContent = (this.interval ? `${this.interval}` : '-');
		intervalCol.appendChild(intervalVal);

		// the next two rows get added directly to the acBody element

		let notesTextRow = document.createElement('div')
		notesTextRow.classList.add('row');
		acBody.appendChild(notesTextRow);

		let notesTextCol = document.createElement('div');
		notesTextCol.classList.add('col');
		notesTextRow.appendChild(notesTextCol);

		let notesText = document.createElement('span');
		notesText.classList.add('label-text');
		notesText.textContent = 'Notes';
		notesTextCol.appendChild(notesText);

		let notesValRow = document.createElement('div');
		notesValRow.classList.add('row');
		acBody.appendChild(notesValRow);

		let notesValCol = document.createElement('div');
		notesValCol.classList.add('col');
		notesValCol.id = `${idStr}-notes`;
		notesValCol.setAttribute('data-edit-target', true);
		notesValCol.textContent = `${this.notes}`;
		notesValRow.appendChild(notesValCol);

		return root;

	}
	updateDOM(prop, str) {
		document.getElementById(`${this.oid}-${prop}`).textContent = str;
	}
	editItem() {
		//const els = this.DOMElement.getElements().filter((el) => { el.hasAttribute('data-edit-target'); });
		const idStr = this.oid;
		const root = document.getElementById(`${this.oid}-root`);
		const els = root.children().filter((el) => { el.hasAttribute('data-edit-target'); });
		const btn1 = this.DOMElement.getElementById(`${idStr}-btn1`);
		const btn2 = this.DOMElement.getElementById(`${idStr}-btn2`);
		const btn3 = this.DOMElement.getElementById(`${idStr}-btn3`);
		// btn1 becomes "add photo"
		// btn2 becomes "commit edit"
		btn2.classList.remove('btn-primary', 'fa-pencil');
		btn2.classList.add('btn-success', 'fa-check');
		btn2.removeEventListener(this.editItem);
		btn2.addEventListener('click', this.commitEdit);

		// btn3 becomes "cancel edit"
	}

}
