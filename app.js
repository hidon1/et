// מוצר יחיד וקבוע. המק״ט נשמר ברשומת ההזמנה ואינו מוצג ללקוח בשלב הבחירה.
        let products = [
            { id: 1, sku: 'AM-001', type: 'סט', name: 'סט ארבעת המינים כשר לכתחילה', desc: 'סט מלא הכולל אתרוג, לולב, הדסים וערבות — נבחר, נבדק ונארז בקפידה לקראת החג.', price: 120, badge: 'כשר לכתחילה', level: 'כשר לכתחילה', variety: 'סט מלא', icon: 'fa-leaf' }
        ];

        let cart = JSON.parse(localStorage.getItem('sukkot_cart')) || [];
        const ORDER_SEQUENCE_KEY = 'sukkot_order_sequence';

        // משתני סינון נוכחיים
        let activeType = 'all';
        let activeLevel = 'all';
        let activeVariety = 'all';

        // אתחול האתר
        document.addEventListener('DOMContentLoaded', () => {
            renderProducts();
            updateCartUI();
            // שומרים על הקטלוג הקבוע של הסט היחיד בלבד.
            // startFirebaseRealtimeUpdates();
        });

        // תפריט מובייל
        function toggleMenu() {
            document.getElementById('navMenu').classList.toggle('mobile-open');
        }

        // ניהול מודאל סל הקניות
        function openCartModal() {
            document.getElementById('cartModal').classList.add('active');
            renderCartItems();
        }
        function closeCartModal() {
            document.getElementById('cartModal').classList.remove('active');
        }

        function openCheckoutPage() {
            if(cart.length === 0) {
                alert('סל הקניות שלך ריק. בחר מוצרים לפני מעבר לתשלום.');
                return;
            }
            closeCartModal();
            document.getElementById('checkoutModal').classList.add('active');
            toggleCheckoutFields();
            updateCheckoutSummary();
        }

        function closeCheckoutPage() {
            document.getElementById('checkoutModal').classList.remove('active');
        }


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

        function toggleCheckoutFields() {
            const form = document.getElementById('checkoutForm');
            if (!form) return;
            const shipping = document.querySelector('input[name="shippingMethod"]:checked')?.value || 'איסוף עצמי';
            const isDelivery = shipping === 'משלוח';
            form.classList.toggle('delivery-selected', isDelivery);
            form.classList.toggle('pickup-selected', !isDelivery);
            updateCheckoutSummary();
            ['custCity', 'custStreet', 'custHouse'].forEach(id => {
                const field = document.getElementById(id);
                if (field) field.required = isDelivery;
            });
        }

        // ניהול מודאל תקנון
        function openTermsModal() {
            document.getElementById('termsModal').classList.add('active');
        }
        function closeTermsModal() {
            document.getElementById('termsModal').classList.remove('active');
        }

        function openSuccessModal(orderId) {
            document.getElementById('successOrderNumber').innerText = `מספר הזמנה: ${orderId}`;
            document.getElementById('successModal').classList.add('active');
        }

        function closeSuccessModal() {
            document.getElementById('successModal').classList.remove('active');
        }

        function normalizeFirebaseProduct(product) {
            return {
                id: Number(product.id) || product.id,
                type: product.type || 'סט',
                name: product.name || 'מוצר חדש',
                desc: product.desc || product.description || '',
                price: Number(product.price) || 0,
                badge: product.badge || 'חדש',
                level: product.level || 'מהודר',
                variety: product.variety || 'סטנדרט',
                icon: product.icon || 'fa-leaf'
            };
        }

        function startFirebaseRealtimeUpdates() {
            if (!window.listenToProductsFromFirebase) return;
            window.listenToProductsFromFirebase((firebaseProducts) => {
                products = firebaseProducts.map(normalizeFirebaseProduct);
                renderProducts();
            });
        }

        // אקורדיון שאלות נפוצות
        function toggleFaq(button) {
            const item = button.parentElement;
            item.classList.toggle('active');
        }

        // פונקציות סינון
        function filterType(type, btn) {
            updateActiveTag(btn);
            activeType = type;
            renderProducts();
        }
        function filterLevel(level, btn) {
            updateActiveTag(btn);
            activeLevel = level;
            renderProducts();
        }
        function filterVariety(variety, btn) {
            updateActiveTag(btn);
            activeVariety = variety;
            renderProducts();
        }
        function updateActiveTag(btn) {
            const siblings = btn.parentElement.querySelectorAll('.tag-btn');
            siblings.forEach(s => s.classList.remove('active'));
            btn.classList.add('active');
        }
        function filterCatalog(mode, btn) {
            activeType = 'all';
            activeLevel = 'all';
            activeVariety = 'all';
            renderProducts();
        }

        // ריסוס מוצרים דינמי לחנות
        function renderProducts() {
            const grid = document.getElementById('productsGrid');
            grid.innerHTML = '';

            const filtered = [...products].sort((a, b) => Number(a.id) - Number(b.id));

            if(filtered.length === 0) {
                grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color:#666;">לא נמצאו מוצרים העונים על סינון זה. נסה לשנות את הבחירה.</div>';
                return;
            }

            filtered.forEach(p => {
                const card = document.createElement('div');
                card.className = 'product-card reveal product-card-clickable';
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');
                card.setAttribute('aria-label', `פרטים נוספים על ${p.name}`);
                card.onclick = (event) => {
                    if (!event.target.closest('button, .quantity-selector')) openProductDetails(p.id);
                };
                card.onkeydown = (event) => {
                    if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('button')) {
                        event.preventDefault();
                        openProductDetails(p.id);
                    }
                };
                card.innerHTML = `
                    <div class="product-badge">${p.badge}</div>
                    <div class="product-type-ribbon">${p.type === 'סט' ? 'סט מלא' : 'פריט בודד'}</div>
                    <div class="product-img-container">
                        <div class="placeholder-art">
                            <i class="fa-solid ${p.icon}"></i>
                            <span>${p.name}</span>
                        </div>
                        <div class="product-hover-image" style="background-image: linear-gradient(rgba(27,67,50,0.10), rgba(18,53,36,0.12)), url('8.png');"></div>
                        <div class="product-hover-image alt" style="background-image: radial-gradient(circle at 72% 28%, rgba(243,229,171,0.28), transparent 24%), linear-gradient(135deg, rgba(255,255,255,0.08), rgba(27,67,50,0.18)), url('8.png');"></div>
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${p.name}</h3>
                        <p class="product-desc">${p.desc}</p>
                        <div class="product-meta">${p.level} · ${p.variety} · משלוח באזור המרכז ₪45</div>
                        <div class="product-footer">
                            <span class="product-price">₪${p.price}</span>
                            <div style="display:flex; gap: 10px; align-items:center;">
                                <div class="quantity-selector">
                                    <button class="qty-btn" onclick="changeProductQty(${p.id}, -1, this)">-</button>
                                    <span class="qty-val" id="qty-${p.id}">1</span>
                                    <button class="qty-btn" onclick="changeProductQty(${p.id}, 1, this)">+</button>
                                </div>
                                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${p.id})" title="הוספה לסל" aria-label="הוספה לסל">
                                    <i class="fa-solid fa-cart-plus"></i> הוספה לסל
                                </button>
                                <button class="direct-checkout-btn" onclick="event.stopPropagation(); buyNow(${p.id})">
                                    <i class="fa-solid fa-credit-card"></i> מעבר לתשלום
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });
        }

        function changeProductQty(id, change, btn) {
            const valEl = btn.parentElement.querySelector('.qty-val');
            let current = parseInt(valEl.innerText);
            current += change;
            if (current < 1) current = 1;
            valEl.innerText = current;
        }

        // ניהול סל הקניות הלוקאלי
        function openProductDetails(id) {
            const p = products.find(product => product.id === id);
            if (!p) return;
            document.querySelector('.product-details-overlay')?.remove();

            const overlay = document.createElement('div');
            overlay.className = 'product-details-overlay';
            overlay.onclick = (event) => { if (event.target === overlay) overlay.remove(); };
            overlay.innerHTML = `
                <div class="product-details-window product-details-banner" role="dialog" aria-modal="true" aria-label="פרטי ${p.name}">
                    <button class="product-details-close" onclick="this.closest('.product-details-overlay').remove()" aria-label="סגירה"><i class="fa-solid fa-xmark"></i></button>
                    <div class="product-details-image"><img src="8.png" alt=""><span class="product-details-image-badge">כשר לכתחילה</span></div>
                    <div class="product-details-content">
                        <div class="product-details-kicker">סט ארבעת המינים לחג</div>
                        <h2 class="product-details-title">${p.name}</h2>
                        <p class="product-details-lead">סט מלא שנבחר ונבדק בקפידה, עם אתרוג, לולב, הדסים וערבות — מסודר ומוכן לחג בצורה מכובדת ונוחה.</p>
                        <div class="product-details-highlights">
                            <div class="product-detail-chip"><i class="fa-solid fa-magnifying-glass"></i><span>נבחר ונבדק בקפידה</span></div>
                            <div class="product-detail-chip"><i class="fa-solid fa-ribbon"></i><span>אריזה חגיגית עם סרט מעוטר</span></div>
                            <div class="product-detail-chip"><i class="fa-solid fa-house"></i><span>אפשרות משלוח עד פתח הבית</span></div>
                        </div>
                        <div class="product-details-copy">הסט מיועד למי שרוצה לקנות ארבעת המינים בצורה פשוטה ונוחה בלי לוותר על בחירה מוקפדת ועל מראה מכובד. כל סט נארז בצורה מסודרת לקראת החג, עם גימור חגיגי וסרט מעוטר. ניתן לבחור איסוף עצמי, ובאזור המרכז קיימת גם אפשרות למשלוח עד פתח הבית בתוספת תשלום.</div>
                        <div class="product-details-bottom">
                            <div class="product-details-price">₪${p.price}</div>
                            <div class="product-details-actions">
                                <button class="add-to-cart-btn" onclick="addToCart(${p.id}); this.closest('.product-details-overlay').remove();"><i class="fa-solid fa-cart-plus"></i> הוספה לסל</button>
                                <button class="direct-checkout-btn" onclick="this.closest('.product-details-overlay').remove(); buyNow(${p.id});"><i class="fa-solid fa-credit-card"></i> מעבר לתשלום</button>
                            </div>
                        </div>
                    </div>
                </div>`;
            document.body.appendChild(overlay);
        }

        function buyNow(id) {
            const qty = parseInt(document.getElementById(`qty-${id}`)?.innerText || '1');
            const product = products.find(p => p.id === id);
            if (!product) return;
            cart = [{ ...product, qty }];
            saveCart();
            updateCartUI();
            openCheckoutPage();
            if (typeof updateCheckoutSummary === 'function') updateCheckoutSummary();
        }

        function addToCart(id) {
            const qty = parseInt(document.getElementById(`qty-${id}`).innerText);
            const product = products.find(p => p.id === id);

            const existing = cart.find(item => item.id === id);
            if(existing) {
                existing.qty += qty;
            } else {
                cart.push({ ...product, qty: qty });
            }

            saveCart();
            updateCartUI();
            const cartButton = document.querySelector('.cart-icon-btn');
            if (cartButton) cartButton.style.display = 'inline-flex';

            // אפקט אנימציה זמני על כפתור הסל העליון
            const cBtn = document.querySelector('.cart-icon-btn');
            cBtn.style.animation = 'cartPop 0.45s ease';
            setTimeout(() => cBtn.style.animation = '', 460);
        }

        function changeCartItemQty(id, change) {
            const item = cart.find(i => i.id === id);
            if(item) {
                item.qty += change;
                if(item.qty <= 0) {
                    cart = cart.filter(i => i.id !== id);
                }
                saveCart();
                updateCartUI();
                renderCartItems();
            }
        }

        function removeCartItem(id) {
            cart = cart.filter(i => i.id !== id);
            saveCart();
            updateCartUI();
            renderCartItems();
        }

        function saveCart() {
            localStorage.setItem('sukkot_cart', JSON.stringify(cart));
        }

        function updateCartUI() {
            const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
            const topCount = document.getElementById('cartCount');
            const floatingCount = document.getElementById('floatingCartCount');
            if (topCount) topCount.innerText = totalItems;
            if (floatingCount) floatingCount.innerText = totalItems;
        }

        // ריסוס פריטי הסל בתוך המודאל הסגור
        function renderCartItems() {
            const list = document.getElementById('cartItemsList');
            const summaryCount = document.getElementById('summaryCount');
            const summaryTotal = document.getElementById('summaryTotal');

            list.innerHTML = '';

            if(cart.length === 0) {
                list.innerHTML = '<p style="text-align:center; color:#777; padding:20px;">סל הקניות שלך ריק כרגע. בחר מוצרים מהחנות.</p>';
                summaryCount.innerText = '0';
                summaryTotal.innerText = '₪0';
                return;
            }

            let totalPrice = 0;
            let totalCount = 0;

            cart.forEach(item => {
                totalPrice += (item.price * item.qty);
                totalCount += item.qty;

                const row = document.createElement('div');
                row.className = 'cart-item';
                row.innerHTML = `
                    <div class="cart-item-details">
                        <div class="cart-item-img"><i class="fa-solid ${item.icon}"></i></div>
                        <div>
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">₪${item.price} ליחידה</div>
                        </div>
                    </div>
                    <div class="quantity-selector">
                        <button class="qty-btn" onclick="changeCartItemQty(${item.id}, -1)">-</button>
                        <span class="qty-val">${item.qty}</span>
                        <button class="qty-btn" onclick="changeCartItemQty(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeCartItem(${item.id})"><i class="fa-solid fa-trash"></i></button>
                `;
                list.appendChild(row);
            });

            summaryCount.innerText = totalCount;
            summaryTotal.innerText = `₪${totalPrice}`;
        }

        let isSubmittingOrder = false;

        function setCheckoutLoading(isLoading) {
            const button = document.getElementById('submitOrderBtn');
            if (!button) return;
            button.disabled = isLoading;
            button.innerHTML = isLoading
                ? 'שולח הזמנה... <i class="fa-solid fa-circle-notch submit-spinner"></i>'
                : 'שליחת הזמנה ואישור <i class="fa-solid fa-paper-plane"></i>';
        }

        function createSequentialOrderId() {
            const currentSequence = Number(localStorage.getItem(ORDER_SEQUENCE_KEY)) || 0;
            const nextSequence = currentSequence + 1;
            localStorage.setItem(ORDER_SEQUENCE_KEY, String(nextSequence));
            return `SUKKOT-${String(nextSequence).padStart(6, '0')}`;
        }

        // טיפול בשליחת הטופס ויצירת מספר הזמנה
        async function handleCheckout(event) {
            event.preventDefault();

            if (isSubmittingOrder) return;

            if(cart.length === 0) {
                alert('סל הקניות שלך ריק. לא ניתן לבצע הזמנה.');
                return;
            }

            isSubmittingOrder = true;
            setCheckoutLoading(true);

            const orderId = createSequentialOrderId();
            const name = document.getElementById('custName').value.trim();
            const phone = document.getElementById('custPhone').value.trim();
            const email = document.getElementById('custEmail').value.trim();
            const city = document.getElementById('custCity').value.trim();
            const street = document.getElementById('custStreet').value.trim();
            const houseNumber = document.getElementById('custHouse').value.trim();
            const apartmentNumber = document.getElementById('custApartment').value.trim();
            const address = [street, houseNumber && `בית ${houseNumber}`, apartmentNumber && `דירה ${apartmentNumber}`].filter(Boolean).join(', ');
            const notes = document.getElementById('custNotes').value.trim();
            const shipping = document.querySelector('input[name="shippingMethod"]:checked').value;

            let total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
            if(shipping === 'משלוח') total += 45;

            // בניית מבנה נתונים להזמנה
            const orderData = {
                orderId: orderId,
                customer: {
                    name,
                    phone,
                    email,
                    notes,
                    city,
                    street,
                    houseNumber,
                    apartmentNumber,
                    house: houseNumber,
                    apartment: apartmentNumber,
                    address
                },
                deliveryAddress: {
                    city,
                    street,
                    houseNumber,
                    apartmentNumber,
                    fullAddress: address
                },
                items: cart.map(i => ({ id: i.id, sku: i.sku || 'AM-001', name: i.name, qty: i.qty, price: i.price })),
                sku: 'AM-001',
                paid: false,
                paymentStatus: 'unpaid',
                shippingMethod: shipping,
                totalPrice: total,
                date: new Date().toISOString()
            };

            if (!window.saveOrderToFirebase) {
                console.error('Firebase אינו זמין כרגע.');
                alert('לא הצלחנו לשמור את ההזמנה כרגע. נסה שוב בעוד רגע.');
                isSubmittingOrder = false;
                setCheckoutLoading(false);
                return;
            }

            // שמירה מיידית ברקע: לא ממתינים לאישור Firebase כדי לא לעכב את חלון ההצלחה.
            window.saveOrderToFirebase(orderData).then((firebaseDocId) => {
                if (!firebaseDocId) {
                    console.error('שמירת ההזמנה ב-Firebase לא הושלמה.');
                }
            }).catch((error) => {
                console.error('שגיאה בשמירת ההזמנה ב-Firebase:', error);
            });

            closeCheckoutPage();
            openSuccessModal(orderId);

            // איפוס הסל והטופס מיד לאחר שליחת ההזמנה לשמירה ברקע.
            cart = [];
            saveCart();
            updateCartUI();
            document.getElementById('checkoutForm').reset();
            isSubmittingOrder = false;
            setCheckoutLoading(false);
        }

        // טופס צור קשר רגיל
        function handleContactForm(event) {
            event.preventDefault();
            alert('תודה על פנייתך! נציג מטעמנו יחזור אליך בהקדם האפשרי בעזרת השם.');
            event.target.reset();
        }
