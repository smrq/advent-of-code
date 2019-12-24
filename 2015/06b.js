const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inputFilename = path.resolve(__dirname,
	path.basename(process.argv[1], '.js').replace(/\D+$/, '') + '.txt');
const input = fs.readFileSync(inputFilename, 'utf-8').trim();

function run(input) {
	const grid = Array(1000).fill().map(() => Array(1000).fill(0));
	for (let line of input.split('\n')) {
		const match = /(turn on|turn off|toggle) (\d+),(\d+) through (\d+),(\d+)/.exec(line);

		assert(+match[4] >= +match[2]);
		assert(+match[5] >= +match[3]);

		for (let y = +match[3]; y <= +match[5]; ++y) {
			for (let x = +match[2]; x <= +match[4]; ++x) {
				switch (match[1]) {
					case 'turn on':
						grid[y][x] += 1;
						break;
					case 'turn off':
						if (grid[y][x] > 0) {
							grid[y][x] -= 1;
						}
						break;
					case 'toggle':
						grid[y][x] += 2;
						break;
				}
			}
		}
	}
	return grid.reduce((acc, line) => acc + line.reduce((a, b) => a + b), 0);
}

console.log(run(input));