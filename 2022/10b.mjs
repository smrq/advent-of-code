import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`), `##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....`
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let X = 1;
	let cycle = 0;
	let result = [''];

	function cycleStart() {
		if (result[result.length-1].length === 40) {
			result.push('');
		}
		const currentPixel = cycle % 40;
		if (Math.abs(X - currentPixel) <= 1) {
			result[result.length-1] += '#';
		} else {
			result[result.length-1] += '.';
		}
	}

	function cycleEnd() {
		++cycle;
	}

	for (let inst of input) {
		switch (inst.opcode) {
			case 'addx':
				cycleStart();
				cycleEnd();
				cycleStart();
				cycleEnd();
				X += inst.args[0];
				break;
			case 'noop':
				cycleStart();
				cycleEnd();
				break;
		}
	}

	return result.join('\n');
}

function parseInput(str) {
	return L.autoparse(str);
}
