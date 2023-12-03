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
.664.598..`), 4361
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function read(input, y, start, end) {
	return +input[y].slice(start, end+1).join('');
}

function run(input) {
	let result = 0;
	for (let j = 0; j < input.length; ++j) {
		for (let i = 0; i < input[j].length; ++i) {
			if (/\d/.test(input[j][i])) {
				const start = i;
				while (/\d/.test(input[j][++i]));
				--i;
				const end = i;

				let valid = false;
				for (let y = j-1; y <= j+1; ++y) {
					for (let x = start-1; x <= end+1; ++x) {
						if (input[y] && input[y][x] && !/[\d\.]/.test(input[y][x])) {
							valid = true;
						}
					}
				}

				if (valid) {
					const n = read(input, j, start, end);
					result += n;
				}
			}
		}
	}
	return result;
}

function parseInput(str) {
	return L.autoparse(str);
}
