from pathlib import Path
import re
p=Path('index.html')
s=p.read_text(encoding='utf-8')
marker='/* STORY-CART-CLEANUP-2026-09-03 */'
if marker not in s:
    css=r'''

/* STORY-CART-CLEANUP-2026-09-03 */
/* אין סל צף בתחתית - רק הסל העליון */
#floatingCartAccess{display:none !important;}

/* תמונת אזור "מהמיון ועד לידיים שלכם": 2.png, עם גיבוי ל-1.png אם 2.png עדיין לא קיימת */
.story-visual{
    background-image:
        linear-gradient(145deg, rgba(18,53,36,.10), rgba(212,175,55,.08)),
        url('2.png'),
        url('1.png') !important;
    background-position:center,center,center !important;
    background-size:cover,cover,cover !important;
    background-repeat:no-repeat !important;
    border-radius:30px !important;
    overflow:hidden !important;
}

/* הבאנר שליד התמונה - מסודר, לבן, עגול ונקי */
.story-copy{
    background:#fff !important;
    border-radius:30px !important;
    padding:34px 32px !important;
    border:1px solid rgba(18,53,36,.10) !important;
    box-shadow:0 20px 52px rgba(18,53,36,.13) !important;
}
.process-list{gap:14px !important;}
.process-step{
    background:#f8fbf7 !important;
    border:1px solid rgba(18,53,36,.08) !important;
    border-radius:18px !important;
    padding:15px 16px !important;
    align-items:center !important;
    box-shadow:none !important;
}
.process-number{
    border-radius:50% !important;
    box-shadow:0 5px 14px rgba(18,53,36,.10);
}

/* הסרת כל קישוט/סמל מלאכותי ממעטפת הסט שלנו */
.shop-layout::before,
.shop-layout::after,
.products-grid::before,
.products-grid::after,
#shop-section::before,
#shop-section::after{
    display:none !important;
    content:none !important;
}

@media(max-width:820px){
    .story-copy{border-radius:24px !important;padding:24px 18px !important;}
    .story-visual{border-radius:24px !important;}
    .process-step{border-radius:16px !important;padding:13px 14px !important;}
}
'''
    s=s.replace('</style>',css+'\n</style>',1)

# Remove the floating cart button itself if it was injected into HTML.
s=re.sub(r'\s*<button[^>]*id=["\']floatingCartAccess["\'][\s\S]*?</button>\s*','\n',s,flags=re.I,count=1)

# Remove JS that creates the floating cart button, if present.
s=re.sub(r'\n\s*if\s*\(!document\.getElementById\(["\']floatingCartAccess["\']\)\)\s*\{[\s\S]*?document\.body\.appendChild\([^;]+\);\s*\}','\n',s,flags=re.I,count=1)

# Keep upper cart only; make sure it remains visible.
s=s.replace("document.getElementById('cartCount').innerText = totalItems;", "document.getElementById('cartCount').innerText = totalItems;", 1)

p.write_text(s,encoding='utf-8')
