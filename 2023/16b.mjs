import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`), 51,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));


function test(input, startX, startY, startDir) {
	const energized = new Map();

	let working = [[startX, startY, startDir]];

	while (working.length) {
		let [x, y, dir] = working.shift();
		x +=
			dir === 'left' ? -1 :
			dir === 'right' ? 1 :
			0;
		y +=
			dir === 'up' ? -1 :
			dir === 'down' ? 1 :
			0;

		const tile = input[y] && input[y][x];
		if (!tile) continue;

		const key = `${x},${y}`;
		if (!energized.has(key)) {
			energized.set(key, new Set());
		}
		const dirs = energized.get(key);
		if (dirs.has(dir)) continue;
		dirs.add(dir);

		switch (tile) {
			case '.':
				working.push([x, y, dir]);
				break;

			case '|':
				if (dir === 'left' || dir === 'right') {
					working.push([x, y, 'up']);
					working.push([x, y, 'down']);
				} else {
					working.push([x, y, dir]);
				}
				break;

			case '-':
				if (dir === 'up' || dir === 'down') {
					working.push([x, y, 'left']);
					working.push([x, y, 'right']);
				} else {
					working.push([x, y, dir]);
				}
				break;

			case '/': {
				const newDir =
					dir === 'up' ? 'right' :
					dir === 'right' ? 'up' :
					dir === 'down' ? 'left' :
					'down';
				working.push([x, y, newDir]);
				break;	
			}

			case '\\': {
				const newDir =
					dir === 'up' ? 'left' :
					dir === 'right' ? 'down' :
					dir === 'down' ? 'right' :
					'up';
				working.push([x, y, newDir]);
				break;
			}
		}
	}

	return energized.size;
}

function run(input) {
	let max = -Infinity;
	for (let y = 0; y < input.length; ++y) {
		max = Math.max(max,
			test(input, -1, y, 'right'),
			test(input, input[0].length, y, 'left'),
		);
	}
	for (let x = 0; x < input[0].length; ++x) {
		max = Math.max(max,
			test(input, x, -1, 'down'),
			test(input, x, input.length, 'up'),
		);
	}
	return max;
}

function parseInput(str) {
	return L.autoparse(str);
}
