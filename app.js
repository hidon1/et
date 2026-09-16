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
  mobileCss.href='mobile-shop-first.css?v=20260917-2';
  document.head.appendChild(mobileCss);

  s=document.createElement('script');
  s.src='storefront-app.js?v=20260917-1';
  document.head.appendChild(s);
})();