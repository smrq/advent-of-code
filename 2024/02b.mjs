import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`), 4
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	return input.filter(isKindaSafe).length;
}

function isKindaSafe(report) {
	if (isSafe(report)) {
		return true;
	}
	for (let i = 0; i < report.length; ++i) {
		const newReport = report.slice();
		newReport.splice(i, 1);
		if (isSafe(newReport)) {
			return true;
		}
	}
	return false;
}

function isSafe(report) {
	const asc = report[0] < report[1];
	for (let i = 1; i < report.length; ++i) {
		if ((report[i-1] < report[i]) !== asc) {
			return false;
		}
		const diff = Math.abs(report[i] - report[i-1]);
		if (diff < 1 || diff > 3) {
			return false;
		}
	}
	return true;
}

function parseInput(str) {
	return L.autoparse(str);
}
