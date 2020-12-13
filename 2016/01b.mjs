import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('01.txt', 'utf-8').trim();
const tests = [];

function run(input) {
	let x = 0;
	let y = 0;
	let direction = 'up';

	const visited = new Set();

	for (let instruction of input.split(', ')) {
		const [_, turn, blocks] = /([LR])(\d+)/.exec(instruction);
		switch (turn) {
			case 'L':
				switch (direction) {
					case 'up': direction = 'left'; break;
					case 'left': direction = 'down'; break;
					case 'down': direction = 'right'; break;
					case 'right': direction = 'up'; break;
				}
				break;
			case 'R':
				switch (direction) {
					case 'up': direction = 'right'; break;
					case 'right': direction = 'down'; break;
					case 'down': direction = 'left'; break;
					case 'left': direction = 'up'; break;
				}
				break;
		}

		let dx = 0;
		let dy = 0;
		switch (direction) {
			case 'left': dx = -1; break;
			case 'right': dx = +1; break;
			case 'up': dy = -1; break;
			case 'down': dy = +1; break;
		}

		for (let i = 0; i < (+blocks); ++i) {
			x += dx;
			y += dy;
			const key = `${x},${y}`;
			if (visited.has(key)) {
				return Math.abs(x) + Math.abs(y);
			} else {
				visited.add(key);
			}
		}
	}
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
