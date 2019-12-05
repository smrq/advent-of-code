const fs = require('fs');
const input = fs.readFileSync('05.txt', 'utf-8').trim();

const mem = input.split(',').map(x => parseInt(x, 10));
const output = runProgram(mem, [1], true);
console.log(output);

function runProgram(mem, inputs, debug) {
	let pc = 0;
	const outputs = [];
	while (pc != null) {
		pc = interpret(mem, pc, inputs, outputs, debug);
	}
	return outputs;
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
