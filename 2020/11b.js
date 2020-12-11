const { getRawInput, runTests, cell2d, flatten } = require('../lib');

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
		neighborCoords: (x, y, grid) => {
			const result = [];
			function inBounds(x, y) { return x >= 0 && y >= 0 && x < grid[0].length && y < grid.length; }
			for (let xx = x-1, yy = y-1; inBounds(xx, yy); --xx, --yy) {
				if (grid[yy][xx] === 'L' || grid[yy][xx] === '#') {
					result.push([xx, yy]); break;
				}
			}
			for (let xx = x-1, yy = y; inBounds(xx, yy); --xx) {
				if (grid[yy][xx] === 'L' || grid[yy][xx] === '#') {
					result.push([xx, yy]); break;
				}
			}
			for (let xx = x-1, yy = y+1; inBounds(xx, yy); --xx, ++yy) {
				if (grid[yy][xx] === 'L' || grid[yy][xx] === '#') {
					result.push([xx, yy]); break;
				}
			}
			for (let xx = x, yy = y-1; inBounds(xx, yy); --yy) {
				if (grid[yy][xx] === 'L' || grid[yy][xx] === '#') {
					result.push([xx, yy]); break;
				}
			}
			for (let xx = x, yy = y+1; inBounds(xx, yy); ++yy) {
				if (grid[yy][xx] === 'L' || grid[yy][xx] === '#') {
					result.push([xx, yy]); break;
				}
			}
			for (let xx = x+1, yy = y-1; inBounds(xx, yy); ++xx, --yy) {
				if (grid[yy][xx] === 'L' || grid[yy][xx] === '#') {
					result.push([xx, yy]); break;
				}
			}
			for (let xx = x+1, yy = y; inBounds(xx, yy); ++xx) {
				if (grid[yy][xx] === 'L' || grid[yy][xx] === '#') {
					result.push([xx, yy]); break;
				}
			}
			for (let xx = x+1, yy = y+1; inBounds(xx, yy); ++xx, ++yy) {
				if (grid[yy][xx] === 'L' || grid[yy][xx] === '#') {
					result.push([xx, yy]); break;
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


