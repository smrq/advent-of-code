const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inputFilename = path.resolve(__dirname, parseInt(path.basename(process.argv[1], '.js')) + '.txt');
const input = fs.readFileSync(inputFilename, 'utf-8').trim();
const tests = [];

function parseInput(input) {
	const grid = new Map();
	for (let line of input.split('\n').slice(2)) {
		const [filesystem, size, used, avail] = line.split(/\s+/);
		const [x, y] = /node-x(\d+)-y(\d+)$/.exec(filesystem).slice(1).map(x => +x);
		grid.set(`${x},${y}`, {
			x,
			y,
			size: parseInt(size, 10),
			used: parseInt(used, 10),
			avail: parseInt(avail, 10)
		});
	}
	return grid;
}

function run(input) {
	const grid = parseInput(input);

	for (let y = 0; y < 30; ++y) {
		for (let x = 0; x < 32; ++x) {
			const node = grid.get(`${x},${y}`);
			process.stdout.write(chalk.red(node.used > 99 ? 'XX' : String(node.used).padStart(2, ' ')) +
				chalk.green(node.size > 99 ? 'XX' : String(node.size).padEnd(2, ' ')));

			if (x < 31) {
				const nextNode = grid.get(`${x+1},${y}`);
				if (nextNode.avail >= node.used && node.avail >= nextNode.used) {
					process.stdout.write('-');
				} else if (nextNode.avail >= node.used) {
					process.stdout.write('>');
				} else if (node.avail >= nextNode.used) {
					process.stdout.write('<');
				} else {
					process.stdout.write(' ');
				}
			}
		}
		process.stdout.write('\n');

		if (y < 29) {
			for (let x = 0; x < 32; ++x) {
				const node = grid.get(`${x},${y}`);
				const nextNode = grid.get(`${x},${y+1}`);
				if (nextNode.avail >= node.used && node.avail >= nextNode.used) {
					process.stdout.write('  |  ');
				} else if (nextNode.avail >= node.used) {
					process.stdout.write('  v  ');
				} else if (node.avail >= nextNode.used) {
					process.stdout.write('  ^  ');
				} else {
					process.stdout.write('     ');
				}
			}
			process.stdout.write('\n');
		}
	}
}

// Solved by hand:
// Move the empty space to the left of the target data in 30 moves (moving around the XXs)
// Move the empty space right, down, left, left, up to move the target data left 1 in 5 moves
// Repeat 30 times until the empty space is in [0,0] and target data in [1,0] (total of 30+5*30 = 180 moves)
// Last move: move the target data into the empty space at the origin
// Total: 181 moves	

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output, input);
}
console.log(run(input));
