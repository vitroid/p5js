all: $(patsubst %.png, %.tn.jpg, $(wildcard *.png))
%.tn.jpg: %.png Makefile
	sips -Z 32 $< --out $@
