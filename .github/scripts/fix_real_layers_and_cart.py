from pathlib import Path
p=Path('index.html')
s=p.read_text(encoding='utf-8')

css=r'''

/* REAL-LAYER-CART-FIX-2026-09-03 */
/* תמונת הרקע נשארת מאחורי כל התוכן, ולא מעליו */
body::before{
    z-index:0 !important;
    opacity:.24 !important;
    mix-blend-mode:normal !important;
    pointer-events:none !important;
}
body > *{
    position:relative;
}
.site-content{
    z-index:1 !important;
    background:transparent !important;
    isolation:auto !important;
}
.site-content > section,
.site-content > .features,
.site-content > .story-section,
.site-content > .terms-highlights,
.site-content > .faq-section,
section:not(.hero),
.features,
.story-section,
.terms-highlights,
.faq-section{
    background:rgba(247,252,244,.24) !important;
    backdrop-filter:none !important;
}
/* כל באנר/כרטיס שמכיל תוכן אטום לחלוטין */
.shop-layout,
.product-card,
.feature-card,
.terms-card,
.faq-item,
.story-copy,
.process-step,
.product-details-window.product-details-banner,
.modal-window,
.cart-window,
.checkout-window,
.checkout-card,
.checkout-summary,
.checkout-order-summary,
.cart-summary,
.cart-item{
    position:relative;
    z-index:2;
    background:#fff !important;
    background-color:#fff !important;
    opacity:1 !important;
    backdrop-filter:none !important;
}
.shop-layout,
.product-card,
.feature-card,
.terms-card,
.faq-item,
.story-copy,
.process-step{
    box-shadow:0 18px 48px rgba(18,53,36,.14) !important;
    border-color:rgba(18,53,36,.12) !important;
}
header{
    z-index:5000 !important;
}
.hero{
    z-index:2 !important;
}
footer{
    z-index:2 !important;
}
/* חלונות סל ותשלום תמיד מעל כל האתר */
.modal-overlay,
#cartModal,
#checkoutModal,
#successModal,
#termsModal{
    position:fixed !important;
    inset:0 !important;
    z-index:100000 !important;
}
.modal-overlay.active,
#cartModal.active,
#checkoutModal.active,
#successModal.active,
#termsModal.active{
    visibility:visible !important;
    opacity:1 !important;
    pointer-events:auto !important;
}
/* סל עליון ברור */
.cart-icon-btn{
    display:inline-flex !important;
    visibility:visible !important;
    opacity:1 !important;
    align-items:center !important;
    justify-content:center !important;
    width:48px !important;
    height:48px !important;
    border-radius:14px !important;
    background:#fff !important;
    color:#123524 !important;
    border:2px solid #d4af37 !important;
    box-shadow:0 8px 24px rgba(0,0,0,.18) !important;
    cursor:pointer !important;
}
/* כפתור סל קבוע נוסף כדי שהגישה לסל תהיה תמיד ברורה */
#floatingCartAccess{
    position:fixed;
    left:18px;
    bottom:22px;
    z-index:90000;
    border:0;
    border-radius:999px;
    background:#123524;
    color:#fff;
    padding:13px 18px;
    display:flex;
    align-items:center;
    gap:9px;
    font:inherit;
    font-weight:900;
    box-shadow:0 14px 34px rgba(18,53,36,.28);
    cursor:pointer;
}
#floatingCartAccess .float-cart-count{
    min-width:24px;
    height:24px;
    padding:0 6px;
    border-radius:999px;
    display:grid;
    place-items:center;
    background:#d4af37;
    color:#123524;
    font-size:.78rem;
}
/* פעולות המוצר ברורות ולא אייקון נסתר */
.product-footer > div:last-child{
    flex-wrap:wrap;
}
.add-to-cart-btn:not(.product-details-actions .add-to-cart-btn){
    min-width:132px;
}
@media(max-width:820px){
    body::before{opacity:.19 !important;}
    .site-content > section,
    section:not(.hero),.features,.story-section,.terms-highlights,.faq-section{
        background:rgba(247,252,244,.28) !important;
    }
    #floatingCartAccess{left:12px;bottom:14px;padding:11px 14px;}
}
'''
if 'REAL-LAYER-CART-FIX-2026-09-03' not in s:
    s=s.replace('</style>', css+'\n</style>', 1)

old='''                                <button class="add-to-cart-btn icon-only" onclick="event.stopPropagation(); addToCart(${p.id})" title="הוספה לסל" aria-label="הוספה לסל">\n                                    <i class="fa-solid fa-cart-plus"></i>\n                                </button>'''
new='''                                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${p.id})" title="הוספה לסל" aria-label="הוספה לסל">\n                                    <i class="fa-solid fa-cart-plus"></i> הוספה לסל\n                                </button>'''
if old in s:
    s=s.replace(old,new,1)

# Add a permanent floating cart access button.
float_btn='''\n    <button id="floatingCartAccess" type="button" onclick="openCartModal()" aria-label="פתיחת סל הקניות">\n        <i class="fa-solid fa-cart-shopping"></i>\n        <span>סל קניות</span>\n        <span class="float-cart-count" id="floatingCartCount">0</span>\n    </button>\n'''
if 'id="floatingCartAccess"' not in s:
    marker='    <a href="#" class="whatsapp-float"'
    idx=s.find(marker)
    if idx!=-1:
        s=s[:idx]+float_btn+s[idx:]

old_update="""        function updateCartUI() {\n            const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);\n            document.getElementById('cartCount').innerText = totalItems;\n        }"""
new_update="""        function updateCartUI() {\n            const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);\n            const topCount = document.getElementById('cartCount');\n            const floatingCount = document.getElementById('floatingCartCount');\n            if (topCount) topCount.innerText = totalItems;\n            if (floatingCount) floatingCount.innerText = totalItems;\n        }"""
if old_update in s:
    s=s.replace(old_update,new_update,1)

# Make sure the checkout summary refreshes every time direct checkout opens.
old_buy="""            updateCartUI();\n            openCheckoutPage();\n        }\n\n        function addToCart(id)"""
new_buy="""            updateCartUI();\n            openCheckoutPage();\n            if (typeof updateCheckoutSummary === 'function') updateCheckoutSummary();\n        }\n\n        function addToCart(id)"""
if old_buy in s:
    s=s.replace(old_buy,new_buy,1)

p.write_text(s,encoding='utf-8')
