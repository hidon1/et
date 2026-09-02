from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')

css = r'''

        /* PERSISTENT-HERO-MOTION-2026-09-02 */
        @keyframes persistentHeroMotion {
            0% { transform: scale(1.02) translate3d(0,0,0); opacity: .13; background-position: 50% 50%; }
            45% { transform: scale(1.075) translate3d(-1.2%, .8%, 0); opacity: .19; background-position: 54% 48%; }
            75% { transform: scale(1.045) translate3d(.8%, -1%, 0); opacity: .15; background-position: 47% 53%; }
            100% { transform: scale(1.02) translate3d(0,0,0); opacity: .13; background-position: 50% 50%; }
        }

        body::before {
            content: '';
            position: fixed;
            inset: -5%;
            pointer-events: none;
            z-index: 0;
            background-image:
                linear-gradient(120deg, rgba(35,104,66,.18), rgba(82,183,136,.10), rgba(212,175,55,.08), rgba(35,104,66,.16)),
                url('1.png');
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            mix-blend-mode: multiply;
            will-change: transform, opacity, background-position;
            animation: persistentHeroMotion 18s ease-in-out infinite;
        }

        body > * {
            position: relative;
            z-index: 1;
        }

        .site-content,
        section:not(.hero),
        .features,
        .story-section,
        .terms-highlights,
        .faq-section {
            background-color: rgba(247,252,244,.70) !important;
        }

        @media (max-width: 820px) {
            body::before {
                inset: -8%;
                animation-duration: 22s;
                opacity: .12;
            }
        }
'''

if 'PERSISTENT-HERO-MOTION-2026-09-02' not in s:
    idx = s.rfind('</style>')
    if idx == -1:
        raise SystemExit('style closing tag not found')
    s = s[:idx] + css + '\n' + s[idx:]

p.write_text(s, encoding='utf-8')
