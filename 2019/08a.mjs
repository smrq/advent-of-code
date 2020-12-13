import fs from 'fs';
const input = fs.readFileSync('08.txt', 'utf-8').trim();

function run(input) {
	const w = 25;
	const h = 6;

	const layers = [];
	for (let i = 0; i < input.length; i += w * h) {
		layers.push(input.slice(i, i + w*h));
	}

	layers.sort((a, b) => a.split('0').length - b.split('0').length);

	return (layers[0].split('1').length - 1) *
		(layers[0].split('2').length - 1);
}

console.log(run(input));