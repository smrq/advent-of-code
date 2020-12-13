import fs from 'fs';
const raw = fs.readFileSync('02.txt', 'utf-8')
	.trim();

for (let noun = 0; noun < 99; ++noun) {
	for (let verb = 0; verb < 99; ++verb) {
		const result = execute(noun, verb);
		if (result == 19690720) {
			console.log(100 * noun + verb);
		}
	}
}

function execute(noun, verb) {
	const mem = raw.split(',').map(x => +x);
	mem[1] = noun;
	mem[2] = verb;
	runProgram(mem);
	return mem[0];
}

function runProgram(mem) {
	let pc = 0;
	while (pc != null) {
		pc = interpret(mem, pc);
	}	
}

function interpret(mem, pc) {
	const [opcode, a, b, c] = mem.slice(pc);
	switch (opcode) {
		case 1: // c := a + b
			mem[c] = mem[a] + mem[b];
			return pc + 4;

		case 2: // c := a * b
			mem[c] = mem[a] * mem[b];
			return pc + 4;

		case 99:
			return null;
	}
}
