import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`), 13
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let positions = new Set();

	const knots = [...new Array(2)].map(_ => [0, 0]);
	for (let { dir, dist } of input) {
		for (let i = 0; i < dist; ++i) {
			switch (dir) {
				case 'U': --knots[0][1]; break;
				case 'D': ++knots[0][1]; break;
				case 'L': --knots[0][0]; break;
				case 'R': ++knots[0][0]; break;
			}

			for (let i = 1; i < knots.length; ++i) {
				updateTail(knots[i-1], knots[i]);
			}

			positions.add(knots[knots.length - 1].join(','));
		}
	}

	return positions.size;
}

function updateTail(head, tail) {
	if (Math.abs(head[0] - tail[0]) > 1 || Math.abs(head[1] - tail[1]) > 1) {
		if (head[0] > tail[0]) ++tail[0];
		else if (head[0] < tail[0]) --tail[0];

		if (head[1] > tail[1]) ++tail[1];
		else if (head[1] < tail[1]) --tail[1];
	}
}

function parseInput(str) {
	return str.trim().split('\n').map(line => {
		const [dir, dist] = line.split(' ');
		return { dir, dist: parseInt(dist, 10) };
	});
}
