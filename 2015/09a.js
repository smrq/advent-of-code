const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inputFilename = path.resolve(__dirname,
	path.basename(process.argv[1], '.js').replace(/\D+$/, '') + '.txt');
const input = fs.readFileSync(inputFilename, 'utf-8').trim();

function parseInput(input) {
	const distances = {};

	for (let line of input.split('\n')) {
		const [a, _1, b, _2, dist] = line.split(' ');
		distances[a] = distances[a] || {};
		distances[b] = distances[b] || {};
		distances[a][b] = +dist;
		distances[b][a] = +dist;
	}

	return distances;
}

function tsp(distances) {
	const cities = Object.keys(distances);

	let min = Infinity;
	for (let path of permutations(cities)) {
		const s = score(distances, path);
		if (s < min) {
			min = s;
		}
	}

	return min;
}

function score(distances, path) {
	let result = 0;
	for (let i = 0; i < path.length - 1; ++i) {
		result += distances[path[i]][path[i + 1]];
	}
	return result;
}

function *permutations(arr) {
	if (arr.length === 1) yield arr;
	for (let k = 0; k < arr.length; ++k) {
		for (let p of permutations([
			...arr.slice(0, k),
			...arr.slice(k+1)
		])) {
			yield [arr[k], ...p];
		}
	}
}

function run(input) {
	const distances = parseInput(input);
	return tsp(distances);
}

console.log(run(input));
