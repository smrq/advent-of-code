import assert from 'assert';
import * as L from '../lib.mjs';

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const starts = [...input.map.keys()].filter(location => location.endsWith('A'));
	const cycles = starts.map(start => {
		const path = [];
		const seen = new Map();
		let location = start;
		let phase = 0;

		while (!seen.has(`${location}-${phase}`)) {
			seen.set(`${location}-${phase}`, path.length);
			path.push(location);

			const direction = input.dirs[phase];

			location = input.map.get(location)[direction];
			phase = (phase + 1) % input.dirs.length;
		}

		const cycleStart = seen.get(`${location}-${phase}`);
		const cycleLength = path.length - cycleStart;

		// Unstated but true constraint on the input:
		// Every path reaches end points only at exact multiples of the path's cycle length
		assert(path.filter(location => location.endsWith('Z')).length === 1);
		assert(path.findIndex(location => location.endsWith('Z')) === cycleLength);

		return cycleLength;
	});

	return L.lcm(...cycles);
}

function parseInput(str) {
	let [dirs, mapLines] = str.trim().split('\n\n');
	let map = mapLines.split('\n').reduce((map, line) => {
		let [, node, L, R] = /(\w+) = \((\w+), (\w+)\)/.exec(line);
		map.set(node, { L, R });
		return map;
	}, new Map());
	return { dirs, map };
}
