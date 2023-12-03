import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`), 467835
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function read(input, y, start, end) {
	return +input[y].slice(start, end+1).join('');
}

function run(input) {
	let result = 0;

	const nums = [];

	for (let j = 0; j < input.length; ++j) {
		for (let i = 0; i < input[j].length; ++i) {
			if (/\d/.test(input[j][i])) {
				const start = i;
				while (/\d/.test(input[j][++i]));
				--i;
				const end = i;
				nums.push([j, start, end]);
			}
		}
	}

	for (let j = 0; j < input.length; ++j) {
		for (let i = 0; i < input[j].length; ++i) {
			if (input[j][i] === '*') {
				const adjacent = nums.filter(([y, start, end]) => {
					if (y >= j-1 && y <= j+1 && start <= i+1 && end >= i-1) return true;
					return false;
				});
				if (adjacent.length == 2) {
					const n1 = read(input, ...adjacent[0]);
					const n2 = read(input, ...adjacent[1]);
					result += n1*n2;
				}
			}
		}
	}

	return result;
}

function parseInput(str) {
	return L.autoparse(str);
}
