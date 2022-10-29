# deploy to github.io
deploy:
	rsync -av --exclude="dist" * dist
	cd dist; git add .; git commit -am '.'; git push origin gh-pages
