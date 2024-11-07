# import sys

# import mistune

# renderer = mistune.Renderer(escape=True, hard_wrap=True)
# markdown = mistune.Markdown(renderer)
# markdown(sys.stdin.read())

import sys
from pathlib import Path, PurePath

import markdown
import jinja2 as jj
from logging import getLogger, basicConfig, INFO

basicConfig(level=INFO)
logger = getLogger()

mdfile = sys.argv[1]
prev = sys.argv[2]  # may be empty
next = sys.argv[3]  # may be empty

dir = PurePath(Path.cwd()).parts[-1]
logger.info(dir)

with open(mdfile) as f:
    lines = f.readlines()


if prev != "":
    link = f"* 一つ前の[{prev}](../{prev})との[差分](diff.html)\n"
    lines.insert(0, link)

code = Path("sketch.js")
if code.exists():
    link = f"* [コード](https://github.com/vitroid/p5js/blob/main/{dir}/sketch.js)\n"
    lines.insert(0, link)

if next != "":
    link = f"\n\n[次: {next}](../{next})\n\n"
    lines.append(link)

link = f"* [Index](..)\n"
lines.insert(0, link)

lines = "".join(lines)
t = jj.Environment(loader=jj.FileSystemLoader(".")).from_string(lines)
logger.info(t)
output = markdown.markdown(t.render(), extensions=["codehilite", "fenced_code"])
print(output)
