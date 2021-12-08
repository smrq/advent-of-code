import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`), 61229
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	return L.sum(input.map(line => {
		let [signals, display] = line.split(' | ');
		signals = signals.split(' ');
		display = display.split(' ');

		const d1 = signals.find(s => s.length === 2).split('');
		const d7 = signals.find(s => s.length === 3).split('');
		const d4 = signals.find(s => s.length === 4).split('');

		const a = L.arrayDifference(d7, d1)[0];
		const b = 'abcdefg'.split('').find(x => signals.filter(s => s.includes(x)).length === 6);
		const e = 'abcdefg'.split('').find(x => signals.filter(s => s.includes(x)).length === 4);
		const f = 'abcdefg'.split('').find(x => signals.filter(s => s.includes(x)).length === 9);
		const c = d7.find(x => ![a, f].includes(x));
		const d = d4.find(x => ![b, c, f].includes(x));
		const g = 'abcdefg'.split('').find(x => ![a, b, c, d, e, f].includes(x));

		const values = [
			[a, b, c, e, f, g].sort().join(''),
			[c, f].sort().join(''),
			[a, c, d, e, g].sort().join(''),
			[a, c, d, f, g].sort().join(''),
			[b, c, d, f].sort().join(''),
			[a, b, d, f, g].sort().join(''),
			[a, b, d, e, f, g].sort().join(''),
			[a, c, f].sort().join(''),
			[a, b, c, d, e, f, g].sort().join(''),
			[a, b, c, d, f, g].sort().join(''),
		];

		return +display
			.map(d => values.indexOf(d.split('').sort().join('')))
			.join('');
	}));
}

function parseInput(str) {
	return L.autoparse(str);
}
