import fs from 'fs';
const input = fs.readFileSync('19.txt', 'utf-8').trim();
const testInput = `#ip 0
seti 5 0 1
seti 6 0 2
addi 0 1 0
addr 1 2 3
setr 1 0 0
seti 8 0 4
seti 9 0 5`;

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

function interpretProgram({ ipRegister, instructions }, registers, debug) {
	while (true) {
		const ip = registers[ipRegister];
		if (debug) process.stdout.write(`ip=${ip} `);
		if (ip < 0 || ip >= instructions.length) {
			if (debug) process.stdout.write(`halt\n`);
			break;
		}

		const { opcode, a, b, c } = instructions[ip];
		if (debug) process.stdout.write(`[${registers.join(', ')}] ${opcode} ${a} ${b} ${c} `);
		ops[opcode](registers, a, b, c);
		if (debug) process.stdout.write(`[${registers.join(', ')}]\n`);
		++registers[ipRegister];
	}
	return registers[0];
}

// ha ha ha this will take forever
// const program = parseProgramString(input);
// const result = interpretProgram(program, [1, 0, 0, 0, 0, 0], false);
// console.log(result);

console.log([
	1, 2, 3, 6, 199, 398, 597, 1194,
	8837, 17674, 26511, 53022, 1758563,
	3517126, 5275689, 10551378
].reduce((a, b) => a + b, 0));

/*
e=978
if (a == 1) {
	e = 390825
}
a = 0
for (f = 1; f <= e; ++f)
	for (c = 1; c <= e; ++c)
		if (f * c == e) {
			a += f;
		}
	}
}
return a

>> sum of factors of e
*/

/*
 0            jmp LABEL_START
 1   LABEL_A: f = 1
 2   LABEL_B: c = 1
 3   LABEL_C: b = f * c
              if (b == e) jmp LABEL_Q
 4              >> b = b == e
 5              >> ip += b
 6            jmp LABEL_D
 7   LABEL_Q: a += f
 8   LABEL_D: c += 1
              if (c > e) jmp LABEL_R
 9              >> gt b <= c e
10              >> ip += b
11            jmp LABEL_C
12   LABEL_R: f += 1
              if (f > e) jmp LABEL_HALT
13              >> gt b <= f e
14              >> ip += b
15            jmp LABEL_B
16   LABEL_HALT: halt
17   LABEL_START: e += 2
18            e *= e
19            e *= 19
20            e *= 11 // e=836
21            b += 6
22            b *= 22
23            b += 10 // b=142
24            e += b  // e=978
              if (a == 0) jmp LABEL_A
25              >> ip += a
26              >> jmp LABEL_A
              e = 10551378
27              >> b = 27
28              >> b *= 28
29              >> b += 29
30              >> b *= 30
31              >> b *= 14
32              >> b *= 32
33              >> e += b
34            a = 0
35            jmp LABEL_A
*/
