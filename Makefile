bin = ./node_modules/.bin

test:
	@$(bin)/mocha -R spec

test-cover:
	@$(bin)/istanbul cover $(bin)/_mocha \
		-- -u exports

.PHONY: test test-cover
