# deploy to github.io
deploy:
	rsync -av --exclude="dist" * dist
	cd dist; git add .; git commit -am '.'; git push origin gh-pages

README.md: template.md Makefile
	sed -e 's#\[\(.*\)\]#[\1](https://vitroid.github.io/p5js/\1/)#' $< > $@

index.md: template.md Makefile
	sed -e 's#\[\(.*\)\]#[\1](\1/)#' $< > $@

%.html: %.md
	cp header.html $@
	python mdcompiler.py < $< >> $@
	cat footer.html >> $@
