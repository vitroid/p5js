# import sys

# import mistune

# renderer = mistune.Renderer(escape=True, hard_wrap=True)
# markdown = mistune.Markdown(renderer)
# markdown(sys.stdin.read())

import sys

import markdown
import jinja2 as jj

t = jj.Environment(loader=jj.FileSystemLoader(".")).from_string(sys.stdin.read())
output = markdown.markdown(t.render(), extensions=["codehilite", "fenced_code"])
print(output)
