import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('14.txt', 'utf-8').trim();
const tests = [
	['flqrgnkx', 8108]
];

function run(input) {
	let used = 0;
	for (let n = 0; n < 128; ++n) {
		const row = knotHash(`${input}-${n}`);
		used += countOnes(row);
	}
	return used;
}

function countOnes(hex) {
	const result = hex.split('')
		.map(c => [0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4][parseInt(c, 16)])
		.reduce((a, b) => a + b);
	return result;
}

function knotHash(string) {
	const sparseHash = calculateSparseHash(string);
	const denseHash = calculateDenseHash(sparseHash);
	return denseHash.map(n => n.toString(16).padStart(2, '0')).join('');

	function calculateSparseHash(input) {
		input = input.split('').map(x => x.charCodeAt(0));
		input = input.concat(17, 31, 73, 47, 23);
		const data = Array.from({ length: 256 }).map((_, i) => i);
		const state = { position: 0, skip: 0 };

		for (let i = 0; i < 64; ++i) {
			runRound(data, state, input);
		}

		return data;	
	}

	function calculateDenseHash(data) {
		const result = [];
		for (let i = 0; i < 256; i += 16) {
			let value = data[i];
			for (let j = 1; j < 16; ++j) {
				value ^= data[i+j];
			}
			result.push(value);
		}
		return result;
	}

	function runRound(data, state, input) {
		for (let n of input) {
			reverse(data, state.position, n);
			state.position = (state.position + n + state.skip) % data.length;
			++state.skip;
		}
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
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
