const toggle=document.querySelector('.nav-toggle');const nav=document.querySelector('#site-nav');if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))})}

const consent=document.querySelector('.analytics-consent');
if(consent){
  const enableAnalytics=()=>{
    if(!window.GA_MEASUREMENT_ID||document.querySelector('script[data-google-analytics]'))return;
    window.gtag('consent','update',{analytics_storage:'granted'});
    const script=document.createElement('script');
    script.async=true;
    script.dataset.googleAnalytics='true';
    script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(window.GA_MEASUREMENT_ID)}`;
    document.head.appendChild(script);
    window.gtag('js',new Date());
    window.gtag('config',window.GA_MEASUREMENT_ID,{anonymize_ip:true});
  };
  const saved=localStorage.getItem('gow-analytics-consent');
  if(!saved)consent.hidden=false;
  consent.querySelectorAll('[data-consent]').forEach(button=>button.addEventListener('click',()=>{
    const value=button.dataset.consent;
    localStorage.setItem('gow-analytics-consent',value);
    if(value==='granted')enableAnalytics();
    consent.hidden=true;
  }));
  if(saved==='granted')enableAnalytics();
}
