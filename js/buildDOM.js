const buildDOM = item => {
	const idStr = camelize(item.title);

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
	btn0.classList.add(item.state === itemBought ? 'fa-square-check' : 'fa-square');
	btn0.type = 'button';
	btn0.id = `${idStr}-btn0`;
	tcol1.appendChild(btn0);
	btn0.addEventListener('click', () => { item.btnFuns[0](item) });

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
	title.textContent = item.title;
	title.setAttribute('data-edit-target', true);
	title.style.textDecoration = (item.state === itemBought ? 'line-through' : '');
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
	qty.textContent = (item.qty ? `${item.qty}` : " ");
	acol2.appendChild(qty);
/* end header */

/* begin card */
	let card = document.createElement('div'); // accordion card div
	card.id=`${idStr}-card`
	card.classList.add('accordion-collapse', 'collapse');
	card.setAttribute('data-bs-parent', '#list-root'); // make sure to create item in the page
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
	imgTag.src = item.images.length ? item.images[0] : defaultImage;
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
	btn1.classList.add(item.staple ? 'fa-toggle-on' : 'fa-toggle-off');
	btnCol.appendChild(btn1);
	btn1.addEventListener('click', () => { item.btnFuns[1](item); });

	let btn2 = document.createElement('button');
	btn2.type = 'button';
	btn2.id = `${idStr}-btn2`;
	btn2.classList.add('btn', 'btn-primary', 'fa-solid', 'fa-lg', 'fa-pencil');
	btnCol.appendChild(btn2);
	btn2.addEventListener('click', () => { item.btnFuns[2](item); });

	let btn3 = document.createElement('button');
	btn3.type = 'button';
	btn3.id = `${idStr}-btn3`;
	btn3.classList.add('btn', 'btn-warning', 'fa-solid', 'fa-lg', 'fa-broom');
	btnCol.appendChild(btn3);
	btn3.addEventListener('click', () => { item.btnFuns[3](item); });

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
	locVal.textContent = (item.loc ? `${item.loc}` : '-');
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
	priceVal.textContent = (item.price ? `${item.price}` : '-');
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
	urlVal.textContent = (item.url ? `${item.url}` : '-');
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

	let purByVal = document.createElement('input');
	purByVal.id = `${idStr}-purBy`;
	purByVal.classList.add('form-control');
	purByVal.type = 'date';
	purByVal.min = parseDate(Date.now());
	purByVal.name = `${idStr}-purBy`;
	purByVal.value = (item.purBy ? parseDate(item.purBy) : '-');
	purByCol.appendChild(purByVal);
	purByCol.addEventListener('focus', (purByCol) => purByCol.type = 'date');
	purByCol.addEventListener('change', (e) => {
		//debug ? debugMsg("onclick change", [ e, ob, e.target.value ]) : null;
		item.purBy = Date.parse(e.target.value);
	});

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
	lastVal.textContent = (item.history[0] ? `${parseDate(item.history[0])}` : '-');
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
	intervalVal.textContent = (item.interval ? `${item.interval}` : '-');
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
	notesValCol.textContent = `${item.notes}`;
	notesValRow.appendChild(notesValCol);

	// now we return the elements we'll need to access later as an object to
	// map to the item key in _DOM

	return {
		'root': root,
		'header': header,
		'btn0': btn0,
		'btn1': btn1,
		'btn2': btn2,
		'btn3': btn3,
		'acBtn': acBtn,
		'title': title,
		'qty': qty,
		'card': card,
		'img': imgTag,
		'btn1Label': btn1Label,
		'loc': locVal,
		'price': priceVal,
		'url': urlVal,
		'purBy': purByVal,
		'interval': intervalVal,
		'last': lastVal,
		'notes': notesValCol
	};
}
