class ListItem {
	constructor(props) {
		let { itemName,
			qty = 1,
			state = 0,
			loc = "-",
			price = "-",
			purBy = "-",
			url = "-",
			staple = false,
			interval = 0,
			history = [],
			image = 'default.png',
			notes = "",
			creationDate = Date.now(),
			modifyDate = creationDate,
			DOMElement } = props;
			//_Els = new Map() } = props;
		this.itemName = sanitize(itemName) ? sanitize(itemName) : "list item";
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
		this.setState(state) ? null : this.state = 0;
		this.oid = camelize(this.itemName);
		this.creationDate = creationDate; // ? creationDate : Date.now();
		this.modifyDate = modifyDate; // ? modifyDate : creationDate;
		////this._Els = _Els && _Els.entries().next().value ? _Els : new Map();
		//debug ? console.log("_Els?", [ //this._Els, _Els, _Els.entries() ]) : null;
		this.DOMElement = DOMElement ? DOMElement : this.generateDOM();
		this.btnFuns = [ this.checkItem, this.toggleStaple, this.editItem, this.sweepItem ];
		//this.allEls = this.getAllElements(this.DOMElement, []);
		// //this._Els = new Map();
		this._RevEls = new Map();
		//this._RevEls.set("state", this.getState);
/* A consideration for refactoring: don't store _Els in the object, there's
 * no need.  Instead, generate them after DOMElement is rendered using a function
 * that just calls each document.getElementById(`${idStr}-val`) and maps them
 * accordingly.  You might also be able to do something like add a "data-relevant"
 * field to the elements you want to scoop out and map them based on their ID.
 * Another thing to consider is that you don't actually need a map here, just, y'know --
 * store the various needed DOM elements as object properties.  The only sticky wicket
 * is you have to reload them all in a big long constructor.
 */
	}
	getCamelName() { return camelize(this.itemName); }
	generateRevEls(el) {
		// call this after List attaches the DOMElement to the root
		// A "REleVantELement" is one which we need to earmark for later
		// alteration -- a "state" once we hit the React refactor
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
		el.set("loc", document.getElementById(`${idStr}-locVal`));
		el.set("price", document.getElementById(`${idStr}-price`));
		el.set("url", document.getElementById(`${idStr}-urlVal`));
		el.set("purBy", document.getElementById(`${idStr}-purByVal`));
		el.set("last", document.getElementById(`${idStr}-lastVal`));
	}
	setState(state) {
		if(state && state !== 1 && state !== 2)
		{
			console.log(`Invalid state ${state}!`);
			return false;
		}
		this.state = state;
		this.modifyDate = Date.now();
		//this.DOMElement = this.generateDOM();
		// the previous line was causing problems and I think it's because the calling
		// function, in this case setState, is the "this" referent in the lower-order
		// function, and since setState doesn't have a DOMElement ...
		// This might have been what Stacey was talking about when she was talking about
		// "binding"
		// Anyway it's unnecessary to re-render the DOM element since changing the content
		// seems to automatically re-render the page
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
	getState() {
		debug ? debugMsg('getState', [ this.state ]) : null;
		return this.state;
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
		//debug ? debugMsg("//this._Els?", [ //this._Els ]) : null;

		let root = document.createElement('div'); // accordion-item
		root.classList.add('accordion-item');
		root.id = `${idStr}-root`;
		//this._Els.set("root", root);

/* begin header */
		let header = document.createElement('div'); // accordion-header
		header.classList.add('accordion-header');
		header.id = `${idStr}-header`;
		root.appendChild(header);
		//this._Els.set("header", header);

		let titleBar = document.createElement('div'); // accordion title bar
		titleBar.classList.add('container-fluid');
		header.appendChild(titleBar);

		let trow = document.createElement('div');
		trow.classList.add('row');
		titleBar.appendChild(trow);

		let tcol1 = document.createElement('div');
		tcol1.classList.add('col-1', 'd-flex', 'align-items-center', 'justify-content-center');
		trow.appendChild(tcol1);

		let btn0 = document.createElement('i'); // check box
		btn0.classList.add('fa-regular', 'fa-lg');
		btn0.classList.add(this.state === 1 ? 'fa-square-check' : 'fa-square');
		btn0.type = 'button';
		btn0.id = `${idStr}-btn0`;
		tcol1.appendChild(btn0);
		btn0.addEventListener('click', () => { this.btnFuns[0](this) });
		// We can't do this until we figure out how to store state in the _RevEls map
		// Actually setState() might not be working right
		//btn0.addEventListener('click', () => this.btnFuns[0](this._RevEls) );
		//this._Els.set("btn0", btn0);

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
		//this._Els.set("acBtn", acBtn);


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
		title.textContent = this.itemName;
		title.setAttribute('data-edit-target', true);
		this.state === 1 ? title.style.textDecoration = "line-through" : null;
		acol1.appendChild(title);
		//this._Els.set("title", title);

		let acol2 = document.createElement('div');
		acol2.classList.add('col', 'text-end');
		//qtyDiv.classList.add('text-end');
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
		//this._Els.set("qty", qty);
/* end header */

/* begin card */
		let card = document.createElement('div'); // accordion card div
		card.id=`${idStr}-card`
		card.classList.add('accordion-collapse', 'collapse');
		//card.classList.add('collapse');
		card.setAttribute('data-bs-parent', '#list-root'); // make sure to create this in the page
		root.appendChild(card);
		//this._Els.set("card", card);

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
		//this._Els.set("imgTag", imgTag);

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
		stpTxt.id = `${idStr}-stpTxt`;
		btnCol.appendChild(stpTxt);
		//this._Els.set("stpTxt", stpTxt);

		let btn1 = document.createElement('button');
		btn1.type = 'button';
		btn1.id = `${idStr}-btn1`;
		btn1.classList.add('btn', 'fa-solid', 'fa-lg');
		btn1.classList.add(this.staple ? 'fa-toggle-on' : 'fa-toggle-off');
		btnCol.appendChild(btn1);
		//this._Els.set("btn1", btn1);

		let btn2 = document.createElement('button');
		btn2.type = 'button';
		btn2.id = `${idStr}-btn2`;
		btn2.classList.add('btn', 'btn-primary', 'fa-solid', 'fa-lg', 'fa-pencil');
		btnCol.appendChild(btn2);
		//btn2.addEventListener('click', (
		//btn2.addEventListener('click', this.editItem);
		btn2.addEventListener('click', () => { this.btnFuns[2](this); });
		//this._Els.set("btn2", btn2);

		let btn3 = document.createElement('button');
		btn3.type = 'button';
		btn3.id = `${idStr}-btn3`;
		btn3.classList.add('btn', 'btn-warning', 'fa-solid', 'fa-lg', 'fa-broom');
		btnCol.appendChild(btn3);
		btn3.addEventListener('click', () => { this.btnFuns[3](this); });
		//this._Els.set("btn3", btn3);

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
		//this._Els.set("loc", locVal);

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
		//this._Els.set("price", priceVal);

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
		//this._Els.set("url", urlVal);

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
		//this._Els.set("purBy", purByVal);

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
		//this._Els.set("last", lastVal);

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
		//this._Els.set("interval", intervalVal);

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
		//this._Els.set("notes", notesValCol);

		return root;

	}
	updateDOM(prop, str) {
		document.getElementById(`${this.oid}-${prop}`).textContent = str;
	}
/*
 * Consider: the reason you're not passing the element as-is is because you
 * wanted to remove the event listener, but you don't need to do that -- just change
 * the function that's stored in the event listener variable!
 *
 */

/* begin button 0 functions: checkItem */
	checkItem(ob) {
		//const idStr = ob.oid;
		/* this doesn't work, not sure why
		const ch = ob.DOMElement.children;
		const btn0 = ch.namedItem(`${idStr}-btn0`);
		const title = ch.namedItem(`${idStr}-title`);// => { el.id === `${idStr-title}` });
		It doesn't work because children only contains the direct children, not all
		children.
		*/
		const { state, _RevEls: els } = ob;
		//const { title, btn0 } = _RevEls;

		const title = els.get('title');
		const btn0 = els.get('btn0');

		//const btn0 = document.getElementById(`${idStr}-btn0`);
		//const title = document.getElementById(`${idStr}-title`);

		// debug ? debugMsg("checkItem", [ idStr, btn0, title ]) : null;
		//if(!ob.state) { // change from 0 to 1
		if(!state) {
			title.style.textDecoration = "line-through";
			btn0.classList.remove('fa-square');
			btn0.classList.add('fa-square-check');
			ob.state = 1;
		} else {
			title.style.textDecoration = "";
			btn0.classList.remove('fa-square-check');
			btn0.classList.add('fa-square');
			ob.state = 0;
		}
	}

/* begin button 1 functions: toggleStaple and editPhoto */


/* begin button 2 functions: editItem and commitEdit */
	editItem(ob) {
		// todo: if we're only using allels, idstr, and the buttons,
		// we can refactor this using destructuring instead of
		// passing around the whole object
		const els = ob.allEls;
		const idStr = ob.oid;

		const btn1 = els.find((el) => el.id === `${idStr}-btn1`);
		const btn2 = els.find((el) => el.id === `${idStr}-btn2`);
		const btn3 = els.find((el) => el.id === `${idStr}-btn3`);

		//const root = document.getElementById('list-root');
		// this isn't working
		//const acBtn = els.find((el) => el.id === `${idStr}-expand`);
		const acBtn = document.getElementById(`${idStr}-expand`);
		// turn off the accordion

		//root.classList.remove('accordion', 'accordion-flush');
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

		els.filter((el) => el.hasAttribute('data-edit-target')).forEach((el) => {
			el.contentEditable = true;
			el.classList.add('edit-target');
		}); // it works!
		/*
		//console.log(this.DOMElement);

		const ch = ob.DOMElement.children;
		//const els = [ ];
		const idStr = ob.oid;
		const btn1 = document.getElementById(`${idStr}-btn1`);
		const btn2 = document.getElementById(`${idStr}-btn2`);
		const btn3 = document.getElementById(`${idStr}-btn3`);

		for(let i = 0; i<ch.length; i++) {
			if(ch[i].hasAttribute('data-edit-target'))
				ch[i].contentEditable = true;
		}

		//const els = ch.filter((el) => { el.hasAttribute('data-edit-target'); });
		//const idStr = this.oid;
		//const root = document.getElementById(`${this.oid}-root`);
		//const els = root.children().filter((el) => { el.hasAttribute('data-edit-target'); });
		// getElementById is apparently only available to the document object, so use find() instead
		//const btn1 = ch.find((el) => { el.id === `${idStr-btn1}` });
		//const btn2 = ch.find((el) => { el.id === `${idStr-btn2}` });
		//const btn3 = ch.find((el) => { el.id === `${idStr-btn3}` });
		//const btn1 = this.DOMElement.getElementById(`${idStr}-btn1`);
		//const btn2 = this.DOMElement.getElementById(`${idStr}-btn2`);
		//const btn3 = this.DOMElement.getElementById(`${idStr}-btn3`);
		// btn1 becomes "add photo"
		// btn2 becomes "commit edit"
		btn2.classList.remove('btn-primary', 'fa-pencil');
		btn2.classList.add('btn-success', 'fa-check');
		//btn2.removeEventListener(this.editItem);
		//btn2.addEventListener('click', this.commitEdit);
		ob.btnFuns[2] = ob.commitEdit;
		// btn3 becomes "cancel edit"
		btn3.classList.remove('btn-warning', 'fa-broom');
		btn3.classList.add('btn-danger', 'fa-xmark');
		*/
	}

	commitEdit(ob) {
		const ch = ob.DOMElement.children;
		const els = [ ];
		const idStr = ob.oid;
		const btn1 = document.getElementById(`${idStr}-btn1`);
		const btn2 = document.getElementById(`${idStr}-btn2`);
		const btn3 = document.getElementById(`${idStr}-btn3`);

		for(let i = 0; i<ch.length; i++) {
			if(ch[i].contentEditable)
				ch[i].contentEditable = false;
		}

		// btn1 becomes "staple"
		// btn2 becomes "edit item"
		btn2.classList.remove('btn-success', 'fa-check');
		btn2.classList.add('btn-primary', 'fa-pencil');
		ob.btnFuns[2] = ob.editItem;

		// btn3 becomes "sweep item"
		btn3.classList.remove('btn-danger', 'fa-xmark');
		btn3.classList.add('btn-warning', 'fa-broom');
		ob.btnFuns[3] = ob.sweepItem;
	}

/* begin button 3 functions: sweepItem and cancelEdit */
	cancelEdit(ob) {
		const els = ob.allEls;
		const idStr = ob.oid;

		const btn1 = els.find((el) => el.id === `${idStr}-btn1`);
		const btn2 = els.find((el) => el.id === `${idStr}-btn2`);
		const btn3 = els.find((el) => el.id === `${idStr}-btn3`);

		const acBtn = document.getElementById(`${idStr}-expand`);

		// turn on accordion
		acBtn.setAttribute('data-bs-toggle', 'collapse');

		// btn1 becomes "staple toggle"
		/* nyi */

		// btn2 becomes "edit item"
		btn2.classList.remove('btn-success', 'fa-check');
		btn2.classList.add('btn-primary', 'fa-pencil');
		ob.btnFuns[2] = ob.editItem;

		// btn3 becomes "sweep item"
		btn3.classList.remove('btn-danger', 'fa-xmark');
		btn3.classList.add('btn-warning', 'fa-broom');
		ob.btnFuns[3] = ob.sweepItem;

		// add edit properties and outlines to all data-edit-target elements

		els.filter((el) => el.hasAttribute('data-edit-target')).forEach((el) => {
			el.contentEditable = false;
			el.classList.remove('edit-target');
			// revert all content to what's in the object
		}); // it works!
	}

/* supplementary functions */
	getAllElements(root, els) {
		if(root.children.length) { // this should be a HTML collection
			for(let i=0; i<root.children.length; i++) {
				els = els.concat(this.getAllElements(root.children[i], els));
				//debug ? debugMsg("getAllElements", [ root.children[i], els ]) : null;
			}
			return [...new Set(els)]; // end of recursion, full array, let's sort it all out
		}
		else
		{
			return (els.find((el) => el === root)) ? [] : [ root ];
			//return [...new Set(els)]; // this should filter dupes, test tomorrow
			/*
			if(els.find((el) => el === root))
				return [];
			else
				return [ root ];
			*/
		}
/* this works, but returns truly massive arrays (~350000 elements).  There
* has to be a way to prevent items already on the list from being added
* again
* Okay returning the final element as a Set worked sort of, it doesn't seem
* to return any divs but it does return spans, buttons, inlines, the image, and
* so on, so this might do the trick
*/
	}
}
