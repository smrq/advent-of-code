import { getRawInput, autoparse, runTests, orthodiagonalOffsets } from '../lib.mjs';

const input = autoparse(getRawInput());

runTests(args => run(args), [
autoparse(`.#.
..#
###`), 112
]);

console.log(run(input));

function run(input) {
	let grid = new Map();
	for (let y = 0; y < input.length; ++y) {
		for (let x = 0; x < input[0].length; ++x) {
			grid.set(`${x},${y},0`, input[y][x]);
		}
	}

	let depth = [0,0];
	let height = [0,input.length-1];
	let width = [0,input[0].length-1];
	let offsets = orthodiagonalOffsets(3);

	for (let i = 0; i < 6; ++i) {
		let newGrid = new Map();

		--depth[0]; ++depth[1];
		--width[0]; ++width[1];
		--height[0]; ++height[1];

		for (let z = depth[0]-1; z <= depth[1]+1; ++z) {
			for (let y = height[0]-1; y <= height[1]+1; ++y) {
				for (let x = width[0]-1; x <= width[1]+1; ++x) {
					const self = grid.get(`${x},${y},${z}`);
					const neighbors = offsets.map(([a,b,c]) => `${a+x},${b+y},${c+z}`)
						.map(x => grid.get(x));
					const active = neighbors.filter(x => x === '#').length;
					
					let c;
					if (self === '#') {
						c = (active >= 2 && active <= 3) ? '#' : '.';
					} else {
						c = (active === 3) ? '#' : '.';
					}
					newGrid.set(`${x},${y},${z}`, c);
				}
			}
		}

		grid = newGrid;
	}

	return [...grid.values()].filter(x => x === '#').length;
}
