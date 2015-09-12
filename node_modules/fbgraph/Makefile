TESTS = $(shell find tests/*.test.js)

test:
	@NODE_ENV=test vows --spec \
	$(TESTFLAGS) \
	$(TESTS) 

test-cov:
	@TESTFLAGS=--cover-plain $(MAKE) test

.PHONY: test
