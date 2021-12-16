import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`8A004A801A8002F478`), 16,
	parseInput(`620080001611562C8802118E34`), 12,
	parseInput(`C0015000016115A2E0802F182340`), 23,
	parseInput(`A0016C880162017C3686B18A3D4780`), 31,
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

	let result = 0;
	parsePacket();
	return result;


	function parsePacket(binary) {
		let version = read(3);
		result += version;

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
	}
}

function parseInput(str) {
	return L.autoparse(str);
}
