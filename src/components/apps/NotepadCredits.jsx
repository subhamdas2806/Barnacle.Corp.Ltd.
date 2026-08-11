import React from 'react';

export default function NotepadCredits() {
  return (
    <div style={{ background: '#ffffff', color: '#000000', height: '100%', padding: 16, fontFamily: 'var(--font-code)', fontSize: 12, lineHeight: 1.5, overflowY: 'auto' }}>
      <h3 style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, borderBottom: '1px solid #808080' }}>
        README.TXT — DELTAOS Win95 Desktop System
      </h3>
      <p style={{ marginBottom: 12 }}>
        Created for: <strong>Subham Das</strong> (B.Tech CSE AI/ML)<br />
        System Version: <strong>DELTAOS 1.0 (Windows 95 Replica)</strong>
      </p>

      <h4 style={{ fontWeight: 'bold', marginTop: 16, marginBottom: 4, color: '#000080' }}>
        🎮 Included Applications & Games:
      </h4>
      <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
        <li><strong>DELTAOS Explorer:</strong> Complete Interactive Portfolio (About, Experience, Education, Projects, Contact).</li>
        <li><strong>Doom:</strong> 3D Canvas Raycasting Game with WASD movement & shooting.</li>
        <li><strong>The Oregon Trail:</strong> Playable retro text/choice adventure.</li>
        <li><strong>Henordle:</strong> 5-letter retro Wordle game with virtual keyboard.</li>
        <li><strong>Minesweeper:</strong> Authentic Win95 mine sweeper grid.</li>
      </ul>

      <h4 style={{ fontWeight: 'bold', marginTop: 16, marginBottom: 4, color: '#000080' }}>
        🎨 Blender & Three.js 3D Scene Integration Guide:
      </h4>
      <p style={{ marginBottom: 8 }}>
        To render this local website on a 3D CRT/LCD Computer Screen model inside your Blender / Three.js scene:
      </p>
      <ol style={{ paddingLeft: 20, lineHeight: '1.6' }}>
        <li>Host this project locally (`npm run dev`) or deploy it to Vercel/Netlify.</li>
        <li>In Three.js, create a <code>CSS3DRenderer</code> scene or HTML iframe overlay positioned over your 3D monitor screen mesh.</li>
        <li>Set the iframe URL to your hosted local or live link: <code>http://localhost:5173</code>.</li>
        <li>Ensure mouse pointer events are passed to the CSS3D object for interactive computer control inside your 3D game environment!</li>
      </ol>
    </div>
  );
}
