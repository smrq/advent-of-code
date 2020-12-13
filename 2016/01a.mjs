import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('01.txt', 'utf-8').trim();
const tests = [];

function run(input) {
	let x = 0;
	let y = 0;
	let direction = 'up';
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
		switch (direction) {
			case 'left': x -= (+blocks); break;
			case 'right': x += (+blocks); break;
			case 'up': y -= (+blocks); break;
			case 'down': y += (+blocks); break;
		}
	}

	return Math.abs(x) + Math.abs(y);
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
