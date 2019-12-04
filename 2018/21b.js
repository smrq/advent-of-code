const fs = require('fs');
const input = fs.readFileSync('21.txt', 'utf-8').trim();
const ops = {
	addr: (r, a, b, c) => { r[c] = r[a] + r[b]; },
	addi: (r, a, b, c) => { r[c] = r[a] + b; },
	mulr: (r, a, b, c) => { r[c] = r[a] * r[b]; },
	muli: (r, a, b, c) => { r[c] = r[a] * b; },
	banr: (r, a, b, c) => { r[c] = r[a] & r[b]; },
	bani: (r, a, b, c) => { r[c] = r[a] & b; },
	borr: (r, a, b, c) => { r[c] = r[a] | r[b]; },
	bori: (r, a, b, c) => { r[c] = r[a] | b; },
	setr: (r, a, b, c) => { r[c] = r[a]; },
	seti: (r, a, b, c) => { r[c] = a; },
	gtir: (r, a, b, c) => { r[c] = a > r[b] ? 1 : 0; },
	gtri: (r, a, b, c) => { r[c] = r[a] > b ? 1 : 0; },
	gtrr: (r, a, b, c) => { r[c] = r[a] > r[b] ? 1 : 0; },
	eqir: (r, a, b, c) => { r[c] = a === r[b] ? 1 : 0; },
	eqri: (r, a, b, c) => { r[c] = r[a] === b ? 1 : 0; },
	eqrr: (r, a, b, c) => { r[c] = r[a] === r[b] ? 1 : 0; },
};

function parseProgramString(programStr) {
	const lines = programStr.split('\n');
	const ipRegister = +/#ip (\d)/.exec(lines[0])[1];
	const instructions = lines
		.slice(1)
		.map(line => {
			const [opcode, a, b, c] = line.split(' ');
			return { opcode, a: +a, b: +b, c: +c };
		});
	return { ipRegister, instructions };
}

function interpretProgram({ ipRegister, instructions }, debug) {
	const registers = [0, 0, 0, 0, 0, 0];
	while (true) {
		const ip = registers[ipRegister];

		if (ip === 0x1C) {
			console.log(registers[5].toString(16));
		}

		if (debug) process.stdout.write(`ip=${ip.toString(16).padStart(2, ' ')} `);
		if (ip < 0 || ip >= instructions.length) {
			if (debug) process.stdout.write(`halt\n`);
			break;
		}

		const { opcode, a, b, c } = instructions[ip];
		if (debug) process.stdout.write(`[${registers.map(x => x.toString(16).padStart(6, ' ')).join(', ')}] `);
		if (debug) process.stdout.write(`${opcode} ${a.toString(16).padStart(6, ' ')} ${b.toString(16).padStart(6, ' ')} ${c.toString(16).padStart(6, ' ')} `);

		ops[opcode](registers, a, b, c);
		if (debug) process.stdout.write(`[${registers.map(x => x.toString(16).padStart(6, ' ')).join(', ')}]\n`);
		++registers[ipRegister];
	}
	return registers;
}

// const program = parseProgramString(input);
// interpretProgram(program, true);

function run() {
	const results = new Set();

	let F = 0;
	while (true) {
	  let D = F | 0x10000;
	  F = 0x897c42;
	  while (true) {
	  	F += D & 0xff;
	    F &= 0xffffff;
	    F *= 0x1016b;
	    F &= 0xffffff;
	    if (D < 0x100) break;
	    D >>= 8;
	  }

	  if (results.has(F)) {
	  	break;
	  }
	  results.add(F);
	  console.log(F);
	}
}

run();

/*

  0:  F = 0x7b
  1:  F = F & 0x1c8
  2:  F = F === 0x48
  3:  jmp 1 + F + 0x3
  4:  jmp 1 + 0x0
  5:  F = 0x0
  6:  D = F | 0x10000
  7:  F = 0x897c42
  8:  B = D & 0xff
  9:  F = F + B
  a:  F = F & 0xffffff
  b:  F = F * 0x1016b
  c:  F = F & 0xffffff
  d:  B = 0x100 > D
  e:  jmp 1 + B + 0xe
  f:  jmp 1 + 0xf + 0x1
 10:  jmp 1 + 0x1b
 11:  B = 0x0
 12:  E = B + 0x1
 13:  E = E * 0x100
 14:  E = E > D
 15:  jmp 1 + E + 0x15
 16:  jmp 1 + 0x16 + 0x1
 17:  jmp 1 + 0x19
 18:  B = B + 0x1
 19:  jmp 1 + 0x11
 1a:  D = B
 1b:  jmp 1 + 0x7
 1c:  B = F === A
 1d:  jmp 1 + B + 0x1d
 1e:  jmp 1 + 0x5

0x6502d1
0x7175d2
0x8b9c44
0xdbf547
...

*/

