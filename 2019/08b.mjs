import fs from 'fs';
const input = fs.readFileSync('08.txt', 'utf-8').trim();

function run(input) {
	const w = 25;
	const h = 6;

	const layers = [];
	for (let i = 0; i < input.length; i += w * h) {
		layers.push(input.slice(i, i + w*h));
	}

	const image = [];
	for (let j = 0; j < h; ++j) {
		let line = '';
		for (let i = 0; i < w; ++i) {
			for (let layer = 0; layer < layers.length; ++layer) {
				const pixel = layers[layer][j*w + i];
				if (pixel !== '2') {
					line += pixel;
					break;
				}
			}
		}
		image.push(line);
	}

	return image.join('\n').replace(/0/g, ' ');
}

console.log(run(input));