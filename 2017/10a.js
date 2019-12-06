const assert = require('assert');
const fs = require('fs');
const input = {
	size: 256,
	input: fs.readFileSync('10.txt', 'utf-8').trim()
};
const tests = [
	[{ size: 5, input: '3,4,1,5'}, 12]
];

function run({ size, input }) {
	input = input.split(',').map(x => +x);
	const data = Array.from({ length: size }).map((_, i) => i);

	let position = 0;
	let skip = 0;
	for (let n of input) {
		reverse(data, position, n);
		position = (position + n + skip) % size;
		++skip;
	}

	return data[0] * data[1];
}

function reverse(data, fromIndex, length) {
	let toIndex = (fromIndex + length - 1) % data.length;
	while (length > 1) {
		const tmp = data[fromIndex];
		data[fromIndex] = data[toIndex];
		data[toIndex] = tmp;
		fromIndex = (fromIndex + 1) % data.length;
		toIndex = (toIndex - 1 + data.length) % data.length;
		length -= 2;
	}
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
