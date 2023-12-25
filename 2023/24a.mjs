import * as L from '../lib.mjs';

L.runTests(args => run(...args), [
	[parseInput(`19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3`), 7, 27], 2,
]);

const input = parseInput(L.getRawInput());
console.log(run(input, 200000000000000, 400000000000000));

function test(hail1, hail2, min, max) {
	const m1 = hail1.velocity[1] / hail1.velocity[0];
	const m2 = hail2.velocity[1] / hail2.velocity[0];

	const b1 = hail1.position[1] - m1 * hail1.position[0];
	const b2 = hail2.position[1] - m2 * hail2.position[0];
	
	const x = (b2 - b1) / (m1 - m2);
	const y = m1 * x + b1;

	const t1 = (x - hail1.position[0]) / hail1.velocity[0];
	const t2 = (x - hail2.position[0]) / hail2.velocity[0];

	return (
		min <= x &&
		x <= max &&
		min <= y &&
		y <= max &&
		t1 >= 0 &&
		t2 >= 0
	);
}

function run(input, min, max) {
	let result = 0;
	for (let i = 0; i < input.length; ++i) {
		for (let j = i+1; j < input.length; ++j) {
			if (test(input[i], input[j], min, max)) {
				++result;
			}
		}
	}

	return result;
}

function parseInput(str) {
	return str.trim().split('\n').map(line => {
		const [position, velocity] = line.split(/\s+@\s+/).map(triplet => triplet.split(/,\s+/).map(n => parseInt(n, 10)))
		return { position, velocity };
	});
}
