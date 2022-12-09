import { inspect } from 'util';
import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`), 95437
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	const fs = { dirs: {}, fileSize: 0 };
	let cwd = [];

	for (let { cmd, args, output } of input) {
		switch (cmd) {
			case 'cd':
				if (args[0] === '..') {
					cwd.pop();
				} else if (args[0] === '/') {
					cwd = [];
				} else {
					cwd.push(args[0]);
				}
				break;

			case 'ls':
				const dir = cwd.reduce((dir, name) => dir.dirs[name], fs);
				for (let x of output) {
					const [size, name] = x.split(' ');
					if (size === 'dir') {
						dir.dirs[name] = { dirs: {}, fileSize: 0 };
					} else {
						dir.fileSize += parseInt(size, 10);
					}
				}
				break;
		}
	}

	let result = 0;

	(function calculateTotalSize(dir) {
		dir.totalSize = dir.fileSize;
		for (let subdir of Object.values(dir.dirs)) {
			dir.totalSize += calculateTotalSize(subdir);
		}
		if (dir.totalSize <= 100_000) {
			result += dir.totalSize;
		}
		return dir.totalSize;
	})(fs);

	return result;
}

function parseInput(str) {
	return str.split('$ ').slice(1).map(x => {
		const [cmdArgs, ...output] = x.trim().split('\n');
		const [cmd, ...args] = cmdArgs.split(' ');
		return { cmd, args, output };
	});
}
