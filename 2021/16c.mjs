import * as L from '../lib.mjs';

L.runTests(args => run(args), [
    parseInput(`C200B40A82`), 3,
    parseInput(`04005AC33890`), 54,
    parseInput(`880086C3E88112`), 7,
    parseInput(`CE00C43D881120`), 9,
    parseInput(`D8005AC2A8F0`), 1,
    parseInput(`F600BC2D8F`), 0, 
    parseInput(`9C005AC2F8F0`), 0,
    parseInput(`9C0141080250320F1802104A08`), 1,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const binary = input.split('').map(c => parseInt(c, 16).toString(2).padStart(4, '0')).join('');

	let ptr = 0;
	function read(n) {
		let x = binary.slice(ptr, ptr + n);
		ptr += n;
		return parseInt(x, 2);
	}

	let expression = parsePacket();
	L.D(expression);
	return evalExpr(expression);

	function parsePacket(binary) {
		let version = read(3);
		let typeId = read(3);

		if (typeId === 4) {
			let data = '';
			for (;;) {
				let more = read(1);
				data += read(4).toString(2);
				if (more === 0) break;
			}
			data = parseInt(data, 2);
			return data;
		}

		let lengthTypeId = read(1);
		let subpackets = [];

		if (lengthTypeId === 0) {
			let length = read(15);
			let endPtr = ptr + length;
			while (ptr < endPtr) {
				let packet = parsePacket();
				subpackets.push(packet);
			}
		} else {
			let length = read(11);
			for (let i = 0; i < length; ++i) {
				let packet = parsePacket();
				subpackets.push(packet);
			}
		}

		return ['sum','product','min','max',null,'gt','lt','eq'][typeId] + '(' + subpackets.join(', ') + ')';
	}
}

function evalExpr(expression) {
	const sum = (...n) => L.sum(n);
	const product = (...n) => L.product(n);
	const min = (...n) => Math.min(...n);
	const max = (...n) => Math.max(...n);
	const lt = (a, b) => a < b ? 1 : 0;
	const gt = (a, b) => a > b ? 1 : 0;
	const eq = (a, b) => a === b ? 1 : 0;
	return eval(expression);	
}

function parseInput(str) {
	return L.autoparse(str);
}
