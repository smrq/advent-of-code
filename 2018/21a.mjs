import fs from 'fs';
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

function interpretProgram({ ipRegister, instructions }, breakpoint, debug) {
	const registers = [0, 0, 0, 0, 0, 0];
	while (true) {
		const ip = registers[ipRegister];
		if (debug) process.stdout.write(`ip=${ip} `);
		if (ip < 0 || ip >= instructions.length) {
			if (debug) process.stdout.write(`halt\n`);
			break;
		}

		const { opcode, a, b, c } = instructions[ip];
		if (debug) process.stdout.write(`[${registers.join(', ')}] ${opcode} ${a} ${b} ${c} `);

		if (ip === breakpoint) {
			process.stdout.write(`break\n`);
			return registers;
		}

		ops[opcode](registers, a, b, c);
		if (debug) process.stdout.write(`[${registers.join(', ')}]\n`);
		++registers[ipRegister];
	}
	return registers;
}

const program = parseProgramString(input);
const result = interpretProgram(program, 0x1C, true);
console.log(result[5]);
