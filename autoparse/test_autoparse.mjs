import assert from 'assert';
import fs from 'fs';
import { D, autoparse } from '../lib.mjs';

let failures = [];

testFolder('alphnumberlist');
testFolder('alphtuples');
testFolder('arrows');
testFolder('grid');
testFolder('instructions');
testFolder('number');
testFolder('numberlist');
testFolder('numbertuples');
testFolder('string');
testFolder('stringlist');

// testFolder('madlibs');

function testFolder(folder) {
	for (let file of fs.readdirSync(folder).filter(file => /\.txt$/.test(file))) {
		test(`${folder}/${file}`);
	}
}

function test(file) {
	try {
		const input = fs.readFileSync(file, 'utf-8').replace(/\n$/, '');
		const parsed = autoparse(input);
		const expected = JSON.parse(fs.readFileSync(file.replace(/\.txt$/, '.json'), 'utf-8'));
		assert.deepStrictEqual(parsed, expected);
	} catch (e) {
		D(file);
		D(e);
		failures.push(file);
	}
}

D(`${failures.length} files failed to parse.`);
for (let f of failures) {
	D(`   ${f}`);
}