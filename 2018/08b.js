const fs = require('fs');

// const raw = '2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2'
// 	.split(' ')
// 	.map(x => +x);
const raw = fs.readFileSync('08.txt', 'utf-8')
	.trim()
	.split(' ')
	.map(x => +x);

const tree = parseData(raw);
console.log(checksum(tree));

function parseData(data) {
	const [root] = parseNode(data, 0);
	return root;

	function parseNode(data, cursor) {
		const childNodes = data[cursor++];
		const metadataEntries = data[cursor++];
		const node = { metadata: [], children: [] };
		for (let i = 0; i < childNodes; ++i) {
			const [child, nextCursor] = parseNode(data, cursor);
			node.children.push(child);
			cursor = nextCursor;
		}
		for (let i = 0; i < metadataEntries; ++i) {
			node.metadata.push(data[cursor++]);
		}

		return [node, cursor];
	}
}

function checksum(tree) {
	if (!tree) {
		return 0;
	} else if (tree.children.length === 0) {
		return tree.metadata
			.reduce((acc, n) => acc + n, 0);
	} else {
		return tree.metadata
			.reduce((acc, n) => acc + checksum(tree.children[n - 1]), 0);
	}
}
