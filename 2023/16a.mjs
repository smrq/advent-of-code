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
..//.|....`), 46,
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const energized = new Map();

	let working = [[-1, 0, 'right']];

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

function parseInput(str) {
	return L.autoparse(str);
}
