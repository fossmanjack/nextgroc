//function arrToUl(root, arr) {
//  var ul = document.createElement('ul');
//  var li;
//
//  root.appendChild(ul); // append the created ul to the root
//
//  arr.forEach(function(item) {
//    if (Array.isArray(item)) { // if it's an array
//      arrToUl(li, item); // call arrToUl with the li as the root
//      return;
//    }
//
//    li = document.createElement('li'); // create a new list item
//    li.appendChild(document.createTextNode(item)); // append the text to the li
//    ul.appendChild(li); // append the list item to the ul
//  });
//}

//var div = document.getElementById('myList');

//arrToUl(div, myArray);

//const checkBox = id => { document.createElement('span').class = "fa fa-square-o"; }
//import { debugMsg } from './debug.mjs';
/*j
let debugMsg = (fun, params) => {
	console.log("****** DEBUG ******");
	console.log(`Calling function ${fun} with:`);
	for(i in params) {
		console.log("\t", params[i]);
	}
	console.log("*******************");
}

let debug = true;
*/

const _Index = new Map();

function generateList(root, _List) {
	let ul = document.createElement('ul');
	let li;
	const needed = _List.getNeeded();
//	const _Index = new Map();

	root.textContent = '';

	root.appendChild(ul); // append the created ul to the root element
/*
	for(i in needed) {
		let disp = `${needed[i].itemName}\t${needed[i].qty}`;
		let tag = `item${i}`;

		li = document.createElement('li'); 				// create new list item
		li.id = tag; 									// tag it
		li.appendChild(document.createTextNode(disp)); 	// append text to li
		ul.appendChild(li);								// append list item to ul
	}
*/
// consider you might not need to care about the indices
// you can use the itemname as the ID, right?  munge it a bit to remove spaces and whatnot?
//	needed.forEach(function() {

	for(i in needed) {
		let li = document.createElement('li');
		generateListElement(li, i, needed[i]);
		ul.appendChild(li);
	}
}


function generateListElement(root, ind, el) {
	// make the button first
	// root - the <li> attached to the <ul>
	// ind - the index of the listItem
	// el - the listItem we're working on

	const idStr = el.getCamelName();
	_Index.set(idStr, el);
	let btn = document.createElement('button');
	btn.classList.add('btn');
	btn.type = 'button';
	btn.id = `${idStr}-checkbox-btn`;
	root.appendChild(btn);

	let checkBox = document.createElement('span');
	checkBox.classList.add('fa');
	el.bought ? checkBox.classList.add('fa-check-square') : checkBox.classList.add('fa-square-o');
	checkBox.id = `${idStr}-checkbox`;
	btn.appendChild(checkBox);
	btn.addEventListener("click", function() { checkItem(ind, el) } );

/*
	//let disp = `${el.itemName}\t${el.qty}`;
	let disp = document.createElement('span');
	disp.id = `item${ind}`;
	el.bought ? disp.style.textDecoration = "line-through" : null;
	disp.appendChild(document.createTextNode(`${el.itemName}\t${el.qty}`));
	//disp.addEventListener("click", function() { editItemText(disp, el) });
	disp.contentEditable = true;
	disp.addEventListener('blur', function() { commitItemText(disp, el); });
	disp.addEventListener('beforeinput', function(e) {
		debug ? debugMsg('input', [ disp, e, e.keyCode ]) : null;
		if(e.inputType === 'insertParagraph') {
			disp.blur();
			e.preventDefault();
		}
	});
	debug ? disp.addEventListener('input', function(e) {
		debugMsg('input', [ e ]);
	}) : null;
	root.appendChild(disp);
*/

	// let's make two spans, one for name and one for qty

	let itemName = document.createElement('span');
	itemName.id = `${idStr}-itemName`;
	itemName.setAttribute("data-field", "itemName");
	itemName.setAttribute("data-parent", idStr);
	itemName.contentEditable = true;
	el.bought ? itemName.style.textDecoration = "line-through" : null;
	itemName.appendChild(document.createTextNode(`${el.itemName}`));
	root.appendChild(itemName);

	let qty = document.createElement('span');
	qty.id = `${idStr}-qty`;
	qty.setAttribute("data-field", "qty");
	qty.setAttribute("data-parent", idStr);
	qty.contentEditable = true;
	qty.appendChild(document.createTextNode(`${el.qty}`));
	qty.style.marginLeft = "15px";
	root.appendChild(qty);
/*
	// item name and quantity contained within one span
	let disp = document.createElement('span');
	disp.id = `item${ind}`;
	el.bought ? disp.style.textDecoration = "line-through" : null;

	// item name span
	let nameSpan = document.createElement('span');
	nameSpan.id = `item${ind}name-span`;
	let itemText = document.createTextNode(`${el.itemName}`);
	itemText.id = `item${ind}text`;
	nameSpan.appendChild(itemText);
	nameSpan.addEventListener("click", function() {  editItemText(nameSpan, el) });

	// item quantity span
	let qtySpan = document.createElement('span');
	qtySpan.id = `item${ind}qty-span`;
	let itemQty = document.createTextNode(`${el.qty}`);
	itemQty.id = `item${ind}qty`;
	// itemQty.addEventListener("click", editItemText()); // let's get the first one working
	qtySpan.appendChild(itemQty);

	// put them together
	// They each need to be in their own span
	disp.appendChild(nameSpan);
	disp.appendChild(qtySpan);
	root.appendChild(disp);
*/
}

function checkItem(ind, el) {
	// ind - the index of the listItem
	// el - the listItem
	const idStr = el.getCamelName();
	const checkBox = document.getElementById(`${idStr}-checkbox`);
	if(el.bought) { // toggle everything to un-bought
		document.getElementById(`${idStr}-itemName`).style.textDecoration = ""; // remove strikethrough
		checkBox.classList.remove('fa-check-square');
		checkBox.classList.add('fa-square-o');
		el.setState("needed");
	} else { // toggle everything to bought
		document.getElementById(`${idStr}-itemName`).style.textDecoration = "line-through";
		checkBox.classList.add('fa-check-square');
		checkBox.classList.remove('fa-square-o');
		el.setState("bought");
	}
}

function editItemText(span, el) {
	// el = the span containing the text element to be edited
//	debug ? debugMsg("editItemText", [ span, el ]) : null;
//	alert("editItemText!");
	// tob = span.firstChild; // text element
	// tob = span.textContent;
///* until we get the thing working don't even do anything
	console.log(span.children);
	console.log(span.textContent);
	ibox = document.createElement('input');
	ibox.type = 'text';
	ibox.name = 'text';
	ibox.value = span.textContent;
	console.log(ibox);
	span.appendChild = ibox;
	ibox.addEventListener('keypress', function(e) {
		if(e.keyCode === 13) {
			el.setName(ibox.value);
			span.textContent = el.itemName;
			span.removeChild(ibox);
		}
	});



	//
	// <input type="text" name="text" id="item-input">
	//		inputField.addEventListener('keypress', function(e) {
	//			if(e.keyCode === 13) {
	//				tryAddItem(inputField.value, tar, testList);
	//			}
//*/
}

function commitItemText(span, el) {
	input = span.textContent;
	//el.setName(input) ? return true : { span.textContent = el.itemName; return false; };
	if(el.setName(input)) {
		return true;
	} else {
		span.textContent = el.itemName;
		return false;
	}
}

function commitFieldEdit(span) {
	let input = span.textContent;
	const ob = _Index.get(span.getAttribute("data-parent"));

	debug ? debugMsg('commitFieldEdit', [ span, span.getAttribute("data-field") ]) : null;

	if(ob.setProp(span.getAttribute("data-field"), input)) {
		return true;
	} else {
		span.textContent = ob[span.getAttribute("data-field")];
		return false;
	}
}

