import assert from 'assert';
import fs from 'fs';
const input = [16, fs.readFileSync('16.txt', 'utf-8').trim()];
const tests = [
	[[5, 's1,x3/4,pe/b'], 'baedc']
];

function run([count, input]) {
	const arr = Array.from({ length: count }).map((_, i) => String.fromCharCode(97+i));
	for (let instruction of input.split(',')) {
		let match;
		if (match = /s(\d+)/.exec(instruction)) {
			const items = arr.splice(-match[1], +match[1]);
			arr.splice(0, 0, ...items);
		} else if (match = /x(\d+)\/(\d+)/.exec(instruction)) {
			const tmp = arr[+match[1]];
			arr[+match[1]] = arr[+match[2]];
			arr[+match[2]] = tmp;
		} else if (match = /p(\w)\/(\w)/.exec(instruction)) {
			const i = arr.indexOf(match[1]);
			const j = arr.indexOf(match[2]);
			arr[i] = match[2];
			arr[j] = match[1];
		} else throw new Error(instruction);
	}
	return arr.join('');
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
