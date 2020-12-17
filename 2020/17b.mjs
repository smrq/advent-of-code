import { getRawInput, autoparse, runTests, orthodiagonalOffsets } from '../lib.mjs';

const input = autoparse(getRawInput());

runTests(args => run(args), [
autoparse(`.#.
..#
###`), 848
]);

console.log(run(input));

function run(input) {
	let grid = new Map();
	for (let y = 0; y < input.length; ++y) {
		for (let x = 0; x < input[0].length; ++x) {
			grid.set(`${x},${y},0,0`, input[y][x]);
		}
	}

	let fourth = [0,0];
	let depth = [0,0];
	let height = [0,input.length-1];
	let width = [0,input[0].length-1];
	let offsets = orthodiagonalOffsets(4);

	for (let i = 0; i < 6; ++i) {
		let newGrid = new Map();

		--fourth[0]; ++fourth[1];
		--depth[0]; ++depth[1];
		--height[0]; ++height[1];
		--width[0]; ++width[1];

		for (let w = fourth[0]; w <= fourth[1]; ++w) {
			for (let z = depth[0]; z <= depth[1]; ++z) {
				for (let y = height[0]; y <= height[1]; ++y) {
					for (let x = width[0]; x <= width[1]; ++x) {
						const self = grid.get(`${x},${y},${z},${w}`);
						const neighbors = offsets.map(([a,b,c,d]) => `${a+x},${b+y},${c+z},${d+w}`)
							.map(x => grid.get(x));
						const active = neighbors.filter(x => x === '#').length;

						let c;
						if (self === '#') {
							c = (active >= 2 && active <= 3) ? '#' : '.';
						} else {
							c = (active === 3) ? '#' : '.';
						}
						newGrid.set(`${x},${y},${z},${w}`, c);
					}
				}
			}
		}

		grid = newGrid;
	}

	return [...grid.values()].filter(x => x === '#').length;
}
