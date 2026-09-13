(function () {
  const measurementId = 'G-RB7BCY0PRN';
  const metaPixelId = '2080456112864317';

  // Short tracking links.
  // Examples:
  //   /quiz?fb=001  -> Facebook / organic social / quiz / 001
  //   /quiz?ig=002  -> Instagram / organic social / quiz / 002
  // This keeps public links tidy while still sending normal campaign attribution to GA4.
  const shortSourceMap = {
    fb: { source: 'facebook', medium: 'organic_social' },
    ig: { source: 'instagram', medium: 'organic_social' },
    yt: { source: 'youtube', medium: 'organic_social' },
    li: { source: 'linkedin', medium: 'organic_social' },
    em: { source: 'email', medium: 'email' }
  };

  const currentUrl = new URL(window.location.href);
  let analyticsPageLocation = currentUrl.href;
  let shortAttribution = null;

  // Only translate a short code when a standard UTM source is not already present.
  if (!currentUrl.searchParams.get('utm_source')) {
    for (const [key, values] of Object.entries(shortSourceMap)) {
      const trackingId = currentUrl.searchParams.get(key);
      if (!trackingId) continue;

      const campaign = currentUrl.pathname.startsWith('/quiz')
        ? 'quiz'
        : currentUrl.pathname.startsWith('/circle')
          ? 'circle'
          : 'website';

      const analyticsUrl = new URL(currentUrl.href);
      analyticsUrl.searchParams.set('utm_source', values.source);
      analyticsUrl.searchParams.set('utm_medium', values.medium);
      analyticsUrl.searchParams.set('utm_campaign', campaign);
      analyticsUrl.searchParams.set('utm_content', trackingId);
      analyticsPageLocation = analyticsUrl.href;

      shortAttribution = {
        source: values.source,
        medium: values.medium,
        campaign: campaign,
        content: trackingId,
        short_code: key + '=' + trackingId
      };
      break;
    }
  }

  window.thrivalAttribution = shortAttribution;

  // Google Analytics 4
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.appendChild(gaScript);

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_location: analyticsPageLocation
  });

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
    const eventParameters = Object.assign({}, shortAttribution || {}, parameters || {});

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
