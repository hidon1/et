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
  mobileCss.href='mobile-shop-first.css?v=20260917-7';
  document.head.appendChild(mobileCss);

  function addMehudarHeading(){
    const shop=document.getElementById('shop-section');
    const grid=shop&&shop.querySelector('.shop-layout');
    if(!shop||!grid||shop.querySelector('.mehudar-heading'))return;

    const heading=document.createElement('div');
    heading.className='mehudar-heading';
    heading.setAttribute('aria-label','כל הסטים מהודר א׳');
    heading.innerHTML='<span class="mehudar-ornament">✦</span><span class="mehudar-text">כל הסטים <strong>מהודר א׳</strong></span><span class="mehudar-ornament">✦</span>';
    grid.parentNode.insertBefore(heading,grid);

    const style=document.createElement('style');
    style.textContent=`
      .mehudar-heading{display:flex;align-items:center;justify-content:center;gap:15px;width:min(92%,760px);margin:30px auto 28px;padding:13px 26px 15px;position:relative;text-align:center;color:#173d2b;font-family:'Frank Ruhl Libre',serif;font-size:clamp(1.65rem,3vw,2.35rem);font-weight:700;line-height:1.1;letter-spacing:.01em;border-top:1px solid rgba(180,142,37,.42);border-bottom:1px solid rgba(180,142,37,.42)}
      .mehudar-heading:before,.mehudar-heading:after{content:'';position:absolute;left:14%;right:14%;height:1px;background:linear-gradient(90deg,transparent,rgba(204,164,48,.28),transparent)}
      .mehudar-heading:before{top:4px}.mehudar-heading:after{bottom:4px}
      .mehudar-heading .mehudar-text strong{font-weight:900;color:#9a7219;text-shadow:0 1px 0 rgba(255,255,255,.8)}
      .mehudar-heading .mehudar-ornament{color:#c39a2e;font-size:.72em;filter:drop-shadow(0 2px 3px rgba(125,91,15,.16))}
      @media(max-width:560px){.mehudar-heading{width:94%;gap:10px;margin:22px auto 20px;padding:12px 12px 14px;font-size:clamp(1.45rem,7vw,1.9rem)}.mehudar-heading:before,.mehudar-heading:after{left:8%;right:8%}}
    `;
    document.head.appendChild(style);
  }

  function loadStore(){
    addMehudarHeading();
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