import fs from 'fs';
const points = fs.readFileSync('10.txt', 'utf-8')
	.trim()
	.split('\n')
	.map(str => {
		const [_, x, y, dx, dy] = /position=<\s*(-?\d+),\s*(-?\d+)> velocity=<\s*(-?\d+),\s*(-?\d+)>/.exec(str);
		return {
			x: parseInt(x, 10),
			y: parseInt(y, 10),
			dx: parseInt(dx, 10),
			dy: parseInt(dy, 10)
		};
	});

let t = 10000;
iteratePoints(points, 10000);

let spread = calculateSpread(points), lastSpread;
do {
	lastSpread = spread;
	iteratePoints(points, 1);
	t += 1;
	spread = calculateSpread(points);
} while (spread < lastSpread);

iteratePoints(points, -1);
t -= 1;

console.log(t);

function calculateSpread(points) {
	const yMin = Math.min(...points.map(p => p.y));
	const yMax = Math.max(...points.map(p => p.y));
	return yMax - yMin;	
}

function iteratePoints(points, t) {
	for (let point of points) {
		point.x += t * point.dx;
		point.y += t * point.dy;
	}	
}

function display(points) {
	const xMin = Math.min(...points.map(p => p.x));
	const xMax = Math.max(...points.map(p => p.x));	
	const yMin = Math.min(...points.map(p => p.y));
	const yMax = Math.max(...points.map(p => p.y));

	let result = '';
	for (let y = yMin; y <= yMax; ++y) {
		for (let x = xMin; x <= xMax; ++x) {
			if (points.some(p => p.x === x && p.y === y)) {
				result += '#';
			} else {
				result += '.';
			}
		}
		result += '\n';
	}
	return result;
}
