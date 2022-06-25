class ListItem {
	constructor( {
		title,
		qty = 1,
		state = 0,
		loc = '-',
		price = '-',
		purBy = '-',
		url = '-',
		staple = false,
		interval = 0,
		history = [],
		image = 'default.png',
		notes = '...',
		creationDate = Date.now(),
		modifyDate = creationDate,
		DOMElement
	} ) {
		this.title = sanitize(title) ? sanitize(title) : "list item";
		this.qty = qty; // ? qty : "1";
		this.loc = loc; // ? loc : "-";
		this.price = price; // ? price : "-";
		this.purBy = purBy; // ? purBy : "-";
		this.url = url; // ? url : "-";
		this.staple = staple; // ? true : false;
		this.interval = interval; // ? interval : 0;
		this.history = history; // && history.length ? history : [ ];
		this.image = image; // ? image : 'default.png';
		this.notes = notes; // ? notes : "";
		this.oid = camelize(this.title);
		this.creationDate = creationDate; // ? creationDate : Date.now();
		this.modifyDate = modifyDate; // ? modifyDate : creationDate;
		this.state = (state < 3 ? state : 0);
		this._RevEls = new Map();
		this.DOMElement = DOMElement ? DOMElement : this.generateDOM();
		this.btnFuns = [ this.checkItem, this.toggleStaple, this.editItem, this.sweepItem ];
		//this._RevEls = new Map();
		this.listParent = ({});
	}
	getCamelName() { return camelize(this.title); }
/*
	generateRevEls(el) {
		// call this after List attaches the DOMElement to the root
		// A "REleVantELement" is one which we need to earmark for later
		// alteration -- a "state" once we hit the React refactor
		debug ? debugMsg("generateRevEls", []) : null;
		const idStr = this.oid;
		el.set("root", document.getElementById(`${idStr}-root`));
		el.set("header", document.getElementById(`${idStr}-header`));
		el.set("btn0", document.getElementById(`${idStr}-btn0`));
		el.set("btn1", document.getElementById(`${idStr}-btn1`));
		el.set("btn2", document.getElementById(`${idStr}-btn2`));
		el.set("btn3", document.getElementById(`${idStr}-btn3`));
		el.set("acBtn", document.getElementById(`${idStr}-acBtn`));
		el.set("title", document.getElementById(`${idStr}-title`));
		el.set("qty", document.getElementById(`${idStr}-qty`));
		el.set("card", document.getElementById(`${idStr}-card`));
		el.set("img", document.getElementById(`${idStr}-img`));
		el.set("stpTxt", document.getElementById(`${idStr}-stpTxt`));
		el.set("loc", document.getElementById(`${idStr}-loc`));
		el.set("price", document.getElementById(`${idStr}-price`));
		el.set("url", document.getElementById(`${idStr}-url`));
		el.set("purBy", document.getElementById(`${idStr}-purBy`));
		el.set("interval", document.getElementById(`${idStr}-interval`));
		el.set("notes", document.getElementById(`${idStr}-notes`));
	}
*/
	setState(ob, state) {
		switch(state) {
			case 0: case 1: case 2:
				ob.state = state;
				break;
			default:
				console.log("Invalid state selected!", ob, state);
				ob.state = 0;
		}
	}
/*
	setName(str) {
		str = sanitize(str);
		debug ? debugMsg('setName', [ str ]) : null;
		if(str) {
			this.title = str;
			return true;
		} else {
			return false;
		}
	}
	setProp(prop, str) {
		debug ? debugMsg('setProp', [ prop, str ]) : null;
		this.modifyDate = Date.now();
		if(prop === "title") {
			return this.setName(str);
		} else {
			this[prop] = str;
			this.updateDOM(prop, str);
			return true;
		}
	}
	getState() {
		debug ? debugMsg('getState', [ this.state ]) : null;
		return this.state;
	}
*/

	generateDOM() {
		const idStr = this.oid;

		let root = document.createElement('div'); // accordion-item
		root.classList.add('accordion-item');
		root.id = `${idStr}-root`;

/* begin header */
		let header = document.createElement('div'); // accordion-header
		header.classList.add('accordion-header');
		header.id = `${idStr}-header`;
		root.appendChild(header);

		let titleBar = document.createElement('div'); // accordion title bar
		titleBar.classList.add('container-fluid');
		header.appendChild(titleBar);

		let trow = document.createElement('div');
		trow.classList.add('row');
		titleBar.appendChild(trow);

		let tcol1 = document.createElement('div');
		tcol1.classList.add('col-1', 'd-flex', 'align-items-center', 'justify-content-center');
		trow.appendChild(tcol1);

		let btn0 = document.createElement('button'); // check box
		btn0.classList.add('btn', 'fa-regular', 'fa-lg');
		btn0.classList.add(this.state === 1 ? 'fa-square-check' : 'fa-square');
		btn0.type = 'button';
		btn0.id = `${idStr}-btn0`;
		tcol1.appendChild(btn0);
		btn0.addEventListener('click', () => { this.btnFuns[0](this) });

		let tcol2 = document.createElement('div');
		tcol2.classList.add('col');
		trow.appendChild(tcol2);

		let acBtn = document.createElement('button'); // accordion control button
		acBtn.classList.add('accordion-button', 'collapsed', 'notoggle');
		acBtn.type = 'button';
		acBtn.setAttribute('data-bs-toggle', 'collapse');
		acBtn.setAttribute('data-bs-target', `#${idStr}-card`);
		acBtn.id = `${idStr}-acBtn`;
		tcol2.appendChild(acBtn);

		let acont = document.createElement('div');
		acont.classList.add('container-fluid');
		acBtn.appendChild(acont);

		let arow = document.createElement('div');
		arow.classList.add('row');
		acont.appendChild(arow);

		let acol1 = document.createElement('div');
		acol1.classList.add('col-8');
		arow.appendChild(acol1);

		let title = document.createElement('h4'); // item name
		title.id = `${idStr}-title`;
		title.textContent = this.title;
		title.setAttribute('data-edit-target', true);
		title.style.textDecoration = (this.state === 1 ? 'line-through' : '');
		acol1.appendChild(title);

		let acol2 = document.createElement('div');
		acol2.classList.add('col', 'text-end');
		arow.appendChild(acol2);

		let qtyText = document.createElement('span'); // Qty:
		qtyText.classList.add('label-text');
		qtyText.textContent = 'Qty: ';
		acol2.appendChild(qtyText);

		let qty = document.createElement('span'); // item quantity
		qty.id = `${idStr}-qty`;
		qty.setAttribute('data-edit-target', true);
		qty.textContent = (this.qty ? `${this.qty}` : " ");
		acol2.appendChild(qty);
/* end header */

/* begin card */
		let card = document.createElement('div'); // accordion card div
		card.id=`${idStr}-card`
		card.classList.add('accordion-collapse', 'collapse');
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

		let btn1Label = document.createElement('span');
		btn1Label.classList.add('label-text');
		btn1Label.textContent = "Staple?"
		btn1Label.id = `${idStr}-btn1Label`;
		btnCol.appendChild(btn1Label);

		let btn1 = document.createElement('button');
		btn1.type = 'button';
		btn1.id = `${idStr}-btn1`;
		btn1.classList.add('btn', 'fa-solid', 'fa-lg');
		btn1.classList.add(this.staple ? 'fa-toggle-on' : 'fa-toggle-off');
		btnCol.appendChild(btn1);
		btn1.addEventListener('click', () => { this.btnFuns[1](this); });

		let btn2 = document.createElement('button');
		btn2.type = 'button';
		btn2.id = `${idStr}-btn2`;
		btn2.classList.add('btn', 'btn-primary', 'fa-solid', 'fa-lg', 'fa-pencil');
		btnCol.appendChild(btn2);
		btn2.addEventListener('click', () => { this.btnFuns[2](this); });

		let btn3 = document.createElement('button');
		btn3.type = 'button';
		btn3.id = `${idStr}-btn3`;
		btn3.classList.add('btn', 'btn-warning', 'fa-solid', 'fa-lg', 'fa-broom');
		btnCol.appendChild(btn3);
		btn3.addEventListener('click', () => { this.btnFuns[3](this); });

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
		lastVal.textContent = (this.history[0] ? `${this.parseDate(this.history[0])}` : '-');
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

		// Trying to set _RevEls here
		this._RevEls.set("root", root);
		this._RevEls.set("header", header);
		this._RevEls.set("btn0", btn0);
		this._RevEls.set("btn1", btn1);
		this._RevEls.set("btn2", btn2);
		this._RevEls.set("btn3", btn3);
		this._RevEls.set("acBtn", acBtn);
		this._RevEls.set("title", title);
		this._RevEls.set("qty", qty);
		this._RevEls.set("card", card);
		this._RevEls.set("img", imgTag);
		this._RevEls.set("btn1Label", btn1Label);
		this._RevEls.set("loc", locVal);
		this._RevEls.set("price", priceVal);
		this._RevEls.set("url", urlVal);
		this._RevEls.set("purBy", purByVal);
		this._RevEls.set("interval", intervalVal);
		this._RevEls.set("last", lastVal);
		this._RevEls.set("notes", notesValCol);

		return root;

	}
	updateDOM(prop, str) {
		document.getElementById(`${this.oid}-${prop}`).textContent = str;
	}

/* begin button 0 functions: checkItem */
	checkItem(ob) {
		const { btn0, title } = Object.fromEntries(ob._RevEls);
		debug ? debugMsg("checkItem", [ ob, _State.get('mode') ]) : null;
		ob.state ? ob.setState(ob, 0) : ob.setState(ob, 1);
		ob.styleHeader(ob, _State.get('mode'));
	}

	toggleListing(ob) {
		(!ob.state || ob.state === 1) ? ob.setState(ob, 2) : ob.setState(ob, 0);
		ob.styleHeader(ob, _State.get('mode'));
	}

/* begin button 1 functions: toggleStaple and editPhoto */

	toggleStaple(ob) {
		const { btn1 } = Object.fromEntries(ob._RevEls);

		debugMsg("toggleStaple", [ btn1, ob.staple ]);
		if(ob.staple) {
			ob.staple = false;
			btn1.classList.remove('fa-toggle-on');
			btn1.classList.add('fa-toggle-off');
		} else {
			ob.staple = true;
			btn1.classList.remove('fa-toggle-off');
			btn1.classList.add('fa-toggle-on');
		};
		ob.modifyDate = Date.now();
	}


/* begin button 2 functions: editItem and commitEdit */
	editItem(ob) {
		const { btn1, btn2, btn3, acBtn } = Object.fromEntries(ob._RevEls);
		const validator = /[a-zA-Z0-9\!@#&()\-+=_\/:; ]/
		//const validator = /[a-zA-Z0-9]/
		acBtn.setAttribute('data-bs-toggle', '');

		// btn1 becomes "add picture"

		/* nyi */

		// btn2 becomes "commit changes"

		btn2.classList.remove('btn-primary', 'fa-pencil');
		btn2.classList.add('btn-success', 'fa-check');
		ob.btnFuns[2] = ob.commitEdit;

		// btn3 becomes "cancel changes"
		btn3.classList.remove('btn-warning', 'fa-broom');
		btn3.classList.add('btn-danger', 'fa-xmark');
		ob.btnFuns[3] = ob.cancelEdit;

		// add edit properties and outlines to all data-edit-target elements

		ob._RevEls.forEach((el) => {
			if(el.hasAttribute('data-edit-target')) {
				el.contentEditable = true;
				el.classList.add('edit-target');
				// TODO: add event listener to filter out invalid input
				el.addEventListener('beforeinput', el.validateInput = function validateInput(e) {
					// doesn't quite work
					console.log(`Key: ${e.data}, Type: ${e.inputType}`);
					if(e.inputType !== "deleteContentBackward" && !validator.test(e.data)) {
						e.preventDefault();
						alert("Valid characters forinput are A-Z, a-z, 0-9, !@#&-+=_ and space");
					}
				});
			};
		});
	}

	commitEdit(ob) {
		// this function must parse through _RevEls, grab the textContent, and
		// set the associated object property to that content
		const { btn1, btn2, btn3, acBtn } = Object.fromEntries(ob._RevEls);

		acBtn.setAttribute('data-bs-toggle', 'collapse');

		// btn1 becomes "staple"

		/* nyi */

		// btn2 becomes "edit item"
		btn2.classList.remove('btn-success', 'fa-check');
		btn2.classList.add('btn-primary', 'fa-pencil');
		ob.btnFuns[2] = ob.editItem;

		// btn3 becomes "sweep item"
		btn3.classList.remove('btn-danger', 'fa-xmark');
		btn3.classList.add('btn-warning', 'fa-broom');
		ob.btnFuns[3] = ob.sweepItem;

		ob._RevEls.forEach((el, key) => {
			if(el.hasAttribute('data-edit-target')) {
				el.contentEditable = false;
				el.classList.remove('edit-target');
				// figure out a way to do this that works -- right now validateInput is not defined
				el.removeEventListener('beforeinput', el.validateInput);
				//el.textContent = ob[`${key}`];
				!el.textContent && (el.textContent = "-");
				ob[`${key}`] = el.textContent;// ? el.textContent : "-";
			};
		});
		ob.modifyDate = Date.now();

	}

/* begin button 3 functions: sweepItem and cancelEdit */
	cancelEdit(ob) {
		// This function must parse through _RevEls and overwrite the value for
		// each key with the object's associated property
		const { btn1, btn2, btn3, acBtn } = Object.fromEntries(ob._RevEls);

		acBtn.setAttribute('data-bs-toggle', 'collapse');

		// btn1 becomes "staple"

		/* nyi */

		// btn2 becomes "edit item"
		btn2.classList.remove('btn-success', 'fa-check');
		btn2.classList.add('btn-primary', 'fa-pencil');
		ob.btnFuns[2] = ob.editItem;

		// btn3 becomes "sweep item"
		btn3.classList.remove('btn-danger', 'fa-xmark');
		btn3.classList.add('btn-warning', 'fa-broom');
		ob.btnFuns[3] = ob.sweepItem;

		ob._RevEls.forEach((el, key) => {
			if(el.hasAttribute('data-edit-target')) {
				el.contentEditable = false;
				el.classList.remove('edit-target');
				el.removeEventListener('beforeinput', el.validateInput); // undefined?
				el.textContent =  ob[`${key}`];
			};
		});
	}

	sweepItem(ob) {
		const { listParent } = ob;
		debugMsg("sweepItem", [ ob ]);
		ob.state === 1 && ob.updateHistory(ob);
		ob.setState(ob, 2);
		listParent.getListView(listParent, _State.get('root'));
	}

	styleHeader(ob, mode) {
		const { btn0, title }  = Object.fromEntries(ob._RevEls);
		const state = ob.state;
		debug ? debugMsg("styleHeader", [ mode, state ]) : null;

		switch(mode) {
			case 'library':
				switch(state) {
					case 0: case 1: // listed -- no strikethrough, btn0 is red minus
						btn0.classList.remove('fa-regular', 'fa-square', 'fa-square-check', 'fa-plus', 'btn-success');
						btn0.classList.add('fa-solid', 'fa-minus', 'btn-danger');
						title.style.textDecoration = '';
						debug ? debugMsg('styleHeader: library-state detected', [ mode, state ]) : null;
						break;
					default: // unlisted -- no strikethrough, btn0 is green plus
						btn0.classList.remove('fa-regular', 'fa-square-check', 'fa-square', 'btn-danger', 'fa-minus');
						btn0.classList.add('fa-solid', 'fa-plus', 'btn-success');
						debug ? debugMsg('styleHeader: library-default detected', [ mode, state ]) : null;
						title.style.textDecoration = '';
					}
					break;
			default: // list view
				switch(state) {
					case 1: // bought -- strikethrough, btn0 is checked box
						btn0.classList.remove('fa-solid', 'fa-square', 'fa-plus', 'fa-minus', 'btn-danger', 'btn-success');
						btn0.classList.add('fa-regular', 'fa-square-check');
						title.style.textDecoration = 'line-through';
						debug ? debugMsg('styleHeader: list-state detected', [ mode, state] ) : null;
						break;
					default: // for state 0 -- unchecked, btn0 is empty box -- state 2 isn't listed
						btn0.classList.remove('fa-solid', 'fa-square-check', 'fa-plus', 'fa-minus', 'btn-danger', 'btn-success');
						btn0.classList.add('fa-regular', 'fa-square');
						debug ? debugMsg('styleHeader: list-default detected', [ mode, state ]) : null;
						title.style.textDecoration = '';
				}
		}
	}
	updateHistory(ob) {
		ob.history.unshift(Date.now());
		//ob._RevEls.set('last', ob.parseDate(ob.history[0]));
		ob._RevEls.get('last').textContent = ob.parseDate(ob.history[0]);
	}
	parseDate(i) {
		return i;
	}
/* supplementary functions
	getAllElements(root, els) {
		if(root.children.length) { // this should be a HTML collection
			for(let i=0; i<root.children.length; i++) {
				els = els.concat(this.getAllElements(root.children[i], els));
			}
			return [...new Set(els)]; // end of recursion, full array, let's sort it all out
		}
		else
		{
			return (els.find((el) => el === root)) ? [] : [ root ];
		}
	}
*/
}
