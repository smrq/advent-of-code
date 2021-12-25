import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>`), 58
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let state = input;
	for (let i = 1; ; ++i) {
		let next = stepSouth(stepEast(state));
		if (next === state) {
			return i;
		}
		state = next;
	}
}

function stepEast(state) {
	let grid = state.split('\n').map(x => x.split(''));
	let next = state.split('\n').map(x => x.split(''));

	for (let i = 0; i < grid.length; ++i) {
		for (let j = 0; j < grid[i].length; ++j) {
			if (grid[i][j] === '>' && grid[i][(j+1)%grid[i].length] === '.') {
				next[i][j] = '.';
				next[i][(j+1)%grid[i].length] = '>';
			}
		}
	}

	return next.map(x => x.join('')).join('\n');
}

function stepSouth(state) {
	let grid = state.split('\n').map(x => x.split(''));
	let next = state.split('\n').map(x => x.split(''));

	for (let i = 0; i < grid.length; ++i) {
		for (let j = 0; j < grid[i].length; ++j) {
			if (grid[i][j] === 'v' && grid[(i+1)%grid.length][j] === '.') {
				next[i][j] = '.';
				next[(i+1)%grid.length][j] = 'v';
			}
		}
	}

	return next.map(x => x.join('')).join('\n');
}

function parseInput(str) {
	return str.trim();
}
