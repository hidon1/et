const productPolishLink=document.createElement('link');productPolishLink.rel='stylesheet';productPolishLink.href='product-polish.css?v=20260910-2';document.head.appendChild(productPolishLink);

const SECURE_PAYMENT_URL='https://pay.grow.link/d3929ec59413daf95a7263982ca7fa2f-MTk2MzUzOQ';

// קטלוג שלושת הסטים. המחירים ניתנים לעדכון כאן לאחר קביעת המחיר הסופי.
let products = [
  {
    id:1, sku:'SEF-001', type:'סט', name:'סט ספרדי מהודר',
    desc:'סט מלא לפי מנהגי הספרדים, עם לולב נאה, סגור ועם קורא, אתרוג מוקפד, הדסים וערבות.',
    price:130, badge:'בחירה ספרדית', level:'מהודר', variety:'ספרדי', icon:'fa-leaf',
    kicker:'לפי נוסח הספרדים',
    features:['לולב סגור ועם קורא','אתרוג נאה שנבחר בקפידה','הדסים וערבות בסט מלא'],
    detailBadge:'נוסח ספרדי',
    detailLead:'סט מהודר המורכב בהתאמה למנהגי הספרדים, עם דגש על לולב סגור ועם קורא ועל מראה נאה של הסט כולו.',
    detailDescription:'הסט כולל לולב נאה, ישר וסגור עם קורא, כמקובל אצל רבים מבני ספרד; אתרוג מוקפד שנבחר מתוך דגש על מראה נקי ומכובד; הדסים א׳ א׳ מיוחדים וערבות טריות. כל ארבעת המינים נבדקים, מסודרים ונארזים יחד לקראת החג.',
    detailHighlights:['לולב סגור ועם קורא','אתרוג נאה ומוקפד','סט מלא ומוכן לחג']
  },
  {
    id:2, sku:'ASH-001', type:'סט', name:'סט אשכנזי מהודר',
    desc:'סט מלא לפי מנהגי אשכנז, עם אתרוג מזן חזון איש, לולב נאה, הדסים וערבות שנבחרו בקפידה.',
    price:130, badge:'בחירה אשכנזית', level:'מהודר', variety:'אשכנזי', icon:'fa-leaf',
    kicker:'לפי נוסח אשכנז',
    features:['אתרוג מזן חזון איש','לולב נאה ומוקפד','הדסים וערבות בסט מלא'],
    detailBadge:'נוסח אשכנז',
    detailLead:'סט מהודר לפי מנהגי אשכנז, שבמרכזו אתרוג מזן חזון איש לצד יתר המינים שנבחרים בהתאמה.',
    detailDescription:'הסט כולל אתרוג מזן חזון איש, בעל המבנה והמראה האופייניים לזן; לולב נאה וישר; הדסים א׳ א׳ מיוחדים וערבות טריות. הסט כולו נבחר ומורכב בקפידה כדי לקבל ארבעה מינים מכובדים, מסודרים ומוכנים לחג.',
    detailHighlights:['אתרוג מזן חזון איש','בחירה לפי מנהגי אשכנז','אריזה מסודרת לחג']
  },
  {
    id:3, sku:'YEM-001', type:'סט', name:'סט ספרדי עם אתרוג תימני',
    desc:'סט ספרדי מלא עם אתרוג מהזן התימני, לולב סגור ועם קורא, הדסים וערבות.',
    price:130, badge:'אתרוג תימני', level:'מהודר', variety:'ספרדי · אתרוג תימני', icon:'fa-leaf',
    kicker:'ספרדי · אתרוג מזן תימני',
    features:['אתרוג מהזן התימני','לולב סגור ועם קורא','הדסים וערבות בסט מלא'],
    detailBadge:'אתרוג תימני',
    detailLead:'השילוב למי שמבקש סט לפי מנהגי הספרדים עם אתרוג מהזן התימני ובעל המראה המיוחד לו.',
    detailDescription:'הסט כולל אתרוג מהזן התימני שנבחר בקפידה, לצד לולב נאה, סגור ועם קורא, הדסים א׳ א׳ מיוחדים וערבות טריות. כל המינים מסודרים ונארזים יחד, כך שמקבלים סט מלא, נאה ונוח לקראת החג.',
    detailHighlights:['אתרוג מזן תימני','לולב סגור ועם קורא','סט ספרדי מלא']
  }
];
let cart=JSON.parse(localStorage.getItem('sukkot_cart'))||[];
const ORDER_SEQUENCE_KEY='sukkot_order_sequence';
let isSubmittingOrder=false;

document.addEventListener('DOMContentLoaded',()=>{renderProducts();updateCartUI();addSpecialOrderBanner();});
function toggleMenu(){document.getElementById('navMenu')?.classList.toggle('mobile-open');}
function openCartModal(){document.getElementById('cartModal')?.classList.add('active');renderCartItems();}
function closeCartModal(){document.getElementById('cartModal')?.classList.remove('active');}
function openCheckoutPage(){if(!cart.length){alert('סל הקניות שלך ריק.');return;}closeCartModal();document.getElementById('checkoutModal')?.classList.add('active');toggleCheckoutFields();updateCheckoutSummary();}
function closeCheckoutPage(){document.getElementById('checkoutModal')?.classList.remove('active');}
function openTermsModal(){document.getElementById('termsModal')?.classList.add('active');}
function closeTermsModal(){document.getElementById('termsModal')?.classList.remove('active');}
function openSuccessModal(orderId){const n=document.getElementById('successOrderNumber');if(n)n.innerText=`מספר הזמנה: ${orderId}`;document.getElementById('successModal')?.classList.add('active');}
function closeSuccessModal(){document.getElementById('successModal')?.classList.remove('active');}
function toggleFaq(button){button.parentElement.classList.toggle('active');}
function filterType(){renderProducts();} function filterLevel(){renderProducts();} function filterVariety(){renderProducts();} function filterCatalog(){renderProducts();}

function addSpecialOrderBanner(){
  const grid=document.getElementById('productsGrid');
  if(!grid||document.getElementById('specialOrderBanner'))return;
  const b=document.createElement('div');
  b.id='specialOrderBanner';
  b.className='special-order-banner';
  b.innerHTML=`
    <div class="special-order-icon"><i class="fa-brands fa-whatsapp"></i></div>
    <div class="special-order-copy">
      <strong>מחפשים משהו קצת אחר?</strong>
      <span>סט בהרכב מיוחד, בקשה מסוימת או שאלה לפני ההזמנה — דברו איתנו ישירות.</span>
    </div>
    <a href="https://wa.me/972552809503" target="_blank" rel="noopener" class="special-order-link">פנייה בוואטסאפ <i class="fa-solid fa-arrow-left"></i></a>`;
  grid.parentElement.insertBefore(b,grid);
}

function renderProducts(){
  const grid=document.getElementById('productsGrid');
  if(!grid)return;
  grid.innerHTML='';
  products.forEach((p,index)=>{
    const card=document.createElement('article');
    card.className='product-card reveal product-card-premium';
    card.tabIndex=0;
    card.setAttribute('role','button');
    card.setAttribute('aria-label',`פתיחת פרטים מלאים על ${p.name}`);
    card.style.setProperty('--card-delay',`${index*80}ms`);
    const featureRows=(p.features||[]).slice(0,2).map(f=>`<li><i class="fa-solid fa-circle-check"></i><span>${f}</span></li>`).join('');
    card.innerHTML=`
      <div class="product-visual">
        <div class="product-badge">${p.badge}</div>
        <div class="product-img-container">
          <div class="product-image-shade"></div>
          <img src="8.png" alt="${p.name}" class="product-main-image" loading="lazy">
          <div class="product-image-caption"><i class="fa-solid fa-seedling"></i> לחצו לפרטים המלאים</div>
        </div>
      </div>
      <div class="product-info">
        <div class="product-kicker">${p.kicker}</div>
        <h3 class="product-title">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <ul class="product-benefits">${featureRows}</ul>
        <button type="button" class="product-details-link" onclick="event.stopPropagation();openProductDetails(${p.id})">מה מיוחד בסט הזה? <i class="fa-solid fa-arrow-left"></i></button>
        <div class="product-service-row">
          <span><i class="fa-solid fa-shield-heart"></i> רכישה מאובטחת</span>
          <span><i class="fa-solid fa-truck-fast"></i> משלוח ₪45</span>
        </div>
        <div class="product-purchase-zone">
          <div class="product-price-wrap">
            <small>מחיר לסט</small>
            <span class="product-price">₪${p.price}</span>
          </div>
          <div class="product-actions">
            <div class="quantity-block">
              <span class="quantity-label">כמות</span>
              <div class="quantity-selector">
                <button class="qty-btn" onclick="event.stopPropagation();changeProductQty(${p.id},-1,this)" aria-label="הפחתת כמות">−</button>
                <span class="qty-val" id="qty-${p.id}">1</span>
                <button class="qty-btn" onclick="event.stopPropagation();changeProductQty(${p.id},1,this)" aria-label="הוספת כמות">+</button>
              </div>
            </div>
            <button class="add-to-cart-btn" onclick="event.stopPropagation();addToCart(${p.id})"><i class="fa-solid fa-cart-plus"></i> הוספה לסל</button>
            <button class="direct-checkout-btn" onclick="event.stopPropagation();buyNow(${p.id})"><i class="fa-solid fa-bolt"></i> להזמנה עכשיו</button>
          </div>
        </div>
      </div>`;
    card.addEventListener('click',event=>{if(!event.target.closest('button,a,input'))openProductDetails(p.id);});
    card.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&!event.target.closest('button,a,input')){event.preventDefault();openProductDetails(p.id);}});
    grid.appendChild(card);
  });
}

function closeProductDetails(){document.querySelector('.product-details-overlay')?.remove();document.body.classList.remove('product-details-open');}
function openProductDetails(id){
  const p=products.find(product=>product.id===id);if(!p)return;
  closeProductDetails();
  const highlights=(p.detailHighlights||p.features||[]).map(item=>`<div class="product-detail-chip"><i class="fa-solid fa-circle-check"></i><span>${item}</span></div>`).join('');
  const overlay=document.createElement('div');
  overlay.className='product-details-overlay';
  overlay.setAttribute('role','presentation');
  overlay.innerHTML=`<div class="product-details-window product-details-banner" role="dialog" aria-modal="true" aria-labelledby="product-details-title-${p.id}">
    <button type="button" class="product-details-close" onclick="closeProductDetails()" aria-label="סגירת פרטי המוצר"><i class="fa-solid fa-xmark"></i></button>
    <div class="product-details-image"><img src="8.png" alt="${p.name}"><span class="product-details-image-badge">${p.detailBadge||p.badge}</span></div>
    <div class="product-details-content">
      <div class="product-details-kicker">${p.kicker}</div>
      <h2 class="product-details-title" id="product-details-title-${p.id}">${p.name}</h2>
      <p class="product-details-lead">${p.detailLead||p.desc}</p>
      <div class="product-details-highlights">${highlights}</div>
      <p class="product-details-copy">${p.detailDescription||p.desc}</p>
      <div class="product-details-bottom"><div><small>מחיר לסט</small><div class="product-details-price">₪${p.price}</div></div><div class="product-details-actions"><button class="add-to-cart-btn" onclick="addToCart(${p.id});closeProductDetails();"><i class="fa-solid fa-cart-plus"></i> הוספה לסל</button><button class="direct-checkout-btn" onclick="closeProductDetails();buyNow(${p.id});"><i class="fa-solid fa-credit-card"></i> מעבר להזמנה</button></div></div>
    </div>
  </div>`;
  overlay.addEventListener('click',event=>{if(event.target===overlay)closeProductDetails();});
  document.body.appendChild(overlay);
  document.body.classList.add('product-details-open');
  overlay.querySelector('.product-details-close')?.focus();
}
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeProductDetails();});

function changeProductQty(id,change,btn){const el=btn.parentElement.querySelector('.qty-val');el.innerText=Math.max(1,parseInt(el.innerText||'1')+change);}
function buyNow(id){const p=products.find(x=>x.id===id);if(!p)return;const qty=parseInt(document.getElementById(`qty-${id}`)?.innerText||'1');cart=[{...p,qty}];saveCart();updateCartUI();openCheckoutPage();}
function addToCart(id){const p=products.find(x=>x.id===id);if(!p)return;const qty=parseInt(document.getElementById(`qty-${id}`)?.innerText||'1');const e=cart.find(x=>x.id===id);if(e)e.qty+=qty;else cart.push({...p,qty});saveCart();updateCartUI();}
function changeCartItemQty(id,c){const i=cart.find(x=>x.id===id);if(!i)return;i.qty+=c;if(i.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart();updateCartUI();renderCartItems();}
function removeCartItem(id){cart=cart.filter(x=>x.id!==id);saveCart();updateCartUI();renderCartItems();}
function saveCart(){localStorage.setItem('sukkot_cart',JSON.stringify(cart));}
function updateCartUI(){const n=cart.reduce((s,i)=>s+i.qty,0);['cartCount','floatingCartCount'].forEach(id=>{const e=document.getElementById(id);if(e)e.innerText=n;});}
function renderCartItems(){const list=document.getElementById('cartItemsList');if(!list)return;list.innerHTML='';let total=0,count=0;cart.forEach(i=>{total+=i.price*i.qty;count+=i.qty;const r=document.createElement('div');r.className='cart-item';r.innerHTML=`<div class="cart-item-details"><div><div class="cart-item-name">${i.name}</div><div class="cart-item-price">₪${i.price} × ${i.qty} = ₪${i.price*i.qty}</div></div></div><div class="quantity-selector"><button class="qty-btn" onclick="changeCartItemQty(${i.id},-1)">-</button><span class="qty-val">${i.qty}</span><button class="qty-btn" onclick="changeCartItemQty(${i.id},1)">+</button></div><button class="remove-item" onclick="removeCartItem(${i.id})"><i class="fa-solid fa-trash"></i></button>`;list.appendChild(r);});const c=document.getElementById('summaryCount'),t=document.getElementById('summaryTotal');if(c)c.innerText=count;if(t)t.innerText=`₪${total}`;}
function updateCheckoutSummary(){const form=document.getElementById('checkoutForm'),modal=document.getElementById('checkoutModal');if(!form||!modal)return;let s=modal.querySelector('.checkout-order-summary');if(!s){s=document.createElement('div');s.className='checkout-order-summary';form.insertBefore(s,form.firstChild);}const shipping=document.querySelector('input[name="shippingMethod"]:checked')?.value||'איסוף עצמי',ship=shipping==='משלוח'?45:0;const lines=cart.map(i=>`<div class="checkout-summary-row"><span>${i.name}</span><strong>₪${i.price} × ${i.qty} = ₪${i.price*i.qty}</strong></div>`).join('');const subtotal=cart.reduce((a,i)=>a+i.price*i.qty,0);s.innerHTML=`<h3><i class="fa-solid fa-basket-shopping"></i> סיכום ההזמנה</h3>${lines}<div class="checkout-summary-row"><span>${shipping}</span><strong>${ship?'₪'+ship:'ללא תוספת'}</strong></div><div class="checkout-summary-row total"><span>סה״כ לתשלום</span><strong>₪${subtotal+ship}</strong></div>`;}
function toggleCheckoutFields(){const shipping=document.querySelector('input[name="shippingMethod"]:checked')?.value||'איסוף עצמי',delivery=shipping==='משלוח',form=document.getElementById('checkoutForm');form?.classList.toggle('delivery-selected',delivery);form?.classList.toggle('pickup-selected',!delivery);['custCity','custStreet','custHouse'].forEach(id=>{const e=document.getElementById(id);if(e)e.required=delivery;});updateCheckoutSummary();}
function setCheckoutLoading(v){const b=document.getElementById('submitOrderBtn');if(b){b.disabled=v;b.innerHTML=v?'שומר ומעביר לתשלום... <i class="fa-solid fa-circle-notch submit-spinner"></i>':'אישור הפרטים ומעבר לתשלום מאובטח <i class="fa-solid fa-credit-card"></i>';}}
function createSequentialOrderId(){const n=(Number(localStorage.getItem(ORDER_SEQUENCE_KEY))||0)+1;localStorage.setItem(ORDER_SEQUENCE_KEY,String(n));return `SUKKOT-${String(n).padStart(6,'0')}`;}
async function handleCheckout(event){event.preventDefault();if(isSubmittingOrder||!cart.length)return;isSubmittingOrder=true;setCheckoutLoading(true);const orderId=createSequentialOrderId();const val=id=>document.getElementById(id)?.value.trim()||'';const shipping=document.querySelector('input[name="shippingMethod"]:checked')?.value||'איסוף עצמי';const city=val('custCity'),street=val('custStreet'),house=val('custHouse'),entrance=val('custEntrance'),apt=val('custApartment'),floor=val('custFloor'),postalCode=val('custPostalCode'),deliveryNotes=val('custDeliveryNotes'),address=[street,house&&`בית ${house}`,entrance&&`כניסה ${entrance}`,apt&&`דירה ${apt}`,floor&&`קומה ${floor}`,city,postalCode&&`מיקוד ${postalCode}`].filter(Boolean).join(', ');const total=cart.reduce((s,i)=>s+i.price*i.qty,0)+(shipping==='משלוח'?45:0);const orderData={orderId,customer:{name:val('custName'),phone:val('custPhone'),email:val('custEmail'),notes:val('custNotes'),city,street,houseNumber:house,entrance,apartmentNumber:apt,floor,postalCode,deliveryNotes,address},items:cart.map(i=>({id:i.id,sku:i.sku,name:i.name,qty:i.qty,price:i.price,lineTotal:i.qty*i.price})),paid:false,paymentStatus:'waiting_for_payment',orderStatus:'waiting_for_payment',shippingMethod:shipping,totalPrice:total,date:new Date().toISOString()};localStorage.setItem('grow_pending_order_id',orderId);localStorage.setItem('grow_pending_summary',JSON.stringify({orderId,items:orderData.items,shipping,total}));try{const savePromise=window.saveOrderToFirebase?.(orderData);if(savePromise&&typeof savePromise.then==='function')await Promise.race([savePromise,new Promise(resolve=>setTimeout(resolve,1400))]);closeCheckoutPage();window.location.assign(SECURE_PAYMENT_URL);}catch(error){console.error('שגיאה בשמירת ההזמנה לפני התשלום:',error);closeCheckoutPage();window.location.assign(SECURE_PAYMENT_URL);}finally{setTimeout(()=>{isSubmittingOrder=false;setCheckoutLoading(false);},2500);}}
function handleContactForm(e){e.preventDefault();alert('תודה על פנייתך! נציג יחזור אליך בהקדם.');e.target.reset();}
