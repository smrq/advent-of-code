const assert = require('assert');
const fs = require('fs');
const input = [fs.readFileSync('21.txt', 'utf-8').trim(), 5];
const tests = [
	[[`../.# => ##./#../...\n.#./..#/### => #..#/..../..../#..#`, 2], 12]
];

function parseInput(input) {
	const book = new Map();
	for (let line of input.split('\n')) {
		let [input, output] = line.split(' => ');
		book.set(input, output);
		book.set(flip(input), output);
		input = rotate(input);
		book.set(input, output);
		book.set(flip(input), output);
		input = rotate(input);
		book.set(input, output);
		book.set(flip(input), output);
		input = rotate(input);
		book.set(input, output);
		book.set(flip(input), output);
	}
	return book;
}

function flip(pattern) {
	return pattern.split('/')
		.map(line => line.split('').reverse().join(''))
		.join('/');
}

function rotate(pattern) {
	pattern = pattern.split('/')
		.map(line => line.split('').reverse());
	pattern = pattern.map((line, y) =>
		line.map((c, x) => pattern[x][y]));
	return pattern.map(line => line.join('')).join('/');
}


function run([input, rounds]) {
	const book = parseInput(input);
	let image = '.#./..#/###';
	for (let i = 0; i < rounds; ++i) {
		image = iterate(image, book);
	}
	return image.split('#').length - 1;
}

function iterate(image, book) {
	const dimension = image.indexOf('/');
	const subdimension = (dimension % 2 === 0) ? 2 : 3;
	const subimages = subdivide(image, dimension, subdimension);
	for (let j = 0; j < subimages.length; ++j) {
		for (let i = 0; i < subimages[j].length; ++i) {
			if (!book.has(subimages[j][i])) throw new Error(subimages[j][i]);
			subimages[j][i] = book.get(subimages[j][i]);
		}
	}
	return join(subimages, (subdimension + 1) * subimages.length, subdimension + 1);
}

function subdivide(image, dimension, subdimension) {
	image = image.split('/');
	return [...Array(dimension / subdimension)].map((_, j) => (
		[...Array(dimension / subdimension)].map((_, i) => (
			[...Array(subdimension)].map((_, y) => (
				image[j*subdimension + y].slice(i*subdimension, (i + 1)*subdimension)
			)).join('/')
		))
	));
}

function join(subimages, dimension, subdimension) {
	return [...Array(dimension)].map((_, j) => {
		const line = subimages[j / subdimension | 0]
			.map(subimage => subimage.split('/')[j % subdimension])
			.join('');
		return line;
	}).join('/');
}

for (let [input, output] of tests) {
	assert.strictEqual(run(input), output);
}
console.log(run(input));
