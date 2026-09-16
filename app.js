// GA4 page views + reliable storefront bootstrap
(function(){
  const id='G-VW9NX3L4BB';
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
  window.gtag('js',new Date());
  window.gtag('config',id);

  const ga=document.createElement('script');
  ga.async=true;
  ga.src='https://www.googletagmanager.com/gtag/js?id='+id;
  document.head.appendChild(ga);

  const mobileCss=document.createElement('link');
  mobileCss.rel='stylesheet';
  mobileCss.href='mobile-shop-first.css?v=20260917-6';
  document.head.appendChild(mobileCss);

  function loadStore(){
    if(document.getElementById('storefront-runtime'))return;
    const s=document.createElement('script');
    s.id='storefront-runtime';
    s.src='storefront-app.js?v=20260917-4';
    s.onload=function(){
      try{
        if(typeof renderProducts==='function')renderProducts();
        if(typeof updateCartUI==='function')updateCartUI();
        if(typeof addSpecialOrderBanner==='function')addSpecialOrderBanner();
        if(typeof initShopCartAccess==='function')initShopCartAccess();
      }catch(e){console.error('Storefront initialization failed',e);}
    };
    document.body.appendChild(s);
  }

  // app.js is defer, but keep this robust for every browser/cache state.
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadStore,{once:true});
  else loadStore();
})();