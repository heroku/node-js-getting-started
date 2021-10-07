#################################################
# Installing aria2 static builds (q3aql)        #
#################################################

PREFIX=/usr

install:
	mkdir -p /etc/ssl/certs/
	mkdir -p $(PREFIX)/share/man/man1/
	cp aria2c $(PREFIX)/bin
	cp man-aria2c $(PREFIX)/share/man/man1/aria2c.1
	cp ca-certificates.crt /etc/ssl/certs/
	chmod 755 $(PREFIX)/bin/aria2c
	chmod 644 $(PREFIX)/share/man/man1/aria2c.1
	chmod 644 /etc/ssl/certs/ca-certificates.crt
	
uninstall:
	rm $(PREFIX)/bin/aria2c
	rm $(PREFIX)/share/man/man1/aria2c.1
