import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`), 40
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let beams = new Map([[input[0].indexOf('S'), 1]]);

	for (let row of input.slice(1)) {
		const next = new Map();
		for (let [beam, count] of beams.entries()) {
			if (row[beam] === '^') {
				next.set(beam-1, (next.get(beam-1) || 0) + count);
				next.set(beam+1, (next.get(beam+1) || 0) + count);
			} else {
				next.set(beam, (next.get(beam) || 0) + count);
			}
		}
		beams = next;
	}

	return beams.values().reduce((a, b) => a + b);
}

function incrementMap(map, key, count) {
}

function parseInput(str) {
	return L.autoparse(str);
}

