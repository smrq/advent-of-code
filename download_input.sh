if [ "$#" -ne 1 ]; then
	echo "Usage: $0 YYYY/DD"
	exit 1
fi

SESSION=$(cat session.txt)
YEAR=$(echo "$1" | cut -d'/' -f1)
DAY=$(echo "$1" | cut -d'/' -f2 | sed 's/^0*//')

URL="https://adventofcode.com/${YEAR}/day/${DAY}/input"
FILE="$1.txt"

curl "${URL}" \
	-H "Cookie:session=${SESSION}" \
	-o ${FILE}

echo "Downloaded input to ${FILE}"
