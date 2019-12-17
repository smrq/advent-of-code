const assert = require('assert');
const fs = require('fs');
const input = fs.readFileSync('17.txt', 'utf-8').trim();
const tests = [];

async function run(input) {
	const debug = false;
	const mem = input.split(',').map(x => parseInt(x, 10));

	let image = '';
	const machine = constructMachine('Camera', mem);
	const gen = runMachine(machine, debug);

	let result;
	while (!(result = gen.next()).done) {
		if (result.value) {
			image += String.fromCharCode(result.value);
		} else {
			throw new Error('expected input');
		}
	}

	console.log(image);

	image = image.trim().split('\n');

	let alignment = 0;
	for (let y = 1; y < image.length - 1; ++y) {
		for (let x = 1; x < image[y].length - 1; ++x) {
			if (image[y][x] !== '#') continue;
			if (image[y-1][x] === '#' &&
				image[y+1][x] === '#' &&
				image[y][x-1] === '#' &&
				image[y][x+1] === '#') {
				alignment += x * y;
			}
		}
	}

	return alignment;
}

function copyMachine(machine, id) {
	return {
		...machine,
		id,
		mem: machine.mem.slice()
	}
}

function constructMachine(id, mem) {
	return {
		id,
		mem: mem.slice(),
		pc: 0,
		relativeBase: 0
	};
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

function *runMachine(machine, debug) {
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

(async function () {
	for (let [input, output] of tests) {
		assert.deepEqual(await run(input), output);
	}
	console.log(await run(input));
})();
