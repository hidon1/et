from pathlib import Path
import re

html_path = Path('index.html')
s = html_path.read_text(encoding='utf-8')

# Split the single inline stylesheet into styles.css.
style_match = re.search(r'\n\s*<style>(.*?)</style>', s, flags=re.S)
if not style_match:
    raise SystemExit('Inline <style> block not found')
css = style_match.group(1).strip() + '\n'
Path('styles.css').write_text(css, encoding='utf-8')
s = s[:style_match.start()] + '\n    <link rel="stylesheet" href="styles.css?v=20260903">' + s[style_match.end():]

# Split Firebase module into firebase.js while keeping it as an ES module.
fb_marker = '<!-- מערכת ה-Firebase המקורית כפי שביקשת -->'
fb_pos = s.find(fb_marker)
if fb_pos == -1:
    raise SystemExit('Firebase marker not found')
fb_match = re.search(r'<script\s+type="module">(.*?)</script>', s[fb_pos:], flags=re.S)
if not fb_match:
    raise SystemExit('Firebase module script not found')
fb_abs_start = fb_pos + fb_match.start()
fb_abs_end = fb_pos + fb_match.end()
fb_js = fb_match.group(1).strip() + '\n'
Path('firebase.js').write_text(fb_js, encoding='utf-8')
s = s[:fb_abs_start] + '<script type="module" src="firebase.js?v=20260903"></script>' + s[fb_abs_end:]

# Split main storefront/cart/checkout logic into app.js.
app_marker = '<!-- לוגיקת האתר והסל (Vanilla JS) -->'
app_pos = s.find(app_marker)
if app_pos == -1:
    raise SystemExit('App marker not found')
app_match = re.search(r'<script>(.*?)</script>', s[app_pos:], flags=re.S)
if not app_match:
    raise SystemExit('Main app script not found')
app_abs_start = app_pos + app_match.start()
app_abs_end = app_pos + app_match.end()
app_js = app_match.group(1).strip() + '\n'
Path('app.js').write_text(app_js, encoding='utf-8')
s = s[:app_abs_start] + '<script src="app.js?v=20260903" defer></script>' + s[app_abs_end:]

# Sanity checks: the large inline code blocks must now be external.
if '<style>' in s:
    raise SystemExit('Unexpected inline <style> remains')
if re.search(r'<script(?:\s+type="module")?>\s*[^<\s]', s):
    raise SystemExit('Unexpected inline JavaScript remains')

html_path.write_text(s, encoding='utf-8')

print('Split completed:')
print(' index.html:', html_path.stat().st_size, 'bytes')
print(' styles.css:', Path('styles.css').stat().st_size, 'bytes')
print(' firebase.js:', Path('firebase.js').stat().st_size, 'bytes')
print(' app.js:', Path('app.js').stat().st_size, 'bytes')
