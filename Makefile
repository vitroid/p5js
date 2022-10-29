# deploy to github.io
deploy:
	cp -a * dist/
	cd dist; git add .; git commit -am '.'; git push origin gh-pages
