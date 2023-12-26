import * as L from '../lib.mjs';

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const cuts = [
		['lxt', 'lsv'],
		['xvh', 'dhn'],
		['qmr', 'ptj'],
	];
	for (let [src, dests] of input) {
		for (let [a, b] of cuts) {
			if (src === a && dests.includes(b)) {
				dests.splice(dests.indexOf(b), 1);
			}
			if (src === b && dests.includes(a)) {
				dests.splice(dests.indexOf(a), 1);
			}
		}
	}

	const graph = new Map(input);
	for (let [src, dests] of input) {
		for (let dest of dests) {
			if (!graph.has(dest)) {
				graph.set(dest, []);
			}
			graph.get(dest).push(src);
		}
	}

	let partition = new Set();
	let working = [input[0][0]];
	while (working.length) {
		const key = working.shift();
		if (!graph.has(key)) continue;

		const neighbors = graph.get(key);
		graph.delete(key);
		partition.add(key);
		working.push(...neighbors);
	}

	return graph.size * partition.size;
}

function parseInput(str) {
	return str.trim().split('\n').map(line => {
		let [src, dests] = line.split(': ');
		dests = dests.split(' ');
		return [src, dests];
	});
}
