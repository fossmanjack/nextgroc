/***** _State management *****/

const initState = _ => { // create and return a state object
	if(JSON.parse(window.localStorage.getItem("_State"))) {
		debug && console.log("_State found in local storage!", JSON.parse(window.localStorage.getItem("_State")));
		return JSON.parse(window.localStorage.getItem("_State"));
	}

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
	debug && console.log("New _State generated!", st);
	window.localStorage.setItem("_State", JSON.stringify(st));
	return st;
}

const updateState = (prop, val) => { // immutably update and save state object
	_History.push(_State);
	_State = { ..._State, [prop]: val };
	saveState();
}

const saveState = _ => {
	debug && console.log('Saving state with _State', _State);
	window.localStorage.setItem("_State", JSON.stringify(_State));
}
