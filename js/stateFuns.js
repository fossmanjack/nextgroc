/***** _State management *****/

const initState = _ => { // create and return a state object
	const st = {
		mode: modeList,
		list: null,
		root: document.getElementById('list-root'),
		title: document.getElementById('list-title'),
		inputField: document.getElementById('inputField'),
		btnX: document.getElementById('btnX'),
		btnY: document.getElementById('btnY'),
		funs: {
			inputFieldBlur: addItem,
			inputFieldCheck: validateItemInput,
			btnX: sweepList,
			btnY: toggleMode
		},
		options: {
			sortOrder: [ 'title', true ] // make this more bitwise
		}
	};
	window.localStorage.setItem("_State", JSON.stringify(st));
	return st;
}

const updateState = (prop, val) => { // immutably update and save state object
	const newState = { ..._State, prop: val };
	window.localStorage.setItem("_State", JSON.stringify(newState));
	_History.push(_State);
	_State = newState;
}
