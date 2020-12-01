const { getRawInput, runTests, astar } = require('../lib');
const rawInput = getRawInput();
const input = parseInput(rawInput);

runTests(input => run(input.replacements, input.molecule), [
	parseInput(
`e => H
e => O
H => HO
H => OH
O => HH

HOH`),
	3,

	parseInput(
`e => H
e => O
H => HO
H => OH
O => HH

HOHOHO`),
	6,
]);

console.log(run(input.replacements, input.molecule));

function run(replacements, molecule) {
	if (molecule === 'e') return 0;
	for (let r of replacements) {
		const re = new RegExp(r[1], 'g');
		let match;
		while (match = re.exec(molecule)) {
			const newMolecule = molecule.slice(0, match.index) + r[0] + molecule.slice(match.index + r[1].length);
			const result = run(replacements, newMolecule);
			if (result != null) {
				return 1 + result;
			}
		}
	}
	return null;
}

function parseInput(str) {
	const [replacementsStr, molecule] = str.split('\n\n');
	const replacements = replacementsStr.split('\n').map(line => line.split(' => '));
	replacements.sort((a, b) => (b[1].length - b[0].length) - (a[1].length - b[0].length));
	return {
		replacements,
		molecule,
	};
}
