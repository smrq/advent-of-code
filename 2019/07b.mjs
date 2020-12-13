import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('07.txt', 'utf-8').trim();
const tests = [
	[`3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5`, 139629729],
	[`3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10`, 18216],
];

function run(input) {
	const mem = input.split(',').map(x => parseInt(x, 10));

	let max = 0;
	for (let phaseSettings of permutations([5, 6, 7, 8, 9])) {
		const buffers = {
			aIn: [phaseSettings[0], 0],
			bIn: [phaseSettings[1]],
			cIn: [phaseSettings[2]],
			dIn: [phaseSettings[3]],
			eIn: [phaseSettings[4]]
		};
		const a = constructMachine('Amp A', mem, buffers.aIn, buffers.bIn);
		const b = constructMachine('Amp B', mem, buffers.bIn, buffers.cIn);
		const c = constructMachine('Amp C', mem, buffers.cIn, buffers.dIn);
		const d = constructMachine('Amp D', mem, buffers.dIn, buffers.eIn);
		const e = constructMachine('Amp E', mem, buffers.eIn, buffers.aIn);

		runAllMachines([a, b, c, d, e], true);
		const signal = buffers.aIn[0];
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
		pc: 0
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

function runInstruction({ id, mem, pc, inputs, outputs }, debug) {
	const [z, a, b, c] = mem.slice(pc);
	const opcode = z % 100;
	const aMode = (z / 100 | 0) % 10;
	const bMode = (z / 1000 | 0) % 10;
	const cMode = (z / 10000 | 0) % 10;

	switch (opcode) {
		case 1: // c := a + b
			if (debug) console.log(`[${id}] ${pc}:  [${c}] = ${showArg(a, aMode)} + ${showArg(b, bMode)}`);
			mem[c] = value(a, aMode) + value(b, bMode);
			return pc + 4;

		case 2: // c := a * b
			if (debug) console.log(`[${id}] ${pc}:  [${c}] = ${showArg(a, aMode)} * ${showArg(b, bMode)}`);
			mem[c] = value(a, aMode) * value(b, bMode);
			return pc + 4;

		case 3: // a := input
			if (!inputs.length) {
				if (debug) console.log(`[${id}] ${pc}:  [${a}] = input <waiting...>`);
				return pc; // busy wait for input
			}
			const input = inputs.shift();
			if (debug) console.log(`[${id}] ${pc}:  [${a}] = input <${input}>`);
			mem[a] = input;
			return pc + 2;

		case 4: // output a
			if (debug) console.log(`[${id}] ${pc}:  output ${showArg(a, aMode)}`);
			outputs.push(value(a, aMode));
			return pc + 2;

		case 5: // jnz a => b
			if (debug) console.log(`[${id}] ${pc}:  jnz ${showArg(a, aMode)} => ${showArg(b, bMode)}`);
			if (value(a, aMode) !== 0) {
				return value(b, bMode);
			} else {
				return pc + 3;
			}

		case 6: // jez a => b
			if (debug) console.log(`[${id}] ${pc}:  jez ${showArg(a, aMode)} => ${showArg(b, bMode)}`);
			if (value(a, aMode) === 0) {
				return value(b, bMode);
			} else {
				return pc + 3;
			}

		case 7: // c := a < b
			if (debug) console.log(`[${id}] ${pc}:  [${c}] = ${showArg(a, aMode)} < ${showArg(b, bMode)}`);
			mem[c] = value(a, aMode) < value(b, bMode) ? 1 : 0;
			return pc + 4;

		case 8: // c := a == b
			if (debug) console.log(`[${id}] ${pc}:  [${c}] = ${showArg(a, aMode)} == ${showArg(b, bMode)}`);
			mem[c] = value(a, aMode) === value(b, bMode) ? 1 : 0;
			return pc + 4;

		case 99:
			if (debug) console.log(`[${id}] ${pc}:  halt`);
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
