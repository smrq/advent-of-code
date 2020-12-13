import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('09.txt', 'utf-8').trim();
const tests = [
	['{}', 1],
	['{{{}}}', 6],
	['{{},{}}', 5],
	['{{{},{},{{}}}}', 16],
	['{<a>,<a>,<a>,<a>}', 1],
	['{{<ab>},{<ab>},{<ab>},{<ab>}}', 9],
	['{{<!!>},{<!!>},{<!!>},{<!!>}}', 9],
	['{{<a!>},{<a!>},{<a!>},{<ab>}}', 3],
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
					case '{':
						++nesting;
						score += nesting;
						break;
					case '}':
						--nesting;
						break;
					case '<':
						state = 'garbage';
						break;
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
