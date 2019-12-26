const assert = require('assert');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const inputFilename = path.resolve(__dirname, parseInt(path.basename(process.argv[1], '.js')) + '.txt');
const input = fs.readFileSync(inputFilename, 'utf-8').trim();

let machineIdNumber = 0;

function constructMachine(id, mem) {
	const stdin = createPipe();
	const stdout = createPipe();
	return {
		baseId: id,
		id: id + (machineIdNumber++),
		mem: mem.slice(),
		stdin,
		stdout,
		pc: 0,
		relativeBase: 0
	};
}

function copyMachine(machine) {
	const stdin = createPipe();
	const stdout = createPipe();
	return {
		...machine,
		id: machine.baseId + (machineIdNumber++),
		mem: machine.mem.slice(),
		stdin,
		stdout
	}
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

function connectPipes(inPipe, outPipe, transform = x => x) {
	(async function () {
		for (;;) {
			await outPipe.write(transform(await inPipe.read()));
		}
	})();
}

function fetchInstruction(mem, pc) {
	const [z, a, b, c] = mem.slice(pc);
	const opcode = z % 100;
	const aMode = (z / 100 | 0) % 10;
	const bMode = (z / 1000 | 0) % 10;
	const cMode = (z / 10000 | 0) % 10;

	return {
		opcode,
		a: { n: a, mode: aMode },
		b: { n: b, mode: bMode },
		c: { n: c, mode: cMode },
	};
}

async function runMachineAsync(machine, debug) {
	const gen = runMachineGen(machine, debug);
	let result;
	let value;
	for (;;) {
		result = gen.next(value);
		if (result.done) break;

		value = null;
		if (result.value == null) {
			value = await machine.stdin.read();
		} else {
			await machine.stdout.write(result.value);
		}
	}
}

function *runMachineGen(machine, debug) {
	while (machine.pc != null) {
		const { opcode, a, b, c } = fetchInstruction(machine.mem, machine.pc);

		switch (opcode) {
			case 1: // c := a + b
				if (debug) console.log(`[${machine.id}] ${showMem(machine.pc, 4).padEnd(28, ' ')} ${showAssign(c)} = ${showArg(a)} + ${showArg(b)}`);
				assign(c, value(a) + value(b));
				machine.pc += 4;
				break;

			case 2: // c := a * b
				if (debug) console.log(`[${machine.id}] ${showMem(machine.pc, 4).padEnd(28, ' ')} ${showAssign(c)} = ${showArg(a)} * ${showArg(b)}`);
				assign(c, value(a) * value(b));
				machine.pc += 4;
				break;

			case 3: // a := input
				if (debug) console.log(`[${machine.id}] ${showMem(machine.pc, 2).padEnd(28, ' ')} awaiting input...`);
				const input = yield;
				if (debug) console.log(`[${machine.id}] ${showMem(machine.pc, 2).padEnd(28, ' ')} ${showAssign(a)} = input <${input}>`);
				assign(a, input);
				machine.pc += 2;
				break;

			case 4: // output a
				if (debug) console.log(`[${machine.id}] ${showMem(machine.pc, 2).padEnd(28, ' ')} output ${showArg(a)}`);
				const output = value(a);
				machine.pc += 2;
				yield output;
				break;

			case 5: // jnz a => b
				if (debug) {
					if (a.mode === 1) {
						if (a.value === 0) {
							console.log(`[${machine.id}] ${showMem(machine.pc, 3).padEnd(28, ' ')} nop (jnz ${showArg(a)})`);
						} else {
							console.log(`[${machine.id}] ${showMem(machine.pc, 3).padEnd(28, ' ')} jmp ${showArg(b)} (jnz ${showArg(a)})`);
						}
					} else {
						console.log(`[${machine.id}] ${showMem(machine.pc, 3).padEnd(28, ' ')} jnz ${showArg(a)} => ${showArg(b)}`);
					}
				}
				if (value(a) !== 0) {
					machine.pc = value(b);
				} else {
					machine.pc += 3;
				}
				break;

			case 6: // jez a => b
				if (debug) {
					if (a.mode === 1) {
						if (a.value === 0) {
							console.log(`[${machine.id}] ${showMem(machine.pc, 3).padEnd(28, ' ')} jmp ${showArg(b)} (jez ${showArg(a)})`);
						} else {
							console.log(`[${machine.id}] ${showMem(machine.pc, 3).padEnd(28, ' ')} nop (jnz ${showArg(a)})`);
						}
					} else {
						console.log(`[${machine.id}] ${showMem(machine.pc, 3).padEnd(28, ' ')} jez ${showArg(a)} => ${showArg(b)}`);
					}
				}
				if (value(a) === 0) {
					machine.pc = value(b);
				} else {
					machine.pc += 3;
				}
				break;

			case 7: // c := a < b
				if (debug) console.log(`[${machine.id}] ${showMem(machine.pc, 4).padEnd(28, ' ')} ${showAssign(c)} = ${showArg(a)} < ${showArg(b)}`);
				assign(c, value(a) < value(b) ? 1 : 0);
				machine.pc += 4;
				break;

			case 8: // c := a == b
				if (debug) console.log(`[${machine.id}] ${showMem(machine.pc, 4).padEnd(28, ' ')} ${showAssign(c)} = ${showArg(a)} == ${showArg(b)}`);
				assign(c, value(a) === value(b) ? 1 : 0);
				machine.pc += 4;
				break;

			case 9: // relativeBase += a
				if (debug) console.log(`[${machine.id}] ${showMem(machine.pc, 2).padEnd(28, ' ')} relative base <${machine.relativeBase}> += ${showArg(a)}`);
				machine.relativeBase += value(a);
				machine.pc += 2;
				break;

			case 99:
				if (debug) console.log(`[${machine.id}] ${showMem(machine.pc, 1).padEnd(28, ' ')} halt`);
				machine.pc = null;
				break;
		}
	}

	function value(arg) {
		if (arg.mode === 0) { return machine.mem[arg.n] || 0; }
		if (arg.mode === 1) { return arg.n; }
		if (arg.mode === 2) { return machine.mem[machine.relativeBase + arg.n] || 0; }
		throw new Error(`invalid mode ${JSON.stringify(arg.mode)} on rhs`);
	}

	function assign(arg, value) {
		if (arg.mode === 0) { machine.mem[arg.n] = value; return; }
		if (arg.mode === 2) { machine.mem[machine.relativeBase + arg.n] = value; return; }
		throw new Error(`invalid mode ${JSON.stringify(mode)} on lhs`);
	}

	function showMem(addr, len) {
		return `${String(addr).padStart(4)}:  ${machine.mem.slice(addr, addr+len).join(',')}`;
	}

	function showArg(arg) {
		if (arg.mode === 0) { return `[${arg.n}]<${value(arg)}>`; }
		if (arg.mode === 1) { return String(value(arg)); }
		if (arg.mode === 2) { return `[${machine.relativeBase}+${arg.n}]<${value(arg)}>`; }
		throw new Error();
	}

	function showAssign(arg) {
		if (arg.mode === 0) { return `[${arg.n}]`; }
		if (arg.mode === 2) { return `[${machine.relativeBase}+${arg.n}]`; }
		throw new Error();
	}
}

async function run(input) {
	const mem = input.split(',').map(x => +x);
	const machine = constructMachine('Machine', mem);
	connectPipes(machine.stdout, process.stdout, c => String.fromCharCode(c));
	runMachineAsync(machine, false);

	const commands = `south
take food ration
west
north
north
east
take astrolabe
west
south
south
east
north
east
south
take weather machine
west
take ornament
east
north
east
east
east
south
`;
	for (let c of commands) {
		machine.stdin.write(c.charCodeAt(0));
	}

	// const rl = readline.createInterface({
	// 	input: process.stdin,
	// 	output: process.stdout
	// });

	// for await (const line of rl) {
	// 	for (let c of line) {
	// 		machine.stdin.write(c.charCodeAt(0));
	// 	}
	// 	machine.stdin.write('\n'.charCodeAt(0));
	// }
}

run(input);
