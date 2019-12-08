const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('07.txt', 'utf-8').trim();
const tests = [
	[`3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0`, 43210],
	[`3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0`, 54321],
	[`3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0`, 65210],
];

function run(input) {
	const mem = input.split(',').map(x => parseInt(x, 10));

	let max = 0;
	for (let phaseSettings of permutations([0, 1, 2, 3, 4])) {
		let signal = 0;
		for (let phase of phaseSettings) {
			signal = runProgram(mem, [phase, signal], false);
		}
		if (signal > max) {
			max = signal;
		}
	}
	return max;
}

function *permutations(arr) {
	if (arr.length === 1) yield arr;
	for (let k = 0; k < arr.length; ++k) {
		for (let p of permutations([
			...arr.slice(0, k),
			...arr.slice(k+1)
		])) {
			yield [arr[k], ...p];
		}
	}
}

function runProgram(mem, inputs, debug) {
	let pc = 0;
	const outputs = [];
	while (pc != null) {
		pc = interpret(mem, pc, inputs, outputs, debug);
	}
	return outputs[0];
}

function interpret(mem, pc, inputs, outputs, debug) {
	const [z, a, b, c] = mem.slice(pc);
	const opcode = z % 100;
	const aMode = (z / 100 | 0) % 10;
	const bMode = (z / 1000 | 0) % 10;
	const cMode = (z / 10000 | 0) % 10;

	switch (opcode) {
		case 1: // c := a + b
			if (debug) console.log(`${pc}:  [${c}] = ${showArg(a, aMode)} + ${showArg(b, bMode)}`);
			mem[c] = value(a, aMode) + value(b, bMode);
			return pc + 4;

		case 2: // c := a * b
			if (debug) console.log(`${pc}:  [${c}] = ${showArg(a, aMode)} * ${showArg(b, bMode)}`);
			mem[c] = value(a, aMode) * value(b, bMode);
			return pc + 4;

		case 3: // a := input
			const input = inputs.shift();
			if (debug) console.log(`${pc}:  [${a}] = input <${input}>`);
			mem[a] = input;
			return pc + 2;

		case 4: // output a
			if (debug) console.log(`${pc}:  output ${showArg(a, aMode)}`);
			outputs.push(value(a, aMode));
			return pc + 2;

		case 5: // jnz a => b
			if (debug) console.log(`${pc}:  jnz ${showArg(a, aMode)} => ${showArg(b, bMode)}`);
			if (value(a, aMode) !== 0) {
				return value(b, bMode);
			} else {
				return pc + 3;
			}

		case 6: // jez a => b
			if (debug) console.log(`${pc}:  jez ${showArg(a, aMode)} => ${showArg(b, bMode)}`);
			if (value(a, aMode) === 0) {
				return value(b, bMode);
			} else {
				return pc + 3;
			}

		case 7: // c := a < b
			if (debug) console.log(`${pc}:  [${c}] = ${showArg(a, aMode)} < ${showArg(b, bMode)}`);
			mem[c] = value(a, aMode) < value(b, bMode) ? 1 : 0;
			return pc + 4;

		case 8: // c := a == b
			if (debug) console.log(`${pc}:  [${c}] = ${showArg(a, aMode)} == ${showArg(b, bMode)}`);
			mem[c] = value(a, aMode) === value(b, bMode) ? 1 : 0;
			return pc + 4;

		case 99:
			if (debug) console.log(`${pc}:  halt`);
			return null;
	}

	function value(n, mode) {
		if (mode === 0) { return mem[n]; }
		if (mode === 1) { return n; }
		throw new Error();
	}

	function showArg(arg, mode) {
		if (mode === 0) { return `[${arg}]<${mem[arg]}>`; }
		if (mode === 1) { return `${arg}`; }
		throw new Error();
	}
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
