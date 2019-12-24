const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inputFilename = path.resolve(__dirname, parseInt(path.basename(process.argv[1], '.js')) + '.txt');
const input = fs.readFileSync(inputFilename, 'utf-8').trim();

function run(input, iterations) {
	input = input.split('\n').map(line => line.split(''));
	input[2][2] = '?';

	const emptyLayer = '.....\n.....\n..?..\n.....\n.....'
		.split('\n').map(line => line.split(''));

	let map = new Map([
		[0, input]
	]);

	for (let i = 0; i < iterations; ++i) {
		map.set(i + 1, emptyLayer);
		map.set(-i - 1, emptyLayer);
		map = iterate(map);
	}

	return [...map.values()].map(layer =>
		layer.map(line => line.join('')).join('')
	)
		.join('')
		.split('#')
		.length - 1;
}

function iterate(map) {
	const newMap = new Map();
	for (let [z, layer] of map) {
		newMap.set(z, layer.map((line, y) => line.map((c, x) => {
			if (c === '?') {
				return '?';
			}

			const neighbors = countNeighbors(map, x, y, z);
			if (c === '#') {
				return (neighbors === 1) ? '#' : '.';
			} else {
				return (neighbors === 1 || neighbors === 2) ? '#' : '.';
			}
		})));
	}
	return newMap;
}

const neighbors = Array(5).fill().map((_, y) => (
	Array(5).fill().map((_, x) => {
		const n = [];

		if (x > 0 && !(x === 3 && y === 2)) {
			n.push([x - 1, y, 0]);
		}
		if (x < 4 && !(x === 1 && y === 2)) {
			n.push([x + 1, y, 0]);
		}
		if (y > 0 && !(x === 2 && y === 3)) {
			n.push([x, y - 1, 0]);
		}
		if (y < 4 && !(x === 2 && y === 1)) {
			n.push([x, y + 1, 0]);
		}

		if (x === 0) {
			n.push([1, 2, -1]);
		}

		if (x === 4) {
			n.push([3, 2, -1]);
		}

		if (y === 0) {
			n.push([2, 1, -1]);
		}

		if (y === 4) {
			n.push([2, 3, -1]);
		}

		if (x === 3 && y === 2) {
			n.push([4, 0, 1], [4, 1, 1], [4, 2, 1], [4, 3, 1], [4, 4, 1]);
		}

		if (x === 1 && y === 2) {
			n.push([0, 0, 1], [0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]);
		}

		if (x === 2 && y === 3) {
			n.push([0, 4, 1], [1, 4, 1], [2, 4, 1], [3, 4, 1], [4, 4, 1]);
		}

		if (x === 2 && y === 1) {
			n.push([0, 0, 1], [1, 0, 1], [2, 0, 1], [3, 0, 1], [4, 0, 1]);
		}

		return n;
	})
));

function countNeighbors(map, x, y, z) {
	let result = 0;
	for (let n of neighbors[y][x]) {
		const layer = map.get(z + n[2]);
		if (layer) {
			const c = layer[n[1]][n[0]];
			if (c === '#') ++result;
		}
	}
	return result;
}

console.log(run(input, 200));
