PREFIX ?= /usr/local

.PHONY: install
all: run
install: install-share install-bin

transpile:
	tsc -p tsconfig.json

run: transpile
	node .

install-share: transpile
	mkdir -p $(PREFIX)/share/splatsh/node_modules
	jq "{ dependencies }" < package.json > $(PREFIX)/share/splatsh/package.json
	npm i --only=production --prefix $(PREFIX)/share/splatsh
	# this should be install but idk how to do dirs lol
	cp -r build/* $(PREFIX)/share/splatsh/

install-bin: bin/splatsh
	mkdir -p $(PREFIX)/$(dir $<)
	install -m 0755 $< $(PREFIX)/$<
	
