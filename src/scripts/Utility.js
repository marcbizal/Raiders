export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

export function zerofill(num, size) {
	var s = num+"";
	while (s.length < size) s = "0" + s;
	return s;
}

export function mergeObjects() {
	var ret = {};
	for (var i = 0; i < arguments.length; i++) {
		var obj = arguments[i];
		for (var property in obj) {
			ret[property] = obj[property];
		}
	}
	return ret;
}

export function iterateProperties(object, func) {
	for (var property in object) {
		if (object.hasOwnProperty(property)) {
			func(object[property]);
		}
	}
}
