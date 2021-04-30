PREFIX ?= /usr/local

.PHONY: install
all: run
install: install-share install-bin

transpile:
	tsc -p tsconfig.json

run: transpile
	node .

install-share:
	mkdir -p $(PREFIX)/share/splatsh/node_modules
	install -m 0644 package.json $(PREFIX)/share/splatsh/package.json
	(cd $(PREFIX)/share/splatsh && npm i)
	install -m 0644 tsconfig.json $(PREFIX)/share/splatsh/tsconfig.json
	# this should be install but idk how to do dirs lol
	cp -r src $(PREFIX)/share/splatsh/src
	tsc -p $(PREFIX)/share/splatsh/tsconfig.json

install-bin: bin/splatsh
	mkdir -p $(PREFIX)/$(dir $<)
	install -m 0755 $< $(PREFIX)/$<
	
