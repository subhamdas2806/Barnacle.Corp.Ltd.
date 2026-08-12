// Clean PostMessage Communication API for Three.js / Iframe integration

export const emitBarnacleEvent = (eventName, payload = {}) => {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        {
          source: 'barnacle-portfolio',
          event: eventName,
          payload,
          timestamp: Date.now()
        },
        '*'
      );
    }
  } catch (err) {
    console.warn('Unable to send postMessage to parent frame:', err);
  }
};
