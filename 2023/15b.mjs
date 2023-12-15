import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`), 145,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function hash(str) {
	let value = 0;
	for (let i = 0; i < str.length; ++i) {
		value += str.charCodeAt(i);
		value *= 17;
		value = value % 256;
	}
	return value;
}

function run(input) {
	const boxes = [...Array(256)].map(() => []);

	for (let op of input) {
		let match;
		if (match = /^(\w+)=(\d)$/.exec(op)) {
			const [, label, focal] = match;
			const box = boxes[hash(label)];
			const i = box.findIndex(lens => lens.label === label);
			if (i !== -1) {
				box.splice(i, 1, { label, focal });
			} else {
				box.push({ label, focal });
			}
		} else if (match = /^(\w+)-$/.exec(op)) {
			const [, label] = match;
			const box = boxes[hash(label)];
			const i = box.findIndex(lens => lens.label === label);
			if (i !== -1) {
				box.splice(i, 1);
			}
		} else throw new Error('unexpected operation');
	}

	return L.sum(boxes.flatMap((box, boxIndex) => box.map((lens, lensIndex) =>
		(boxIndex+1) * (lensIndex+1) * lens.focal
	)));
}

function parseInput(str) {
	return str.trim().split(',');
}
