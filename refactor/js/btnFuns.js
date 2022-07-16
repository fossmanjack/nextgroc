// Button 0: checkItem and toggleListed

const checkItem = item => {
	item.state = !item.state;
	styleHeader(item);
	saveLists();
}

const toggleListed = item => {
	(!item.state || item.state === itemBought) ? item.state = itemUnlisted : item.state = itemListed;
	styleHeader(item);
	saveLists();
}

// Button 1: toggleStaple and editPhoto

const toggleStaple = item => {
	const { btn1 } = _DOM.get(item);

	if(item.staple) {
		item.staple = false;
		btn1.classList.remove('fa-toggle-on');
		btn1.classList.add('fa-toggle-off');
	} else {
		item.staple = true;
		btn1.classList.remove('fa-toggle-off');
		btn1.classList.add('fa-toggle-on');
	}
	ob.modifyDate = Date.now();
	saveLists();
}

const editPhoto = item => {
	/* nyi */
	return false;
}

// Button 2: editItem and commitEdit

const editItem = item => {
	const { btn1, btn2, btn3, acBtn } = _DOM.get(item);
	const validator = /[a-zA-Z0-9\!@#&()\-+=_\/:; ]/;

	acBtn.setAttribute('data-bs-toggle', ''); // turn off accordion button

	// btn1 becomes "add picture"

	/* nyi */

	// btn2 becomes "commit changes"

	btn2.classList.remove('btn-primary', 'fa-pencil');
	btn2.classList.add('btn-success', 'fa-check');
	item.btnFuns[2] = commitEdit;

	// btn3 becomes "cancel changes"

	btn3.classList.remove('btn-warning', 'fa-broom');
	btn3.classList.add('btn-danger', 'fa-xmark');
	item.btnFuns[3] = cancelEdit;

	// add edit properties and outlines to all data-edit-target elements

	Object.values(_DOM.get(item)).forEach((el) => {
		if(el.hasAttribute('data-edit-target')) {
			el.contentEditable = true;
			el.classList.add('edit-target');
			el.addEventListener('beforeinput', el.validateInput = function validateInput(e) {
				debug && console.log(`Key: ${e.data}, Type: ${e.inputType}`);
				if(e.inputType !== 'deleteContentBackward' && !validator.test(e.data)) {
					e.preventDefault();
					alert('Valid characters for input are A-Z, a-z, 0-9, !@#&-+=_ and space');
				}
			});
		};
	});
}

const commitEdit = item => {
	const { btn1, btn2, btn3, acBtn } = _DOM.get(item);

	acBtn.setAttribute('data-bs-toggle', 'collapse'); // turn on accordion button

	// btn1 becomes "toggleStaple"

	/* nyi */

	// btn2 becomes "edit item"

	btn2.classList.remove('btn-success', 'fa-check');
	btn2.classList.add('btn-primary', 'fa-pencil');
	item.btnFuns[2] = editItem;

	// btn3 becomes "sweep item"

	btn3.classList.remove('btn-danger', 'fa-xmark');
	btn3.classList.add('btn-warning', 'fa-broom');
	item.btnFuns[3] = sweepItem;

	Object.entries(_DOM.get(item)).forEach((entry) => {
		const [ key, el ] = entry;

		if(el.hasAttribute('data-edit-target')) {
			el.contentEditable = false;
			el.classList.remove('edit-target');
			el.removeEventListener('beforeinput', validateInput);
			!el.textContent && el.textContent = '-';
			item[key] = el.textContent;
		}
	});
	item.modifyDate = Date.now();
	saveLists();
}

// Button 3: sweepItem and cancelEdit

const cancelEdit = item => {
	const { btn1, btn2, btn3, acBtn } = _DOM.get(item);

	acBtn.setAttribute('data-bs-toggle', 'collapse');

	// btn1 becomes "toggleStaple"

	/* nyi */

	// btn2 becomes "edit item"

	btn2.classList.remove('btn-success', 'fa-check');
	btn2.classList.add('btn-primary', 'fa-pencil');
	item.btnFuns[2] = editItem;

	// btn3 becomes "sweep item"

	btn3.classList.remove('btn-danger', 'fa-xmark');
	btn3.classList.add('btn-warning', 'fa-broom');
	item.btnFuns[3] = sweepItem;

	Object.entries(_DOM.get(item)).forEach((entry) => {
		const [ key, el ] = entry;

		if(el.hasAttribute('data-edit-target')) {
			el.contentEditable = false;
			el.classList.remove('edit-target');
			el.removeEventListener('beforeinput', validateInput);
			el.textContent = item[key];
		}
	});
}

const sweepItem = item => {
	item.state === 1 && updateHistory(item);
	item.state = 2;
	saveLists();
	renderList();
}

// Button X: sweepList and ???

// Button Y: toggleView

const toggleMode = _ => { // toggle between list and pantry modes
	const { mode, title, btnX, btnY, list, root } = _State;

	if(mode === modeList) { // switch to pantry view
		btnX.classList.remove('fa-broom');
		btnX.classList.add('fa-plus');
		_State = updateState('funs', { ..._State.funs, 'btnX': addStaples });
		btnY.classList.remove('fa-bookmark');
		btnY.classList.add('fa-list');
		title.textContent = `${list.listName}: Pantry`;
		_State = updateState('mode', modePantry);
	} else {
		btnX.classList.remove('fa-plus');
		btnX.classList.add('fa-broom');
		_State = updateState('funs', { ..._State.funs, 'btnX': sweepList });
		btnY.classList.remove('fa-list');
		btnY.classList.add('fa-bookmark');
		title.textContent = `${list.listName}: List`;
		_State = updateState('mode', modeList);
	}
	renderList();
}
