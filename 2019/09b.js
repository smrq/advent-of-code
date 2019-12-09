const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('09.txt', 'utf-8').trim();
const tests = [
	[
		`109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99`,
		[109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99]
	],
	[
		`1102,34915192,34915192,7,4,7,99,0`,
		[1219070632396864]
	],
	[
		`104,1125899906842624,99`,
		[1125899906842624]
	]
]

function run(input) {
	const mem = input.split(',').map(x => parseInt(x, 10));
	const inputBuf = [2];
	const outputBuf = [];
	const machine = constructMachine('BOOST', mem, inputBuf, outputBuf);
	runAllMachines([machine], false);
	return outputBuf;
}

function runAllMachines(machines, debug) {
	for (;;) {
		if (machines
			.map(m => stepMachine(m, debug))
			.every(running => !running)) break;
	}
}

function constructMachine(id, mem, inputs, outputs) {
	return {
		id,
		mem: mem.slice(),
		inputs,
		outputs,
		pc: 0,
		relativeBase: 0
	};
}

function stepMachine(machine, debug) {
	if (machine.pc == null) {
		return false;
	} else {
		machine.pc = runInstruction(machine, debug);
		return true;
	}
}

function runInstruction(machine, debug) {
	const { id, mem, pc, inputs, outputs } = machine;
	const [z, a, b, c] = mem.slice(pc);
	const opcode = z % 100;
	const aMode = (z / 100 | 0) % 10;
	const bMode = (z / 1000 | 0) % 10;
	const cMode = (z / 10000 | 0) % 10;

	switch (opcode) {
		case 1: // c := a + b
			if (debug) {
				console.log(`[${id}] ${String(pc).padStart(4)}:  ${z},${a},${b},${c}`);
				console.log(`[${id}]        ${showAssign(c, cMode)} = ${showArg(a, aMode)} + ${showArg(b, bMode)}`);
			}
			assign(c, cMode, value(a, aMode) + value(b, bMode));
			return pc + 4;

		case 2: // c := a * b
			if (debug) {
				console.log(`[${id}] ${String(pc).padStart(4)}:  ${z},${a},${b},${c}`);
				console.log(`[${id}]        ${showAssign(c, cMode)} = ${showArg(a, aMode)} * ${showArg(b, bMode)}`);
			}
			assign(c, cMode, value(a, aMode) * value(b, bMode));
			return pc + 4;

		case 3: // a := input
			if (!inputs.length) {
				if (debug) {
					console.log(`[${id}] ${String(pc).padStart(4)}:  ${z},${a}`);
					console.log(`[${id}]        ${showAssign(a, aMode)} = input <waiting...>`);
				}
				return pc; // busy wait for input
			} else {
				const input = inputs.shift();
				if (debug) {
					console.log(`[${id}] ${String(pc).padStart(4)}:  ${z},${a}`);
					console.log(`[${id}]        ${showAssign(a, aMode)} = input <${input}>`);
				}
				assign(a, aMode, input);
				return pc + 2;
			}

		case 4: // output a
			if (debug) {
				console.log(`[${id}] ${String(pc).padStart(4)}:  ${z},${a}`);
				console.log(`[${id}]        output ${showArg(a, aMode)}`);
			}
			outputs.push(value(a, aMode));
			return pc + 2;

		case 5: // jnz a => b
			if (debug) {
				console.log(`[${id}] ${String(pc).padStart(4)}:  ${z},${a},${b}`);
				console.log(`[${id}]        jnz ${showArg(a, aMode)} => ${showArg(b, bMode)}`);
			}
			if (value(a, aMode) !== 0) {
				return value(b, bMode);
			} else {
				return pc + 3;
			}

		case 6: // jez a => b
			if (debug) {
				console.log(`[${id}] ${String(pc).padStart(4)}:  ${z},${a},${b}`);
				console.log(`[${id}]        jez ${showArg(a, aMode)} => ${showArg(b, bMode)}`);
			}
			if (value(a, aMode) === 0) {
				return value(b, bMode);
			} else {
				return pc + 3;
			}

		case 7: // c := a < b
			if (debug) {
				console.log(`[${id}] ${String(pc).padStart(4)}:  ${z},${a},${b},${c}`);
				console.log(`[${id}]        ${showAssign(c, cMode)} = ${showArg(a, aMode)} < ${showArg(b, bMode)}`);
			}
			assign(c, cMode, value(a, aMode) < value(b, bMode) ? 1 : 0);
			return pc + 4;

		case 8: // c := a == b
			if (debug) {
				console.log(`[${id}] ${String(pc).padStart(4)}:  ${z},${a},${b},${c}`);
				console.log(`[${id}]        ${showAssign(c, cMode)} = ${showArg(a, aMode)} == ${showArg(b, bMode)}`);
			}
			assign(c, cMode, value(a, aMode) === value(b, bMode) ? 1 : 0);
			return pc + 4;

		case 9: // relativeBase += a
			if (debug) {
				console.log(`[${id}] ${String(pc).padStart(4)}:  ${z},${a}`);
				console.log(`[${id}]        relative base <${machine.relativeBase}> += ${showArg(a, aMode)}`);
			}
			machine.relativeBase += value(a, aMode);
			return pc + 2;

		case 99:
			if (debug) {
				console.log(`[${id}] ${String(pc).padStart(4)}:  ${z}`);
				console.log(`[${id}]        halt`);
			}
			return null;
	}

	function value(n, mode) {
		if (mode === 0) { return machine.mem[n] || 0; }
		if (mode === 1) { return n; }
		if (mode === 2) { return machine.mem[machine.relativeBase + n] || 0; }
		throw new Error();
	}

	function assign(n, mode, value) {
		if (mode === 0) { machine.mem[n] = value; return; }
		if (mode === 2) { machine.mem[machine.relativeBase + n] = value; return; }
		throw new Error();
	}

	function showArg(n, mode) {
		if (mode === 0) { return `[${n}]<${machine.mem[n] || 0}>`; }
		if (mode === 1) { return `${n}`; }
		if (mode === 2) { return `[${machine.relativeBase}+${n}]<${machine.mem[machine.relativeBase+n] || 0}>`; }
		throw new Error();
	}

	function showAssign(n, mode) {
		if (mode === 0) { return `[${n}]`; }
		if (mode === 2) { return `[${machine.relativeBase}+${n}]`; }
		throw new Error();
	}
}

for (let [input, output] of tests) {
	assert.deepEqual(run(input), output);
}
console.log(run(input));
