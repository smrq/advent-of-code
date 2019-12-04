const fs = require('fs');
const input = fs.readFileSync('21.txt', 'utf-8');
const lines = input.split('\n');

const ipRegister = +/#ip (\d)/.exec(lines[0])[1];
const instructions = lines.slice(1).map(line => {
	const [_, op, a, b, c] = /(\w+) (\d+) (\d+) (\d+)/.exec(line);
	return { op, a: +a, b: +b, c: +c };
});
console.log(instructions.map((instruction, ip) => disasm(instruction, ipRegister, ip)).join('\n'));

function disasm({ op, a, b, c }, ipRegister, ip) {
	function r(n) {
		return (n === ipRegister) ? `0x${ip.toString(16)}` : 'ABCDEF'[n];
	}

	let result = `${ip.toString(16).padStart(3, ' ')}:  `;
	result += (c === ipRegister) ? 'jmp 1 + ' : `${r(c)} = `;
	switch (op) {
		case 'addr': result += `${r(a)} + ${r(b)}`; break;
		case 'addi': result += `${r(a)} + 0x${b.toString(16)}`; break;
		case 'mulr': result += `${r(a)} * ${r(b)}`; break;
		case 'muli': result += `${r(a)} * 0x${b.toString(16)}`; break;
		case 'banr': result += `${r(a)} & ${r(b)}`; break;
		case 'bani': result += `${r(a)} & 0x${b.toString(16)}`; break;
		case 'borr': result += `${r(a)} | ${r(b)}`; break;
		case 'bori': result += `${r(a)} | 0x${b.toString(16)}`; break;
		case 'setr': result += `${r(a)}`; break;
		case 'seti': result += `0x${a.toString(16)}`; break;
		case 'gtir': result += `0x${a.toString(16)} > ${r(b)}`; break;
		case 'gtri': result += `${r(a)} > 0x${b.toString(16)}`; break;
		case 'gtrr': result += `${r(a)} > ${r(b)}`; break;
		case 'eqir': result += `0x${a.toString(16)} === ${r(b)}`; break;
		case 'eqri': result += `${r(a)} === 0x${b.toString(16)}`; break;
		case 'eqrr': result += `${r(a)} === ${r(b)}`; break;
	}
	return result;
}