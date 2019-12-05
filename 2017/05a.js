const fs = require('fs');
const input = fs.readFileSync('05.txt', 'utf-8').trim();

function run(input) {
	const mem = input.split('\n').map(x => +x);
	let pc = 0;
	let steps = 0;
	while (pc >= 0 && pc < mem.length) {
		++steps;
		const newPc = pc + mem[pc];
		++mem[pc];
		pc = newPc;
	}
	return steps;
}

console.log(run(input));
