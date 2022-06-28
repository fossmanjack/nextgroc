const addStaples = m => {
	m.get('list').items.filter((item) => item.staple).forEach((item) => {
		item.setState(item, 0);
		item.styleHeader(item, m.get('mode'));
	});
	m.get('mode') === 'list' ?
		m.get('list').getListView(m.get('list'), m.get('root')) :
		m.get('list').getLibraryView(m.get('list'), m.get('root'));
}
