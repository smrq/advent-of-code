import * as L from '../lib.mjs';

L.runTests(args => run(...args), [
	[parseInput(`Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`), 10], 26
]);

const input = parseInput(L.getRawInput());
console.log(run(input, 2_000_000));

function run(input, y) {
	const ranges = generateXRanges(input, y);
	const combined = combineRanges(ranges);
	return L.sum(combined.map((([start, stop]) => stop - start)));
}

function generateXRanges(input, y) {
	return input.filter(({ sensor, range }) => Math.abs(sensor[1] - y) <= range)
		.map(({ sensor, range }) => [
			sensor[0] - (range - Math.abs(sensor[1] - y)),
			sensor[0] + (range - Math.abs(sensor[1] - y)),
		]);
}

function combineRanges(ranges) {
	let result = [];
	for (let range of ranges) {
		let spliceStart = result.findIndex(r => r[1] >= range[0]);
		let spliceEnd = result.findLastIndex(r => r[0] <= range[1]);

		let [start, end] = range;
		if (spliceEnd === -1) {
			spliceStart = 0;
		}
		else if (spliceStart === -1) {
			spliceStart = result.length;
		}
		else if (spliceStart <= spliceEnd) {
			const spliced = result.splice(spliceStart, spliceEnd - spliceStart + 1);
			start = Math.min(start, spliced[0][0]);
			end = Math.max(end, spliced[spliced.length-1][1]);
		}
		result.splice(spliceStart, 0, [start, end]);
	}
	return result;
}

function parseInput(str) {
	return str.trim().split('\n').map(line => {
		let [_, sx, sy, bx, by] = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/.exec(line);
		sx = parseInt(sx, 10);
		sy = parseInt(sy, 10);
		bx = parseInt(bx, 10);
		by = parseInt(by, 10);
		const range = Math.abs(sx - bx) + Math.abs(sy - by);
		return { sensor: [sx, sy], beacon: [bx, by], range };
	});
}
