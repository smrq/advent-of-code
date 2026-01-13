import * as L from '../lib.mjs';

await L.runTests(args => run(args), [
	parseInput(
		`7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`
	), 24
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(points) {
	const compressed = compress(points);
	const map = plot(compressed);
	// L.D(map.map(line => line.join('')).join('\n'));

	const rects = compressed
		.flatMap((p, i) => compressed.slice(i+1).map((q, j) => {
			const rect = getRect(...points[i], ...points[i+1+j]);
			const compressedRect = getRect(...p, ...q);
			return {
				rect,
				compressedRect,
				area: area(...rect),
			};
		}))
		.sort((a, b) => b.area - a.area);
	const result = rects.find(r => isValidRect(map, ...r.compressedRect));
	return result.area;
}

function compress(points) {
	const xs = [...new Set(points.map(p => p[0]))].sort((a, b) => a - b);
	const ys = [...new Set(points.map(p => p[1]))].sort((a, b) => a - b);
	const compressed = points.map(p => [xs.indexOf(p[0]) + 1, ys.indexOf(p[1]) + 1]);
	return compressed;
}

function plot(points) {
	const w = Math.max(...points.map(p => p[0])) + 2;
	const h = Math.max(...points.map(p => p[1])) + 2;
	const map = [...Array(h)].map(() => (
		[...Array(w)].map(() => 'X')
	));

	for (let i = 0; i < points.length; ++i) {
		drawRect(map, '#', ...getRect(...points[i], ...points[(i+1)%points.length]));
	}
	
	flood(map, 0, 0, '.');

	return map;
}

function flood(map, startX, startY, char) {
	map[startY][startX] = char;

	const working = [[startX, startY]];
	while (working.length) {
		const [x, y] = working.shift();
		map[y][x] = char;
		for (let [dy, dx] of L.orthogonalOffsets(2)) {
			if (L.inBounds(map, y+dy, x+dx) && map[y+dy][x+dx] === 'X') {
				map[y+dy][x+dx] = char;
				working.push([x+dx, y+dy]);
			}
		}
	}
}

function drawRect(map, char, x1, y1, x2, y2) {
	for (let x = x1; x <= x2; ++x) {
		for (let y = y1; y <= y2; ++y) {
			map[y][x] = char;
		}
	}
}

function getRect(x1, y1, x2, y2) {
	return [
		Math.min(x1, x2),
		Math.min(y1, y2),
		Math.max(x1, x2),
		Math.max(y1, y2),
	];
}

function area(x1, y1, x2, y2) {
	return (x2 - x1 + 1) * (y2 - y1 + 1);
}

function isValidRect(map, x1, y1, x2, y2) {
	for (let x = x1; x <= x2; ++x) {
		if (map[y1][x] === '.') return false;
		if (map[y2][x] === '.') return false;
	}

	for (let y = y1; y <= y2; ++y) {
		if (map[y][x1] === '.') return false;
		if (map[y][x2] === '.') return false;
	}

	return true;
}

function parseInput(str) {
	return L.autoparse(str);
}
