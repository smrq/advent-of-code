const { getRawInput, runTests } = require('../lib');
const rawInput = getRawInput();
const input = parseInput(rawInput);

runTests(run, [

	parseInput(
`H => HO
H => OH
O => HH

HOH`),
	4,

	parseInput(
`H => HO
H => OH
O => HH

HOHOHO`),
	7,
]);

console.log(run(input, 100));

function run({ replacements, molecule }) {
	const resultSet = new Set();

	for (let i = 0; i < molecule.length; ++i) {
		for (let r of replacements) {
			if (r[0] === molecule.slice(i, i + r[0].length)) {
				resultSet.add(molecule.slice(0, i) + r[1] + molecule.slice(i+r[0].length));
			}
		}
	}

	return resultSet.size;
}

function parseInput(str) {
	const [replacementsStr, molecule] = str.split('\n\n');
	const replacements = replacementsStr.split('\n').map(line => line.split(' => '));
	return {
		replacements,
		molecule,
	};
}
