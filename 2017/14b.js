const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('14.txt', 'utf-8').trim();
const tests = [
	['flqrgnkx', 1242]
];

function run(input) {
	const disk = [].concat(...Array.from({ length: 128 })
		.map((_, n) => knotHash(`${input}-${n}`))
		.map(hexStringToBinaryString)
		.map(binaryString => binaryString.split('')));
	const w = 128;

	let regionCount = 0;
	let start;
	while ((start = disk.indexOf('1')) !== -1) {
		const openSet = [start];
		while (openSet.length) {
			const current = openSet.pop();
			disk[current] = '0';
			for (let neighbor of neighbors(current)) {
				if (disk[neighbor] !== '1') continue;
				openSet.push(neighbor);
			}
		}
		++regionCount;
	}
	return regionCount;
}

function *neighbors(n) {
	if (n % 128 > 0) {
		yield n - 1;
	}
	if (n % 128 < 127) {
		yield n + 1;
	}
	if (n - 128 >= 0) {
		yield n - 128;
	}
	if (n + 128 < 128*128) {
		yield n + 128;
	}
}

function countOnes(disk) {
	return disk.filter(x => x === '1').length;
}

function hexStringToBinaryString(hexString) {
	return hexString.replace(/./g, x => parseInt(x, 16).toString(2).padStart(4, '0'));
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
