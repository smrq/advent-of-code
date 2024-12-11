import * as L from '../lib.mjs';

L.runTests(args => run(args), [
	parseInput(`2333133121414131402`), 2858
]);

const input = parseInput(L.getRawInput());
console.log(run(input));

function run(input) {
	let files = [];
	for (let i = 0, position = 0; i < input.length; ++i) {
		const size = input[i];
		if (i % 2 === 0) {
			files.push({ id: files.length, position, size });
		}
		position += size;
	}

	for (let id = files.length - 1; id >= 0; --id) {
		const fileIdx = files.findIndex(file => file.id === id);
		const file = files[fileIdx];
		for (let i = 0; files[i].position < file.position; ++i) {
			const start = files[i].position + files[i].size;
			const end = files[i+1].position;
			const free = end - start;
			if (free >= file.size) {
				files.splice(fileIdx, 1);
				files.splice(i+1, 0, file);
				file.position = start;
				break;
			}
		}
	}

	return checksum(files);
}

function checksum(files) {
	let result = 0;
	for (let file of files) {
		for (let i = 0; i < file.size; ++i) {
			result += file.id * (file.position + i);
		}
	}
	return result;
}

function parseInput(str) {
	return str.trim().split('').map(x => parseInt(x, 10));
}
