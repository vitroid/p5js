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


nav_links = ['<a href="..">Index</a>']

code = Path("sketch.js")
if code.exists():
    nav_links.append(
        f'<a href="https://github.com/vitroid/p5js/blob/main/{dir}/sketch.js">コード</a>'
    )

if prev != "":
    nav_links.append(f'<a href="../{prev}">前: {prev}</a>')
    nav_links.append('<a href="diff.html">差分</a>')

nav_html = '<nav class="lesson-nav">\n' + "\n".join(nav_links) + "\n</nav>\n\n"

if next != "":
    next_html = f"""

<nav class="lesson-next">
<a href="../{next}"><span><span class="next-label">Next</span><br><span class="next-title">{next}</span></span><span class="next-arrow">→</span></a>
</nav>

"""
    lines.append(next_html)

lines = nav_html + "".join(lines)
t = jj.Environment(loader=jj.FileSystemLoader(".")).from_string(lines)
logger.info(t)
output = markdown.markdown(t.render(), extensions=["codehilite", "fenced_code"])
print(output)
