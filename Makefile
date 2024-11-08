all: index.html README.md
	for d in `ls -d */ | grep -v dist | grep -v git`; do echo $$d; make -C $$d ; done

# deploy to github.io
# deploy:
# 	rsync -av --exclude="docs" * docs
# 	# cd dist; git add .; git commit -am '.'; git push origin gh-pages

README.md: temp_README.md Makefile
	sed -e 's#\[\(.*\)\]\([^(]\)#[\1](https://vitroid.github.io/p5js/\1/)\2#' $< > $@


index.md: temp_README.md Makefile
	sed -e 's#\[\(.*\)\]\([^(]\)#[\1](\1/)\2#' $< > $@

%.html: %.md Makefile header.html footer.html
	cp header.html $@
	python mdcompiler.py $< "" "" >> $@
	cat footer.html >> $@

touch:
	for d in `ls -d */ | grep -v dist | grep -v git`; do make -C $$d touch; done

clean:
	-rm */diff.html