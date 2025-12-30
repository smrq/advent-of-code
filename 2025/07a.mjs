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
...............`), 21
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let beams = new Set([input[0].indexOf('S')]);
	let splits = 0;

	for (let row of input.slice(1)) {
		const next = new Set();
		for (let beam of beams) {
			if (row[beam] === '^') {
				next.add(beam - 1);
				next.add(beam + 1);
				++splits;
			} else {
				next.add(beam);
			}
		}
		beams = next;
	}

	return splits;
}

function parseInput(str) {
	return L.autoparse(str);
}

