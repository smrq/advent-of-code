import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`.....0.
..4321.
..5..2.
..6543.
..7..4.
..8765.
..9....`), 3,

	parseInput(`89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`), 81
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let current = L.findAllIndices2d(input, x => x === 9);
	const ratingMap = new L.InfiniteGrid(2);
	for (let [y, x] of current) {
		ratingMap.set([y, x], 1);
	}

	for (let elevation = 8; elevation >= 0; --elevation) {
		let next = new Set();
		for (let [y, x] of current) {
			for (let [dy, dx] of L.orthogonalOffsets(2)) {
				if (L.inBounds(input, y + dy, x + dx) && input[y + dy][x + dx] === elevation) {
					next.add(`${y + dy},${x + dx}`);
					ratingMap.set([y+dy, x+dx], (ratingMap.get([y+dy, x+dx]) ?? 0) + ratingMap.get([y, x]));
				}
			}
		}
		current = [...next].map(str => str.split(',').map(x => parseInt(x, 10)));
	}

	return L.sum(current.map(([y, x]) => ratingMap.get([y, x])));
}

function parseInput(str) {
	return str.trim().split('\n').map(line => line.split('').map(n => parseInt(n, 10)));
}
