import difflib
import sys

file1 = open(sys.argv[1]).readlines()
file2 = open(sys.argv[2]).readlines()
print(difflib.HtmlDiff().make_file(file1, file2))
