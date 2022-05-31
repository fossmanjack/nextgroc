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

function generateList(root, _List) {
	let ul = document.createElement('ul');
	let li;
	const needed = _List.getNeeded();

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
	// <button class="btn" type="button" id="item0check"><span class="fa fa-square-o" id="item0checkbox" />

	let btn = document.createElement('button');
	btn.classList.add('btn');
	btn.type = 'button';
	btn.id = `item${ind}check`;
	root.appendChild(btn);

	let checkBox = document.createElement('span');
	checkBox.classList.add('fa');
	el.bought ? checkBox.classList.add('fa-check-square') : checkBox.classList.add('fa-square-o');
	checkBox.id = `item${ind}check`;
	btn.appendChild(checkBox);
	btn.addEventListener("click", function() { checkItem(ind, el) } );

	//let disp = `${el.itemName}\t${el.qty}`;
	let disp = document.createElement('span');
	disp.id = `item${ind}`;
	el.bought ? disp.style.textDecoration = "line-through" : null;
	disp.appendChild(document.createTextNode(`${el.itemName}\t${el.qty}`));
	root.appendChild(disp);
}

function checkItem(ind, el) {
	if(el.bought) { // toggle everything to un-bought
		document.getElementById(`item${ind}`).style.textDecoration = ""; // remove strikethrough
		document.getElementById(`item${ind}check`).classList.remove('fa-check-square');
		document.getElementById(`item${ind}check`).classList.add('fa-square-o');
		el.bought = false;
	} else { // toggle everything to bought
		document.getElementById(`item${ind}`).style.textDecoration = "line-through";
		document.getElementById(`item${ind}check`).classList.add('fa-check-square');
		document.getElementById(`item${ind}check`).classList.remove('fa-square-o');
		el.bought = true;
	}
}
