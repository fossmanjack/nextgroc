const validateItemInput = (e, m) => {
	const { inputField } = Object.fromEntries(m);
	debug ? debugMsg('e.data and e.inputType', [ e.data, e.inputType ]) : null;
	validator = /[^<>?\/\\]/

	if(!validator.test(e.data)) {
		e.preventDefault();
		alert("Invalid characters: <>?\\\/");
	}
	if(e.inputType === 'insertLineBreak')
	{
		debug ? debugMsg('validateItemInput', [ e.inputType ]) : null;
		inputField.blur;
	}
}
