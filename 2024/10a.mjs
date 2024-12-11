import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`), 36
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const trailheads = L.findAllIndices2d(input, x => x === 0);
	return L.sum(trailheads.map(trailhead => {
		let current = [trailhead];
		for (let elevation = 1; elevation <= 9; ++elevation) {
			let next = new Set();
			for (let [y, x] of current) {
				for (let [dy, dx] of L.orthogonalOffsets(2)) {
					if (L.inBounds(input, y + dy, x + dx) && input[y + dy][x + dx] === elevation) {
						next.add(`${y + dy},${x + dx}`);
					}
				}
			}
			current = [...next].map(str => str.split(',').map(x => parseInt(x, 10)));
		}
		return current.length;
	}));
}

function parseInput(str) {
	return str.trim().split('\n').map(line => line.split('').map(n => parseInt(n, 10)));
}
