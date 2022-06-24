const sweepList = m => {
	m.get('list').items.filter((item) => item.state === 1)
		.forEach((item) => {
			item.setState(item, 2);
			item.styleHeader(item, m.get('mode'));
		});
	m.get('mode') === 'list' ?
		m.get('list').getListView(m.get('list'), m.get('list').docRoot) :
		m.get('list').getLibraryView(m.get('list'), m.get('list').docRoot);
}

/*
		document.getElementById('sweepButton').addEventListener('click', () => {
			_TestList.items.filter((item) => item.state === 1)
				.forEach((item) => item.setState(item, 2));
			document.getElementById('toggleButton').getAttribute('data-state') === 'list' ?
				_TestList.getListView(_TestList, _TestList.docRoot) :
				_TestList.getLibraryView(_TestList, _TestList.docRoot);
		});
*/
