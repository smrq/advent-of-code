import { getRawInput, runTests, orthodiagonalOffsets, cell2d, flatten } from '../lib.mjs';

const rawInput = getRawInput();
const input = parseInput(rawInput);

runTests(args => run(args), [
parseInput(`L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`),
26
]);

console.log(run(input));

function run(input) {
	input = cell2d({
		grid: input,
		neighbors: (grid, x, y) => {
			function inBounds(x, y) { return x >= 0 && y >= 0 && x < grid[0].length && y < grid.length; }
			const result = [];
			for (let [dx, dy] of orthodiagonalOffsets(2)) {
				for (let xx = x+dx, yy = y+dy; inBounds(xx, yy); xx += dx, yy += dy) {
					if (grid[yy][xx] === 'L' || grid[yy][xx] === '#') {
						result.push(grid[yy][xx]); break;
					}
				}
			}
			return result;
		},
		rule: (current, neighbors) => {
			if (current === 'L' && !neighbors.some(n => n === '#')) return '#';
			if (current === '#' && neighbors.filter(n => n === '#').length >= 5) return 'L';
			return current;
		}
	});
	return flatten(input).filter(x => x === '#').length;
}

function parseInput(str) {
	return str.split('\n').map(line => {
		return line.split('');
	});
}


