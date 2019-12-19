const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inputFilename = path.resolve(__dirname, parseInt(path.basename(process.argv[1], '.js')) + '.txt');
const input = fs.readFileSync(inputFilename, 'utf-8').trim();
const tests = [];

async function run(input) {
	const mem = input.split(',').map(x => parseInt(x, 10));
	
	let x = 0;
	for (let y = 1000; ; ++y) {
		const start0 = await beamStart(mem, x, y);
		const end0 = await beamEnd(mem, start0, y);
		const start1 = await beamStart(mem, start0, y+99);
		if (end0 >= start1 + 99) {
			return [start1, y];
		}
		x = start0;
	}
}

async function beamStart(mem, x, y) {
	while (await tryCoords(mem, x, y) !== 1) {
		++x;
	}
	return x;
}

async function beamEnd(mem, x, y) {
	while (await tryCoords(mem, x, y) === 1) {
		++x;
	}
	return x - 1;	
}

async function tryCoords(mem, x, y) {
	const stdin = createPipe();
	const stdout = createPipe();
	const machine = constructMachine(
		'Beam',
		mem,
		stdin.read,
		stdout.write);
	runMachine(machine, false);
	stdin.write(x);
	stdin.write(y);
	return stdout.read();
}

function createPipe() {
	const buf = [];
	let onWrite = null;

	return {
		write: async function write(value) {
			buf.push(value);
			if (onWrite) {
				onWrite();
			}
		},
		read: async function read() {
			if (buf.length) {
				return buf.shift();
			} else {
				return new Promise(resolve => {
					onWrite = resolve;
				}).then(() => {
					onWrite = null;
					return read();
				});
			}
		}
	}
}

function constructMachine(id, mem, getInput, sendOutput) {
	return {
		id,
		mem: mem.slice(),
		getInput,
		sendOutput,
		pc: 0,
		relativeBase: 0
	};
}

async function runMachine(machine, debug) {
	while (await stepMachine(machine, debug)) {}
}

async function stepMachine(machine, debug) {
	if (machine.pc == null) {
		return false;
	} else {
		machine.pc = await runInstruction(machine, debug);
		return true;
	}
}

async function runInstruction(machine, debug) {
	const { id, mem, pc, getInput, sendOutput } = machine;
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
			if (debug) {
				console.log(`[${id}] ${String(pc).padStart(4)}:  ${z},${a}`);
				console.log(`[${id}]        awaiting input...`);
			}
			const input = await getInput();
			if (debug) {
				console.log(`[${id}] ${String(pc).padStart(4)}:  ${z},${a}`);
				console.log(`[${id}]        ${showAssign(a, aMode)} = input <${input}>`);
			}
			assign(a, aMode, input);
			return pc + 2;

		case 4: // output a
			if (debug) {
				console.log(`[${id}] ${String(pc).padStart(4)}:  ${z},${a}`);
				console.log(`[${id}]        output ${showArg(a, aMode)}`);
			}
			await sendOutput(value(a, aMode));
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
		throw new Error(`invalid mode ${JSON.stringify(mode)} on rhs`);
	}

	function assign(n, mode, value) {
		if (mode === 0) { machine.mem[n] = value; return; }
		if (mode === 2) { machine.mem[machine.relativeBase + n] = value; return; }
		throw new Error(`invalid mode ${JSON.stringify(mode)} on lhs`);
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

(async function () {
	for (let [input, output] of tests) {
		assert.deepEqual(await run(input), output);
	}
	console.log(await run(input));
})();
