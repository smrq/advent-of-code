const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('16.txt', 'utf-8').trim();
const tests = [
	['80871224585914546619083218645595', '24176176'],
	['19617804207202209144916044189917', '73745418'],
	['69317163492948606335995924319873', '52432133'],
];

async function run(input) {
	let list = input.split('').map(x => +x);

	for (let phase = 0; phase < 100; ++phase) {
		const newList = [];

		for (let x = 0; x < list.length; ++x) {
			const pattern = makePattern(x);
			const value = list.map((n, i) => n * pattern[(i + 1) % pattern.length])
				.reduce((a, b) => a + b);
			newList.push(Math.abs(value) % 10);
		}

		list = newList;
	}

	return list.join('').slice(0, 8);
}

function makePattern(x) {
	return [
		...Array(x+1).fill(0),
		...Array(x+1).fill(1),
		...Array(x+1).fill(0),
		...Array(x+1).fill(-1)
	];
}

(async function () {
	for (let [input, output] of tests) {
		assert.deepEqual(await run(input), output);
	}
	console.log(await run(input));
})();
