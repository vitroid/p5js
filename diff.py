import difflib
import html
import sys
from pathlib import Path

prev_path = Path(sys.argv[1])
curr_path = Path(sys.argv[2])
prev_name = prev_path.parent.name
curr_name = curr_path.parent.name

prev_lines = prev_path.read_text().splitlines()
curr_lines = curr_path.read_text().splitlines()

table = difflib.HtmlDiff(tabsize=2, wrapcolumn=88).make_table(
    prev_lines,
    curr_lines,
    fromdesc=f"{prev_name}/sketch.js",
    todesc=f"{curr_name}/sketch.js",
    context=True,
    numlines=3,
)

print(
    f"""<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(prev_name)} → {html.escape(curr_name)}</title>
  <link rel="stylesheet" href="../style.css">
  <link rel="stylesheet" href="../diff.css">
</head>
<body class="diff-page">
  <div class="diff-shell">
    <header class="diff-hero">
      <a class="diff-back" href="./">← {html.escape(curr_name)}</a>
      <p class="diff-kicker">Code delta</p>
      <h1>
        <span class="diff-from">{html.escape(prev_name)}</span>
        <span class="diff-arrow" aria-hidden="true">→</span>
        <span class="diff-to">{html.escape(curr_name)}</span>
      </h1>
      <p class="diff-lead">前のスケッチから、何行が足され・変わったかを見ます。変化のある付近だけを表示しています。</p>
      <ul class="diff-legend" aria-label="凡例">
        <li><span class="swatch add"></span>追加</li>
        <li><span class="swatch chg"></span>変更</li>
        <li><span class="swatch sub"></span>削除</li>
      </ul>
    </header>
    <div class="diff-frame">
{table}
    </div>
  </div>
</body>
</html>
"""
)
