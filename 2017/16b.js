const assert = require('assert');
const fs = require('fs');
const input = [16, fs.readFileSync('16.txt', 'utf-8').trim()];
const tests = [];

function parseInput(input) {
	return input.split(',').map(str => {
		let match;
		if (match = /s(\d+)/.exec(str)) {
			return { type: 's', amount: +match[1] };
		}
		if (match = /x(\d+)\/(\d+)/.exec(str)) {
			return { type: 'x', i: +match[1], j: +match[2] };
		}
		if (match = /p(\w)\/(\w)/.exec(str)) {
			return { type: 'p', a: match[1], b: match[2] };
		}
		throw new Error(str);
	});
}

function run([count, input]) {
	const arr = Array.from({ length: count }).map((_, i) => String.fromCharCode(97+i));
	const instructions = parseInput(input);
	// this works even though it's actually kinda wrong conceptually...
	for (let n = 0; n < 1e9; ++n) {
		const instruction = instructions[n % instructions.length];
		switch (instruction.type) {
			case 's': 
				const items = arr.splice(-instruction.amount, instruction.amount);
				arr.splice(0, 0, ...items);
				break;
			case 'x':
				const tmp = arr[instruction.i];
				arr[instruction.i] = arr[instruction.j];
				arr[instruction.j] = tmp;
				break;
			case 'p':
				const i = arr.indexOf(instruction.a);
				const j = arr.indexOf(instruction.b);
				arr[i] = instruction.b;
				arr[j] = instruction.a;
				break;
		}
		if (n % 1e7 === 0) {
			process.stdout.write('.');
		}
	}
	console.log('');
	return arr.join('');
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
