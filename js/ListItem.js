/***** ListItem class definition *****/

class ListItem {
	constructor( {
		title,
		qty = 1,
		state = 0,
		loc = '-',
		price = '-',
		purBy = 0,
		url = '-',
		staple = false,
		interval = 0,
		history = [],
		images = [],
		notes = '...',
		creationDate = Date.now(),
		modifyDate = creationDate,
	} ) {
		this.title = sanitize(title) ? sanitize(title) : "New Item";
		this.qty = qty;
		this.loc = loc;
		this.price = price;
		this.purBy = purBy;
		this.url = url;
		this.staple = staple;
		this.interval = interval;
		this.history = history;
		this.images = images;
		this.notes = notes;
		this.creationDate = creationDate;
		this.modifyDate = modifyDate;
		this.state = (state < 3 ? state : 0);
		this.btnFuns = [ checkItem, toggleStaple, editItem, sweepItem ];
	}
}

/***** Item management functions *****/

const updateHistory = item => { // adds timestamp to item.history and updates item's 'last' DOM element
	item.history.unshift(Date.now());
	_DOM.get(item).last.textContent = parseDate(item.history[0]);
	saveLists();
}

const styleHeader = item => { // changes the title style and btn0 function based on state and mode
	const { btn0, title } = _DOM.get(item);
	const { state } = item;

	if(_State.mode === modePantry) {
		if(state !== itemUnlisted) { // listed -- no strikethrough, btn0 is red minus
			btn0.classList.remove('fa-regular', 'fa-square', 'fa-square-check', 'fa-plus', 'btn-success');
			btn0.classList.add('fa-solid', 'fa-minus', 'btn-danger');
			title.style.textDecoration = '';
		} else { // unlisted -- no strikethrough, btn0 is green plus
			btn0.classList.remove('fa-regular', 'fa-square-check', 'fa-square', 'btn-danger', 'fa-minus');
			btn0.classList.add('fa-solid', 'fa-plus', 'btn-success');
			title.style.textDecoration = '';
		}
	} else { // list view
		if(state === itemBought) { // bought -- strikethrough, btn0 is checked box
			btn0.classList.remove('fa-solid', 'fa-square', 'fa-plus', 'fa-minus', 'btn-danger', 'btn-success');
			btn0.classList.add('fa-regular', 'fa-square-check');
			title.style.textDecoration = 'line-through';
		} else { // for state 0 -- unchecked, btn0 is empty box; state 2 isn't shown
			btn0.classList.remove('fa-solid', 'fa-square-check', 'fa-plus', 'fa-minus', 'btn-danger', 'btn-success');
			btn0.classList.add('fa-regular', 'fa-square');
			title.style.textDecoration = '';
		}
	}
}

const initFuns = item => item.btnFuns = _State.mode === modeList ?
		[ checkItem, toggleStaple, editItem, sweepItem ] :
		[ toggleListed, toggleStaple, editItem, sweepItem ];

