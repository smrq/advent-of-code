const fs = require('fs');
const ids = fs.readFileSync('02.txt', 'utf-8')
	.trim()
	.split('\n');

console.log(solve(ids));

function solve(ids) {
	for (let i = 0; i < ids.length; ++i) {
		for (let j = i + 1; j < ids.length; ++j) {
			const [same, diffCount] = diff(ids[i], ids[j]);
			if (diffCount === 1) {
				return same;
			}
		}
	}
}

function diff(a, b) {
	let same = '', diffCount = 0;
	for (let i = 0; i < a.length; ++i) {
		if (a[i] === b[i]) {
			same += a[i];
		} else {
			++diffCount;
		}
	}

	return [same, diffCount];
}