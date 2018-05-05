/*Detect how many zeros to show*/
export const leftPad = (width, n) => {
	if ((n + '').length > width) {
		return n;
	}
	const padding = new Array(width).join('0');
	return (padding + n).slice(-width);
};

export const date = (time) => {
	let today = new Date(time),
		dd = today.getDate(),
		mm = today.getMonth() + 1, //January is 0!
		yyyy = today.getFullYear();
	if (dd < 10) {
		dd = '0' + dd
	}
	if (mm < 10) {
		mm = '0' + mm
	}
	return mm + '/' + dd + '/' + yyyy;
};

