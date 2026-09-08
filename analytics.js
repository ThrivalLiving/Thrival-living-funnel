(function () {
  const measurementId = 'G-RB7BCY0PRN';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', measurementId);

  window.trackThrivalEvent = function (eventName, parameters) {
    try {
      window.gtag('event', eventName, parameters || {});
    } catch (error) {
      console.warn('Analytics event failed:', error);
    }
  };
})();
