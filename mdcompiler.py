# import sys

# import mistune

# renderer = mistune.Renderer(escape=True, hard_wrap=True)
# markdown = mistune.Markdown(renderer)
# markdown(sys.stdin.read())

import sys

import markdown

output = markdown.markdown(sys.stdin.read(), extensions=['codehilite', 'fenced_code'])
print(output)
