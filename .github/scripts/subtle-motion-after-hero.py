from pathlib import Path
p=Path('index.html')
s=p.read_text(encoding='utf-8')
marker='/* SUBTLE-MOTION-AFTER-HERO-2026-09-03 */'
if marker not in s:
    css=r'''

        /* SUBTLE-MOTION-AFTER-HERO-2026-09-03 */
        body::before {
            opacity: .11 !important;
            filter: saturate(.94) contrast(.98) !important;
        }

        .site-content,
        section:not(.hero),
        .features,
        .story-section,
        .terms-highlights,
        .faq-section {
            background-color: rgba(247,252,244,.86) !important;
        }

        .shop-layout {
            background: rgba(255,255,255,.95) !important;
        }

        .product-card,
        .feature-card,
        .terms-card,
        .faq-item,
        .story-copy,
        .process-step {
            background-color: rgba(255,255,255,.96);
        }

        .hero {
            position: relative;
            z-index: 5;
        }

        @media (max-width: 820px) {
            body::before { opacity: .08 !important; }
            .site-content,
            section:not(.hero),
            .features,
            .story-section,
            .terms-highlights,
            .faq-section { background-color: rgba(247,252,244,.90) !important; }
        }
'''
    s=s.replace('</style>', css+'\n</style>',1)
p.write_text(s,encoding='utf-8')
