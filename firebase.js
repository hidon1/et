import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

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
const analytics = getAnalytics(app);
const db = getFirestore(app);

window.saveOrderToFirebase = async function(orderData) {
    try {
        const docRef = await addDoc(collection(db, "orders"), orderData);
        return docRef.id;
    } catch (e) {
        console.error("שגיאה ברישום ל-Firebase, פועל במצב גיבוי מקומי: ", e);
        return null;
    }
};

window.listenToProductsFromFirebase = function(onProductsUpdate) {
    const productsQuery = query(collection(db, "products"), orderBy("id"));
    return onSnapshot(productsQuery, (snapshot) => {
        const firebaseProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (firebaseProducts.length) {
            onProductsUpdate(firebaseProducts);
        }
    }, (error) => {
        console.error("שגיאה בהאזנה בזמן אמת ל-Firebase: ", error);
    });
};

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
