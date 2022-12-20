import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`1,1,1
2,1,1`), 10,
	parseInput(`2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`), 64
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const set = new Set(input);

	let result = 0;
	for (let pixel of input) {
		const [x, y, z] = pixel.split(',').map(n => parseInt(n, 10));
		
		if (!set.has(`${x-1},${y},${z}`)) ++result;
		if (!set.has(`${x+1},${y},${z}`)) ++result;
		if (!set.has(`${x},${y-1},${z}`)) ++result;
		if (!set.has(`${x},${y+1},${z}`)) ++result;
		if (!set.has(`${x},${y},${z-1}`)) ++result;
		if (!set.has(`${x},${y},${z+1}`)) ++result;
	}

	return result;
}

function parseInput(str) {
	return str.trim().split('\n');
}
