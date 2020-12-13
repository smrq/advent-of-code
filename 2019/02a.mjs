import fs from 'fs';
const mem = fs.readFileSync('02.txt', 'utf-8')
	.trim()
	.split(',')
	.map(x => +x);

mem[1] = 12;
mem[2] = 2;

let pc = 0;
while (pc != null) {
	pc = interpret(mem, pc);
}

console.log(mem[0]);

function interpret(mem, pc) {
	const [opcode, a, b, c] = mem.slice(pc);
	switch (opcode) {
		case 1: // c := a + b
			mem[c] = mem[a] + mem[b];
			break;

		case 2: // c := a * b
			mem[c] = mem[a] * mem[b];
			break;

		case 99:
			return null;
	}

	return pc + 4;
}
