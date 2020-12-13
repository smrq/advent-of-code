import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('16.txt', 'utf-8').trim();
const tests = [];

async function run(input) {
	const skip = +input.slice(0, 7);

	let list = input.split('').map(x => +x);
	list = [].concat(...Array(10000).fill(list)).slice(skip);

	for (let phase = 0; phase < 100; ++phase) {
		let sum = 0;
		for (let x = list.length - 1; x >= 0; --x) {
			sum += list[x];
			list[x] = sum % 10;
		}
	}

	return list.slice(0, 8).join('');
}

(async function () {
	for (let [input, output] of tests) {
		assert.deepEqual(await run(input), output);
	}
	console.log(await run(input));
})();
