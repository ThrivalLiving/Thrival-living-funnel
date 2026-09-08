(function () {
  const measurementId = 'G-RB7BCY0PRN';
  const metaPixelId = '2080456112864317';

  // Google Analytics 4
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.appendChild(gaScript);

  window.gtag('js', new Date());
  window.gtag('config', measurementId);

  // Meta Pixel
  if (!window.fbq) {
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', metaPixelId);
    window.fbq('track', 'PageView');
  }

  window.trackThrivalEvent = function (eventName, parameters) {
    const eventParameters = parameters || {};

    try {
      window.gtag('event', eventName, eventParameters);
    } catch (error) {
      console.warn('GA4 event failed:', error);
    }

    try {
      if (window.fbq) {
        const metaStandardEvents = {
          generate_lead: 'Lead'
        };
        const metaEventName = metaStandardEvents[eventName];

        if (metaEventName) {
          window.fbq('track', metaEventName, eventParameters);
        } else {
          window.fbq('trackCustom', eventName, eventParameters);
        }
      }
    } catch (error) {
      console.warn('Meta Pixel event failed:', error);
    }
  };
})();
