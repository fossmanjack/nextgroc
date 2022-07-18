/***** _State management *****/

class State {
	constructor( {
		mode = modeList,
		list = null,
		options = {},
	} ) {
		this.mode = mode;
		this.list = list;
		this.options = Object.keys(options).length ? options : { sortOrder: [ 'title', true ] };
		this.funs = {
			inputFieldBlur: addItem,
			inputFieldCheck: validateItemInput,
			btnY: toggleMode
		};
		this.funs.btnX = this.mode === modeList ? sweepList : addStaples;
	}
}

const updateState = (prop, val) => { // immutably update and save state object
	_History.push(_State);
	_State = { ..._State, [prop]: val };
	debug && debugMsg('updateState', [ _State, prop, val ]);
	saveState();
}

const saveState = _ => {
	debug && console.log('Saving state with _State', _State);
	window.localStorage.setItem("_State", JSON.stringify(_State));
}
