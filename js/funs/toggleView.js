const toggleView = m => {
	const { mode, title, btnX, btnY, list, root } = Object.fromEntries(m);

	if(mode === 'list') { // switch to library view
		btnX.classList.remove('fa-broom');
		btnX.classList.add('fa-plus');
		m.get('funs')['btnX'] = addStaples;
		btnY.classList.remove('fa-bookmark');
		btnY.classList.add('fa-list');
		title.textContent = `${list.listName}: Library`;
		m.set('mode', 'library');
		list.getLibraryView(list, root);
	} else {
		btnX.classList.remove('fa-plus');
		btnX.classList.add('fa-broom');
		m.get('funs')['btnX'] = sweepList;
		btnY.classList.remove('fa-list');
		btnY.classList.add('fa-bookmark');
		title.textContent = `${list.listName}: List`;
		m.set('mode', 'list');
		list.getListView(list, root);
	}
}
/*
		document.getElementById('toggleButton').addEventListener('click', () => {
			title = document.getElementById('list-title');
			btnX = document.getElementById('toggleButton');
			state = btnX.getAttribute('data-state');

			if(state === "list") { // switch to library view
				btnX.setAttribute('data-state', 'library');
				btnX.classList.remove('fa-refrigerator');
				btnX.classList.add('fa-list');
				title.textContent = `${_TestList.listName}: Library`;
				_TestList.getLibraryView(_TestList, _TestList.docRoot);
			} else { // switch to list
				btnX.setAttribute('data-state', 'list');
				btnX.classList.remove('fa-list');
				btnX.classList.add('fa-bookmark');
				title.textContent = `${_TestList.listName}: List`;
				_TestList.getListView(_TestList, _TestList.docRoot);
			}
		});
*/
