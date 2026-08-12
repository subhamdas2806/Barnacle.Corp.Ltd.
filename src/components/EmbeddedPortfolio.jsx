import React, { useEffect } from 'react';
import MySystem from './apps/MySystem';
import { emitBarnacleEvent } from '../utils/postMessage';

export default function EmbeddedPortfolio() {
  useEffect(() => {
    emitBarnacleEvent('loaded', {
      mode: 'embedded',
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });

    const handleResize = () => {
      emitBarnacleEvent('resize', {
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="embedded-portfolio" style={{ width: '100%', height: '100%', overflow: 'hidden', background: '#ffffff' }}>
      <div className="embedded-portfolio__viewport" style={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <MySystem isEmbedded={true} />
      </div>
    </div>
  );
}
