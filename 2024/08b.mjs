import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`), 34
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const frequencies = new Set(input.flat());
	frequencies.delete('.');

	let locations = new Set();

	for (let frequency of frequencies) {
		const antennas = L.findAllIndices2d(input, x => x === frequency);
		for (let i = 0; i < antennas.length; ++i) {
			for (let j = i + 1; j < antennas.length; ++j) {
				let dy = antennas[i][0] - antennas[j][0];
				let dx = antennas[i][1] - antennas[j][1];

				const gcd = L.gcd(dy, dx);
				dy /= gcd;
				dx /= gcd;

				for (let n = 0; ; ++n) {
					const y = antennas[i][0] + n * dy;
					const x = antennas[i][1] + n * dx;
					if (L.inBounds(input, y, x)) {
						locations.add(`${y},${x}`);
					} else {
						break;
					};
				}

				for (let n = -1; ; --n) {
					const y = antennas[i][0] + n * dy;
					const x = antennas[i][1] + n * dx;
					if (L.inBounds(input, y, x)) {
						locations.add(`${y},${x}`);
					} else {
						break;
					};
				}
			}
		}
	}

	return locations.size;
}

function parseInput(str) {
	return L.autoparse(str);
}
