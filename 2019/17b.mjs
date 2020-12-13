import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('17.txt', 'utf-8').trim();
const tests = [];

async function run(input) {
	const debug = false;
	const mem = input.split(',').map(x => parseInt(x, 10));
	
	const image = getImage(mem, debug);
	console.log(makeFullPath(image).join(','));

	// Solved by hand
	const path = 'A,A,B,C,C,A,B,C,A,B\nL,12,L,12,R,12\nL,8,L,8,R,12,L,8,L,8\nL,10,R,8,R,12\nn\n';
	return runPath(mem, path, debug);	
}

function getImage(mem, debug) {
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

	return image.trim();
}

function runPath(mem, path, debug) {
	const machine = constructMachine('Vacuum', mem);
	machine.mem[0] = 2;
	const gen = runMachine(machine, debug);

	let result;
	let input = null;
	while (!(result = gen.next(input)).done) {
		input = null;
		if (result.value) {
			if (result.value < 0xFF) {
				process.stdout.write(String.fromCharCode(result.value));
			} else {
				return result.value;
			}
		} else {
			input = path.charCodeAt(0);
			path = path.slice(1);
		}
	}
}

function makeFullPath(image) {
	const w = image.indexOf('\n');
	const h = (image.length + 1) / (w + 1);

	let i = image.indexOf('^');
	let direction = 'left';

	const moves = ['L'];

	for (;;) {
		let next = nextPosition(i, direction, w, h);
		if (next && image[next] === '#') {
			moves.push(1);
			i = next;
			continue;
		}

		let nextDirection = turn(direction, 'L');
		next = nextPosition(i, nextDirection, w, h);
		if (next && image[next] === '#') {
			moves.push('L', 1);
			i = next;
			direction = nextDirection;
			continue;
		}

		nextDirection = turn(direction, 'R');
		next = nextPosition(i, nextDirection, w, h);
		if (next && image[next] === '#') {
			moves.push('R', 1);
			i = next;
			direction = nextDirection;
			continue;
		}

		break;
	}

	i = 0;
	while (i < moves.length - 1) {
		if (typeof moves[i] === 'number' && typeof moves[i+1] === 'number') {
			moves.splice(i, 2, moves[i] + moves[i + 1]);
		} else {
			++i;
		}
	}

	return moves;
}

function turn(direction, turn) {
	switch (direction) {
		case 'up':
			return turn === 'L' ? 'left' : 'right';
		case 'left':
			return turn === 'L' ? 'down' : 'up';
		case 'down':
			return turn === 'L' ? 'right' : 'left';
		case 'right':
			return turn === 'L' ? 'up' : 'down';
	}
}

function nextPosition(i, direction, w, h) {
	switch (direction) {
		case 'left':
			return i % (w + 1) > 0 && i - 1;
		case 'right':
			return i % (w + 1) < (w - 1) && i + 1;
		case 'up':
			return i / (w + 1) | 0 > 0 && i - (w + 1);
		case 'down':
			return i / (w + 1) | 0 < (h - 1) && i + (w + 1);
	}
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
