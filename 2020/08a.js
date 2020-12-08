const { getRawInput } = require('../lib');

const rawInput = getRawInput();
const input = parseInput(rawInput);

console.log(run(input));

function run(input) {
	let acc = 0;
	let pc = 0;
	let visited = new Set();
	while (!visited.has(pc)) {
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
