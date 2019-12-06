const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('08.txt', 'utf-8').trim();
const tests = [
	[`b inc 5 if a > 1\na inc 1 if b < 5\nc dec -10 if a >= 1\nc inc -20 if c == 10`, 1]
];

function parseInput(input) {
	return input.split('\n').map(parseLine);
}

function parseLine(line) {
	const match = /(\w+) (inc|dec) (-?\d+) if (\w+) ([<>=!]+) (-?\d+)/.exec(line);
	let [_, targetRegister, targetOp, targetValue, checkRegister, checkOp, checkValue] = match;
	return {
		targetRegister,
		targetOp,
		targetValue: +targetValue,
		checkRegister,
		checkOp,
		checkValue: +checkValue
	};
}

function run(input) {
	const registers = new Map();
	for (let instruction of parseInput(input)) {
		executeInstruction(registers, instruction);
	}
	return Math.max(...registers.values());
}

function executeInstruction(registers, { targetRegister, targetOp, targetValue, checkRegister, checkOp, checkValue }) {
	if (!registers.has(targetRegister)) {
		registers.set(targetRegister, 0);
	}
	if (!registers.has(checkRegister)) {
		registers.set(checkRegister, 0);
	}

	const check = registers.get(checkRegister);
	let checkStatus;
	switch (checkOp) {
		case '>': checkStatus = check > checkValue; break;
		case '<': checkStatus = check < checkValue; break;
		case '>=': checkStatus = check >= checkValue; break;
		case '<=': checkStatus = check <= checkValue; break;
		case '==': checkStatus = check === checkValue; break;
		case '!=': checkStatus = check !== checkValue; break;
	}

	if (checkStatus) {
		let target = registers.get(targetRegister);
		switch (targetOp) {
			case 'inc': target += targetValue; break;
			case 'dec': target -= targetValue; break;
		}
		registers.set(targetRegister, target);
	}
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
