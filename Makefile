# deploy to github.io
deploy:
	cd dist; git add .; git commit -am '.'; git push origin gh-pages
