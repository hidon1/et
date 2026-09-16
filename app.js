// GA4 page views + mobile-first storefront + storefront loader
(function(){
  const id='G-VW9NX3L4BB';
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
  window.gtag('js',new Date());
  window.gtag('config',id);

  let s=document.createElement('script');
  s.async=true;
  s.src='https://www.googletagmanager.com/gtag/js?id='+id;
  document.head.appendChild(s);

  const mobileCss=document.createElement('link');
  mobileCss.rel='stylesheet';
  mobileCss.href='mobile-shop-first.css?v=20260917-3';
  document.head.appendChild(mobileCss);

  // app.js itself is deferred. Run the storefront code only after the document
  // has finished parsing so its DOMContentLoaded initialization cannot be missed.
  s=document.createElement('script');
  s.src='storefront-app.js?v=20260917-2';
  s.async=false;
  s.onload=function(){
    if(document.readyState!=='loading'){
      try{renderProducts();updateCartUI();addSpecialOrderBanner();initShopCartAccess();}catch(e){console.error('Storefront initialization failed',e);}
    }
  };
  document.body.appendChild(s);
})();