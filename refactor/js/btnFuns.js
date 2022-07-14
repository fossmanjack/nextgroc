
const checkItem(ob) {
	const { btn0, title } = _Els.get(item);
	//debug ? debugMsg("checkItem", [ ob, _State.get('mode') ]) : null;
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

	//debugMsg("toggleStaple", [ btn1, ob.staple ]);
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
			el.removeEventListener('beforeinput', el.validateInput);
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
