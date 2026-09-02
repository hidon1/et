from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')
marker = '</style>'
css = r'''

        /* MOTION-STACK-FINAL-2026-09-02 */
        body::before {
            z-index: 2 !important;
            opacity: .26 !important;
            mix-blend-mode: normal !important;
        }

        .site-content {
            position: relative !important;
            z-index: 1 !important;
            background: transparent !important;
        }

        .site-content > section,
        .site-content > .features,
        .site-content > .story-section,
        .site-content > .terms-highlights,
        .site-content > .faq-section {
            position: relative;
            z-index: 1;
            background: rgba(247,252,244,.42) !important;
        }

        .site-content > section > .container,
        .site-content > .container,
        .features > .container,
        .story-section > .container,
        .terms-highlights > .container,
        .faq-section > .container,
        .shop-layout {
            position: relative;
            z-index: 3;
        }

        header,
        .hero,
        footer,
        .modal-overlay,
        .product-details-overlay {
            z-index: 5 !important;
        }

        @media (max-width: 820px) {
            body::before { opacity: .22 !important; }
        }
'''
if 'MOTION-STACK-FINAL-2026-09-02' not in s:
    idx = s.rfind(marker)
    if idx == -1:
        raise SystemExit('style closing tag not found')
    s = s[:idx] + css + '\n' + s[idx:]
p.write_text(s, encoding='utf-8')
