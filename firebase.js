import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBG8ZiYOdVdI45AsKnMcbX6QaVlkU4dXhM",
    authDomain: "etrog-d0bcb.firebaseapp.com",
    projectId: "etrog-d0bcb",
    storageBucket: "etrog-d0bcb.firebasestorage.app",
    messagingSenderId: "215951557108",
    appId: "1:215951557108:web:8531faf1b1e512822d79a1",
    measurementId: "G-PYV7B8N2M3"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);
const db = getFirestore(app);

const GROW_PAYMENT_URL = 'https://pay.grow.link/d3929ec59413daf95a7263982ca7fa2f-MTk2MzUzOQ';
const PENDING_DOC_KEY = 'grow_pending_firebase_doc_id';
const PENDING_ORDER_KEY = 'grow_pending_order_id';

window.saveOrderToFirebase = async function(orderData) {
    // מספר המסמך נוצר על ידי Firestore כדי למנוע דריסה בין הזמנות ממכשירים שונים.
    localStorage.removeItem(PENDING_DOC_KEY);
    if (orderData?.orderId) localStorage.setItem(PENDING_ORDER_KEY, orderData.orderId);

    try {
        const savedOrder = await addDoc(collection(db, "orders"), {
            ...orderData,
            paid: false,
            paymentStatus: orderData.paymentStatus || 'waiting_for_payment',
            orderStatus: orderData.orderStatus || 'waiting_for_payment',
            createdAt: orderData.date || new Date().toISOString()
        });
        localStorage.setItem(PENDING_DOC_KEY, savedOrder.id);
        return savedOrder.id;
    } catch (e) {
        console.error("שגיאה ברישום ל-Firebase: ", e);
        throw e;
    }
};

window.updateOrderPaymentStatus = async function(docId, payload) {
    if (!docId) return false;
    try {
        await updateDoc(doc(db, 'orders', docId), payload);
        return true;
    } catch (e) {
        console.error('שגיאה בעדכון סטטוס התשלום:', e);
        return false;
    }
};

window.listenToProductsFromFirebase = function(onProductsUpdate) {
    const productsQuery = query(collection(db, "products"), orderBy("id"));
    return onSnapshot(productsQuery, (snapshot) => {
        const firebaseProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (firebaseProducts.length) onProductsUpdate(firebaseProducts);
    }, (error) => console.error("שגיאה בהאזנה בזמן אמת ל-Firebase: ", error));
};

function setSuccessModalContent(type, orderId) {
    const modal = document.getElementById('successModal');
    if (!modal) return;
    const icon = modal.querySelector('.success-icon i');
    const title = modal.querySelector('.cart-title');
    const text = modal.querySelector('p');
    const number = document.getElementById('successOrderNumber');
    const button = modal.querySelector('.btn-submit-order');

    if (type === 'paid') {
        if (icon) icon.className = 'fa-solid fa-circle-check';
        if (title) title.textContent = 'התשלום הצליח!';
        if (text) text.textContent = 'ההזמנה בוצעה בהצלחה. ארבעת המינים שלך בדרך אליך.';
        if (number) number.textContent = orderId ? `מספר הזמנה: ${orderId}` : 'ההזמנה התקבלה';
        if (button) { button.textContent = 'מעולה, תודה'; button.onclick = () => window.closeSuccessModal?.(); button.disabled = false; }
    } else if (type === 'failed') {
        if (icon) icon.className = 'fa-solid fa-circle-xmark';
        if (title) title.textContent = 'התשלום לא הושלם';
        if (text) text.textContent = 'ההזמנה נשמרה וממתינה לתשלום. לא בוצע חיוב, ואפשר לנסות שוב עכשיו ולהשלים את הרכישה.';
        if (number) number.textContent = orderId ? `מספר הזמנה ממתינה: ${orderId}` : 'ההזמנה ממתינה לתשלום';
        if (button) {
            button.disabled = false;
            button.innerHTML = '<i class="fa-solid fa-credit-card"></i> נסו שוב לתשלום';
            button.onclick = () => { window.location.href = GROW_PAYMENT_URL; };
        }
    }
    modal.classList.add('active');
}

async function handleGrowReturn() {
    const params = new URLSearchParams(window.location.search);
    const raw = String(params.get('response') || params.get('reponse') || params.get('payment') || params.get('status') || '').toLowerCase();
    const cancelled = ['1','true','yes'].includes(String(params.get('cancel') || params.get('cancelled') || '').toLowerCase());
    const success = ['success','succeeded','paid','approved','ok','1'].includes(raw);
    const failed = cancelled || ['fail','failed','failure','error','cancel','cancelled','declined','0'].includes(raw);
    if (!success && !failed) return;

    const docId = localStorage.getItem(PENDING_DOC_KEY);
    const orderId = localStorage.getItem(PENDING_ORDER_KEY) || '';
    const now = new Date().toISOString();

    if (success) {
        if (docId) await window.updateOrderPaymentStatus(docId, {
            paid: true,
            paymentStatus: 'paid_client_return',
            orderStatus: 'completed',
            lastPaymentAttemptStatus: 'paid',
            paymentReportedSuccess: true,
            paymentReturnSource: 'grow',
            paidUpdatedAt: now
        });
        setSuccessModalContent('paid', orderId);
        localStorage.removeItem(PENDING_DOC_KEY);
        localStorage.removeItem(PENDING_ORDER_KEY);
        localStorage.removeItem('sukkot_cart');
    } else {
        if (docId) await window.updateOrderPaymentStatus(docId, {
            paid: false,
            paymentStatus: 'waiting_for_payment',
            orderStatus: 'waiting_for_payment',
            lastPaymentAttemptStatus: 'failed',
            paymentReportedSuccess: false,
            paymentReturnSource: 'grow',
            paymentFailedAt: now
        });
        setSuccessModalContent('failed', orderId);
    }

    const cleanUrl = new URL(window.location.href);
    ['response','reponse','payment','status','cancel','cancelled'].forEach(k => cleanUrl.searchParams.delete(k));
    history.replaceState({}, '', cleanUrl.pathname + (cleanUrl.search ? cleanUrl.search : '') + cleanUrl.hash);
}

window.addEventListener('load', () => {
    // app.js שומר את ההזמנה ברקע ואז קורא לפונקציה הזאת.
    // כאן לא מחכים לקבל שום תשובה מ-Firebase: עוברים ל-Grow מיד.
    window.openSuccessModal = function(orderId) {
        if (orderId) localStorage.setItem(PENDING_ORDER_KEY, orderId);
        window.location.href = GROW_PAYMENT_URL;
    };

    handleGrowReturn().catch(console.error);
});

// WhatsApp: keep only the floating icon visible and open the business chat directly.
document.addEventListener('DOMContentLoaded', () => {
    const whatsappButton = document.querySelector('.whatsapp-float');
    if (!whatsappButton) return;
    whatsappButton.href = 'https://wa.me/972552809503';
    whatsappButton.target = '_blank';
    whatsappButton.rel = 'noopener noreferrer';
    whatsappButton.removeAttribute('onclick');
    whatsappButton.setAttribute('aria-label', 'יצירת קשר בוואטסאפ');
});
