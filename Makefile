.NOTINTERMEDIATE:

FORCE:

%.txt:
	./download_input.sh $*

%a.mjs %b.mjs: %.txt FORCE
	bun $@

