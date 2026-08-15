import React, { useState } from 'react';
import { Button, ScrollView, Frame } from 'react95';
import { Camera, Folder, Eye } from 'lucide-react';
import { MediaCd, Mshtml32540, FileIcons } from '@react95/icons';

// Import images from the /photos folder at root using Vite glob
const importAllPhotos = import.meta.glob('/photos/*.{jpg,jpeg,png,gif,webp,svg}', {
  eager: true,
  query: '?url',
  import: 'default'
});

export default function PhotosApp() {
  const photoEntries = Object.entries(importAllPhotos).map(([path, url]) => {
    const filename = path.split('/').pop();
    return { path, filename, url };
  });

  const [selectedPhoto, setSelectedPhoto] = useState(photoEntries[0] || null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#c0c0c0' }}>
      {/* Top Menu / Status Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', borderBottom: '2px solid #808080', background: '#dfdfdf', fontSize: 13 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MediaCd style={{ width: 18, height: 18 }} />
          <span style={{ fontWeight: 'bold' }}>C:\PHOTOS</span>
          <span style={{ color: '#555' }}>({photoEntries.length} items)</span>
        </div>
        <div style={{ fontSize: 12, color: '#333' }}>
          {selectedPhoto ? selectedPhoto.filename : 'No photo selected'}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', padding: 6, gap: 6 }}>
        {/* Left Thumbnails List */}
        <div style={{ width: 220, display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
          <span style={{ fontSize: 12, marginBottom: 4, fontWeight: 'bold', flexShrink: 0 }}>Gallery Items:</span>
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: '#ffffff', border: '2px solid', borderColor: '#808080 #ffffff #ffffff #808080', boxShadow: 'inset 1px 1px #000, inset -1px -1px #dfdfdf' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 4 }}>
              {photoEntries.length === 0 ? (
                <div style={{ padding: 12, fontSize: 12, color: '#777', textAlign: 'center' }}>
                  No photos found in /photos folder.<br/>Add .jpg, .png, or .svg files into /photos.
                </div>
              ) : (
                photoEntries.map((photo, idx) => {
                  const isSelected = selectedPhoto?.url === photo.url;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedPhoto(photo)}
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
                        src={photo.url}
                        alt={photo.filename}
                        style={{
                          width: 32,
                          height: 32,
                          objectFit: 'cover',
                          border: '1px solid #808080',
                          backgroundColor: '#222'
                        }}
                      />
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>
                        {photo.filename}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Photo Previewer */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 12, marginBottom: 4, fontWeight: 'bold' }}>Photo Preview:</span>
          <Frame
            variant="inside"
            style={{
              flex: 1,
              background: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'auto',
              padding: 8,
              position: 'relative'
            }}
          >
            {selectedPhoto ? (
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.filename}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  boxShadow: '0 0 10px rgba(0,255,255,0.2)'
                }}
              />
            ) : (
              <div style={{ color: '#888', fontSize: 13 }}>Select a photo to preview</div>
            )}
          </Frame>
        </div>
      </div>
    </div>
  );
}
