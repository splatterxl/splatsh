PREFIX ?= /usr/local

.PHONY: install uninstall transpile run clean
all: run
install: install-share install-bin

transpile:
	tsc -p tsconfig.json

run: transpile
	node .

clean:
	rm -rf build

uninstall:
	rm -rf $(PREFIX)/share/splatsh
	rm $(PREFIX)/bin/splatsh

install-share: transpile
	mkdir -p $(PREFIX)/share/splatsh/node_modules
	node -e 'console.log(JSON.stringify({ dependencies: require("./package.json").dependencies }))' > $(PREFIX)/share/splatsh/package.json
	npm i --only=production --prefix $(PREFIX)/share/splatsh
	ln -s build $(PREFIX)/share/splatsh

install-bin: bin/splatsh
	mkdir -p $(PREFIX)/$(dir $<)
	install -m 0755 $< $(PREFIX)/$<

install-deps:
	npm i --only=production
