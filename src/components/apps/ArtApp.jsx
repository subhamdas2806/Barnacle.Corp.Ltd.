import React, { useState } from 'react';
import { ScrollView, Frame } from 'react95';
import { FolderOpen, Progman24, Brush } from '@react95/icons';

// Import images from the /artworks folder at root using Vite glob
const importAllArt = import.meta.glob('/artworks/*.{jpg,jpeg,png,gif,webp,svg}', {
  eager: true,
  query: '?url',
  import: 'default'
});

export default function ArtApp() {
  const artEntries = Object.entries(importAllArt).map(([path, url]) => {
    const filename = path.split('/').pop();
    return { path, filename, url };
  });

  const [selectedArt, setSelectedArt] = useState(artEntries[0] || null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#c0c0c0' }}>
      {/* Top Menu / Status Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', borderBottom: '2px solid #808080', background: '#dfdfdf', fontSize: 13 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FolderOpen style={{ width: 18, height: 18 }} />
          <span style={{ fontWeight: 'bold' }}>C:\ARTWORKS</span>
          <span style={{ color: '#555' }}>({artEntries.length} creations)</span>
        </div>
        <div style={{ fontSize: 12, color: '#333' }}>
          {selectedArt ? selectedArt.filename : 'No artwork selected'}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', padding: 6, gap: 6 }}>
        {/* Left Thumbnails List */}
        <div style={{ width: 220, display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
          <span style={{ fontSize: 12, marginBottom: 4, fontWeight: 'bold', flexShrink: 0 }}>Art Gallery:</span>
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: '#ffffff', border: '2px solid', borderColor: '#808080 #ffffff #ffffff #808080', boxShadow: 'inset 1px 1px #000, inset -1px -1px #dfdfdf' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 4 }}>
              {artEntries.length === 0 ? (
                <div style={{ padding: 12, fontSize: 12, color: '#777', textAlign: 'center' }}>
                  No artworks found in /artworks folder.<br/>Add your pictures or drawings into /artworks.
                </div>
              ) : (
                artEntries.map((art, idx) => {
                  const isSelected = selectedArt?.url === art.url;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedArt(art)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '4px 6px',
                        cursor: 'pointer',
                        background: isSelected ? '#000080' : 'transparent',
                        color: isSelected ? '#ffffff' : '#000000',
                        border: isSelected ? '1px dotted #ffffff' : '1px solid transparent',
                        userSelect: 'none'
                      }}
                    >
                      <img
                        src={art.url}
                        alt={art.filename}
                        style={{
                          width: 32,
                          height: 32,
                          objectFit: 'cover',
                          border: '1px solid #808080',
                          backgroundColor: '#181425'
                        }}
                      />
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>
                        {art.filename}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Artwork Canvas Previewer */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 12, marginBottom: 4, fontWeight: 'bold' }}>Canvas Display:</span>
          <Frame
            variant="inside"
            style={{
              flex: 1,
              background: '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'auto',
              padding: 8,
              position: 'relative'
            }}
          >
            {selectedArt ? (
              <img
                src={selectedArt.url}
                alt={selectedArt.filename}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  boxShadow: '0 0 14px rgba(255,0,128,0.3)'
                }}
              />
            ) : (
              <div style={{ color: '#888', fontSize: 13 }}>Select an artwork to view</div>
            )}
          </Frame>
        </div>
      </div>
    </div>
  );
}
