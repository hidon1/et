from pathlib import Path
p=Path('index.html')
s=p.read_text(encoding='utf-8')
marker='/* STRONGER-PERSISTENT-BG-2026-09-03 */'
css="""

        /* STRONGER-PERSISTENT-BG-2026-09-03 */
        body::before {
            opacity: .62 !important;
            filter: saturate(1.12) contrast(1.05) !important;
        }

        .site-content,
        section:not(.hero),
        .features,
        .story-section,
        .terms-highlights,
        .faq-section {
            background-color: rgba(247,252,244,.28) !important;
        }

        .shop-layout,
        .feature-card,
        .terms-card,
        .faq-item,
        .product-card,
        .story-copy,
        .process-step {
            background-color: rgba(255,255,255,.84) !important;
        }

        @media (max-width: 820px) {
            body::before { opacity: .52 !important; }
        }
"""
if marker not in s:
    i=s.rfind('</style>')
    if i<0: raise SystemExit('style tag not found')
    s=s[:i]+css+'\n'+s[i:]
p.write_text(s,encoding='utf-8')
