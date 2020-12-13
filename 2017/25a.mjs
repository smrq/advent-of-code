import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('25.txt', 'utf-8').trim();
const tests = [
	[`Begin in state A.\nPerform a diagnostic checksum after 6 steps.\n\nIn state A:\n  If the current value is 0:\n    - Write the value 1.\n    - Move one slot to the right.\n    - Continue with state B.\n  If the current value is 1:\n    - Write the value 0.\n    - Move one slot to the left.\n    - Continue with state B.\n\nIn state B:\n  If the current value is 0:\n    - Write the value 1.\n    - Move one slot to the left.\n    - Continue with state A.\n  If the current value is 1:\n    - Write the value 1.\n    - Move one slot to the right.\n    - Continue with state A.`, 3]
];

function parseInput(input) {
	const begin = /Begin in state (\w)\./.exec(input)[1];
	const maxSteps = +/Perform a diagnostic checksum after (\d+) steps\./.exec(input)[1];
	const states = new Map();

	input.split('\n\n').slice(1).forEach(str => {
		const state = /In state (\w):/.exec(str)[1];
		const re = /  If the current value is (\d):\n    - Write the value (\d).\n    - Move one slot to the (left|right).\n    - Continue with state (\w)./g
		const instructions = new Map();
		let match;
		while (match = re.exec(str)) {
			const currentValue = +match[1];
			const writeValue = +match[2];
			const moveDirection = match[3] === 'left' ? -1 : 1;
			const nextState = match[4];
			instructions.set(currentValue, { writeValue, moveDirection, nextState });
		}
		return states.set(state, instructions);
	});
	return { begin, maxSteps, states };
}

function run(input) {
	const { begin, maxSteps, states } = parseInput(input);
	const tape = new Map();

	let state = begin;
	let position = 0;
	for (let i = 0; i < maxSteps; ++i) {
		[state, position] = runStep(states, state, tape, position);
	}

	return [...tape.values()].filter(x => x === 1).length;
}

function runStep(states, state, tape, position) {
	const currentValue = tape.get(position) || 0;
	const instruction = states.get(state).get(currentValue);
	tape.set(position, instruction.writeValue);
	position += instruction.moveDirection;
	return [instruction.nextState, position];
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
