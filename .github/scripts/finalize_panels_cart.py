from pathlib import Path
p=Path('index.html')
s=p.read_text(encoding='utf-8')

css=r'''

/* FINAL-OPAQUE-PANELS-CART-2026-09-03 */
body::before{
  opacity:.24 !important;
  filter:saturate(1.02) contrast(1.01) !important;
}
.site-content,
section:not(.hero),
.features,
.story-section,
.terms-highlights,
.faq-section{
  background:rgba(247,252,244,.22) !important;
  backdrop-filter:none !important;
}
/* כל אזורי התוכן עצמם אטומים לחלוטין */
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
.cart-summary,
.cart-item{
  background:#fff !important;
  opacity:1 !important;
  backdrop-filter:none !important;
}
.shop-layout,.product-card,.feature-card,.terms-card,.faq-item,.story-copy,.process-step{
  box-shadow:0 18px 46px rgba(18,53,36,.14) !important;
  border-color:rgba(18,53,36,.11) !important;
}
/* סל קניות תמיד ברור ונגיש */
.cart-icon-btn{
  display:inline-flex !important;
  visibility:visible !important;
  opacity:1 !important;
  position:relative !important;
  z-index:50 !important;
  align-items:center;
  justify-content:center;
  width:48px;
  height:48px;
  border-radius:50%;
  border:1px solid rgba(212,175,55,.55) !important;
  background:#fff !important;
  color:#123524 !important;
  box-shadow:0 8px 22px rgba(0,0,0,.16);
}
.cart-count{
  position:absolute;
  top:-5px;
  right:-5px;
  min-width:22px;
  height:22px;
  padding:0 5px;
  border-radius:999px;
  display:flex !important;
  align-items:center;
  justify-content:center;
  background:#d4af37 !important;
  color:#123524 !important;
  font-size:.78rem;
  font-weight:900;
  border:2px solid #fff;
}
.checkout-order-summary{
  background:#fff;
  border:1px solid rgba(18,53,36,.12);
  border-radius:18px;
  padding:16px 18px;
  margin:0 0 18px;
  box-shadow:0 10px 28px rgba(18,53,36,.08);
  direction:rtl;
}
.checkout-order-summary h3{margin:0 0 10px;color:#123524;font-size:1.15rem;}
.checkout-summary-row{display:flex;justify-content:space-between;gap:18px;padding:7px 0;border-bottom:1px solid #edf1ed;color:#415047;}
.checkout-summary-row:last-child{border-bottom:0;}
.checkout-summary-row.total{font-size:1.15rem;font-weight:900;color:#123524;padding-top:11px;}
@media(max-width:820px){
  body::before{opacity:.19 !important;}
  .site-content,section:not(.hero),.features,.story-section,.terms-highlights,.faq-section{background:rgba(247,252,244,.28) !important;}
  .cart-icon-btn{width:44px;height:44px;}
}
'''
if 'FINAL-OPAQUE-PANELS-CART-2026-09-03' not in s:
    s=s.replace('</style>',css+'\n</style>')

old="""            document.getElementById('checkoutModal').classList.add('active');\n            toggleCheckoutFields();\n"""
new="""            document.getElementById('checkoutModal').classList.add('active');\n            toggleCheckoutFields();\n            updateCheckoutSummary();\n"""
if old in s:
    s=s.replace(old,new,1)

marker="""        function closeCheckoutPage() {\n            document.getElementById('checkoutModal').classList.remove('active');\n        }\n"""
addition=r'''

        function updateCheckoutSummary() {
            const modal = document.getElementById('checkoutModal');
            const form = document.getElementById('checkoutForm');
            if (!modal || !form) return;

            let summary = modal.querySelector('.checkout-order-summary');
            if (!summary) {
                summary = document.createElement('div');
                summary.className = 'checkout-order-summary';
                form.insertBefore(summary, form.firstChild);
            }

            const totalQty = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
            const productsTotal = cart.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.qty || 0)), 0);
            const shipping = document.querySelector('input[name="shippingMethod"]:checked')?.value || 'איסוף עצמי';
            const shippingPrice = shipping === 'משלוח' ? 45 : 0;
            const grandTotal = productsTotal + shippingPrice;

            summary.innerHTML = `
                <h3><i class="fa-solid fa-basket-shopping"></i> סיכום ההזמנה</h3>
                <div class="checkout-summary-row"><span>כמות סטים</span><strong>${totalQty}</strong></div>
                <div class="checkout-summary-row"><span>מחיר הסטים</span><strong>₪${productsTotal}</strong></div>
                <div class="checkout-summary-row"><span>${shipping === 'משלוח' ? 'משלוח' : 'איסוף עצמי'}</span><strong>${shippingPrice ? '₪'+shippingPrice : 'ללא תוספת'}</strong></div>
                <div class="checkout-summary-row total"><span>סה״כ לתשלום</span><strong>₪${grandTotal}</strong></div>`;
        }
'''
if 'function updateCheckoutSummary()' not in s and marker in s:
    s=s.replace(marker,marker+addition,1)

# Ensure checkout summary refreshes whenever shipping method changes.
needle="""            form.classList.toggle('pickup-selected', !isDelivery);\n"""
replacement="""            form.classList.toggle('pickup-selected', !isDelivery);\n            updateCheckoutSummary();\n"""
if replacement not in s and needle in s:
    s=s.replace(needle,replacement,1)

# Make add-to-cart give explicit visual feedback and keep cart visible.
old2="""            updateCartUI();\n\n            // אפקט אנימציה זמני על כפתור הסל העליון\n"""
new2="""            updateCartUI();\n            const cartButton = document.querySelector('.cart-icon-btn');\n            if (cartButton) cartButton.style.display = 'inline-flex';\n\n            // אפקט אנימציה זמני על כפתור הסל העליון\n"""
if old2 in s:
    s=s.replace(old2,new2,1)

p.write_text(s,encoding='utf-8')
