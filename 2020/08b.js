const { getRawInput } = require('../lib');

const rawInput = getRawInput();
const input = parseInput(rawInput);

console.log(run(input));

function run(input) {
	for (let i = 0; i < input.length; ++i) {
		if (input[i].op === 'jmp') {
			input[i].op = 'nop';
			const r = run2(input);
			if (r != null) {
				return r;
			}
			input[i].op = 'jmp';
		} else if (input[i].op === 'nop') {
			input[i].op = 'jmp';
			const r = run2(input);
			if (r != null) {
				return r;
			}
			input[i].op = 'nop';
		}
	}
}

function run2(input) {
	let acc = 0;
	let pc = 0;
	let visited = new Set();
	while (pc < input.length) {
		if (visited.has(pc)) {
			return null;
		}
		visited.add(pc);
		const { op, value } = input[pc];
		switch (op) {
			case 'nop':
				++pc;
				break;
			case 'acc':
				acc += value;
				++pc;
				break;
			case 'jmp':
				pc += value;
				break;
		}
	}
	return acc;
}

function parseInput(str) {
	return str.split('\n').map(line => {
		const [op, value] = line.split(' ');
		return { op, value: +value };
	});
}
