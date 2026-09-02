from pathlib import Path
p=Path('index.html')
s=p.read_text(encoding='utf-8')
marker='</style>'
css='''\n        /* MOTION-LAYER-ABOVE-SECTIONS-2026-09-02 */\n        body::before {\n            z-index: 2 !important;\n            opacity: .24 !important;\n            mix-blend-mode: normal !important;\n            filter: saturate(1.08) contrast(1.03);\n        }\n\n        body > * {\n            position: relative;\n            z-index: 3;\n        }\n\n        .site-content,\n        section:not(.hero),\n        .features,\n        .story-section,\n        .terms-highlights,\n        .faq-section {\n            background-color: rgba(247,252,244,.58) !important;\n        }\n\n        .shop-layout,\n        .feature-card,\n        .terms-card,\n        .faq-item,\n        .product-card,\n        .story-copy,\n        .process-step {\n            position: relative;\n            z-index: 4;\n        }\n\n        header,\n        .hero,\n        footer,\n        .modal-overlay,\n        .product-details-overlay {\n            position: relative;\n            z-index: 5;\n        }\n\n        @media (max-width: 820px) {\n            body::before { opacity: .20 !important; }\n        }\n'''
if 'MOTION-LAYER-ABOVE-SECTIONS-2026-09-02' not in s:
    idx=s.rfind(marker)
    if idx<0: raise SystemExit('style tag not found')
    s=s[:idx]+css+'\n'+s[idx:]
p.write_text(s,encoding='utf-8')
