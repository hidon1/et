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

        // הפיכת פונקציית שמירת ההזמנה לזמינה עבור ה-JS הרגיל באלמנט החלון
        window.saveOrderToFirebase = async function(orderData) {
            try {
                const docRef = await addDoc(collection(db, "orders"), orderData);
                return docRef.id;
            } catch (e) {
                console.error("שגיאה ברישום ל-Firebase, פועל במצב גיבוי מקומי: ", e);
                return null;
            }
        };

        // האזנה מיידית לעדכוני מוצרים מ-Firebase ללא polling וללא המתנה של כמה שניות.
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
