import assert from 'assert';
import fs from 'fs';
const input = fs.readFileSync('23.txt', 'utf-8').trim();
const tests = [];

function parseInput(input) {
	return input.split('\n').map(parseLine);
}

function parseLine(line) {
	const [_, op, arg0, arg1] = /(\w+) (\S+) (\S+)/.exec(line);
	return { op, arg0, arg1 };
}

function run(input) {
	const instructions = parseInput(input);
	const registers = new Map('abcdefgh'.split('').map(c => [c, 0]));
	registers.set('a', 1);
	let pc = 0;

	while (pc >= 0 && pc < instructions.length) {
		const instruction = instructions[pc];
		if (pc === 15) {
			console.log(registers);
		}
		pc = executeInstruction(instruction, pc, registers);
	}

	return registers.get('h');
}

function executeInstruction({ op, arg0, arg1 }, pc, registers) {
	switch (op) {
		case 'set':
			registers.set(arg0, value(arg1));
			return pc + 1;
		case 'sub':
			registers.set(arg0, value(arg0) - value(arg1));
			return pc + 1;
		case 'mul':
			registers.set(arg0, value(arg0) * value(arg1));
			return pc + 1;
		case 'jnz':
			if (value(arg0) !== 0) {
				return pc + value(arg1);
			} else {
				return pc + 1;
			}
		default:
			throw new Error(op);
	}

	function value(x) {
		if (/[a-z]/.test(x)) {
			return registers.get(x);
		}
		return parseInt(x, 10);
	}
}

// for (let [input, output] of tests) {
// 	assert.strictEqual(run(input), output);
// }
// console.log(run(input));

function optimized() {
	let h = 0;
	for (let b = 109900; b <= 126900; b += 17) {
		for (let d = 2; d <= Math.sqrt(b); ++d) {
			if (b % d == 0) {
				h += 1;
				break;
			}
		}
	}
	return h;
}

console.log(optimized());

/*

 0: set b 99
 1: set c b
 2: jnz a 2
 3: jnz 1 5
 4: mul b 100
 5: sub b -100000
 6: set c b
 7: sub c -17000
 8: set f 1
 9: set d 2
10: set e 2
11: set g d
12: mul g e
13: sub g b
14: jnz g 2
15: set f 0
16: sub e -1
17: set g e
18: sub g b
19: jnz g -8
20: sub d -1
21: set g d
22: sub g b
23: jnz g -13
24: jnz f 2
25: sub h -1
26: set g b
27: sub g c
28: jnz g 2
29: jnz 1 3
30: sub b -17
31: jnz 1 -23


	set b 99
	set c b
	jnz a L4
	jnz 1 L8
 4: mul b 100
	sub b -100000
	set c b
	sub c -17000
 8: set f 1
	set d 2
10: set e 2
11: set g d
	mul g e
	sub g b
	jnz g L16
	set f 0
16: sub e -1
	set g e
	sub g b
	jnz g L11
	sub d -1
	set g d
	sub g b
	jnz g L10
	jnz f L26
	sub h -1
26: set g b
	sub g c
	jnz g L30
	jnz 1 HALT
30: sub b -17
	jnz 1 L8


	b = 109900
	c = 126900
 8: f = 1
	d = 2
10: e = 2
11: g = d * e - b
	if (g != 0)
		jmp L16
	f = 0
16: e += 1
	g = e - b
	if (g != 0)
		jmp L11
	d += 1
	g = d - b
	if (g != 0)
		jmp L10
	if (f != 0)
		jmp L26
	h += 1
26: g = b - c
	if (g != 0)
		jmp L30
	jmp HALT
30: b += 17
	jmp L8


	b = 109900
	c = 126900
 8: f = 1
	d = 2
10: e = 2
11: if (d * e - b != 0)
		jmp L16
	f = 0
16: e += 1
	if (e - b != 0)
		jmp L11
	d += 1
	if (d - b != 0)
		jmp L10
	if (f != 0)
		jmp L26
	h += 1
26: if (b - c != 0)
		jmp L30
	jmp HALT
30: b += 17
	jmp L8


	b = 109900
	c = 126900
 8: f = 1
	d = 2
10: e = 2
11: if (d * e - b == 0)
		f = 0
	e += 1
	if (e - b != 0)
		jmp L11
	d += 1
	if (d - b != 0)
		jmp L10
	if (f == 0)
		h += 1
	if (b - c == 0)
		HALT
	b += 17
	jmp L8



	b = 109900
	c = 126900
 8: f = 1
	d = 2
10: e = 2
11: if (d * e == b)
		f = 0
	e += 1
	if (e != b)
		jmp L11
	d += 1
	if (d != b)
		jmp L10
	if (f == 0)
		h += 1
	if (b == c)
		HALT
	b += 17
	jmp L8


h = 0
for (b = 109900; b <= 126900; b += 17) {
	f = 1
	for (d = 2; d < b; ++d) {
		for (e = 2; e < b; ++e) {
			if (d * e == b) {
				f = 0
			}
		}
	}
	if (f == 0) {
		h += 1
	}
}

*/