const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('09.txt', 'utf-8').trim();
const tests = [
	['<>', 0],
	['<random characters>', 17],
	['<<<<>', 3],
	['<{!>}>', 2],
	['<!!>', 0],
	['<!!!>>', 0],
	['<{o"i!a,<{i<a>', 10]
];

function run(input) {
	let score = 0;
	let nesting = 0;
	let state = 'normal';
	for (let i = 0; i < input.length; ++i) {
		const c = input[i];
		switch (state) {
			case 'normal':
				switch (c) {
					case '<':
						state = 'garbage';
						break;
					case '{':
					case '}':
					case ',':
						break;
					default: throw new Error(`Invalid char ${c} for state ${state}`);
				}
				break;
			case 'garbage':
				switch (c) {
					case '>':
						state = 'normal';
						break;
					case '!':
						++i;
						break;
					default:
						++score;
						break;
				}
				break;
		}
	}
	return score;
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
