# Barnacle Corp Ltd. — Windows 95 OS Portfolio Web Application

An authentic, fully interactive retro **Windows 95 Desktop Web Application** created for **Subham Das**. Built with React 18, Vite 5, and Web Audio API synthesizer.

---

## 🖥️ Dedicated Embedded Route (`/embed`)

This project includes a dedicated **Embedded Route** (`/embed`) specifically designed to be loaded inside an `iframe` or `CSS3DRenderer` surface inside a 3D CRT monitor model in Three.js.

### Key Embedded Features:
- **Responsive Iframe Container (`100% × 100%`)**: Adapts to 1200×900, 1024×768, 800×600, or any CRT viewport without horizontal scrollbars or unnecessary body margins.
- **Iframe-Safe Security**: No `X-Frame-Options` or `window.top` lockouts.
- **Interactive Pointer Events**: Full support for clicking, text selection, hover effects, smooth scrolling, and form inputs.
- **Clean PostMessage Communication API**: Emits events to the parent Three.js window under namespace `barnacle-portfolio`.

---

## 🛠️ Local Development & Testing

```bash
# 1. Install dependencies
npm install

# 2. Run local dev server
npm run dev

# 3. Access URLs:
# - Normal Desktop OS: http://localhost:5173/
# - Embedded CRT View:  http://localhost:5173/embed
# - Iframe Test Rig:   http://localhost:5173/test-iframe.html
```

---

## 🕹️ Three.js CRT Integration Guide

To render `/embed` inside your Three.js 3D computer scene:

```javascript
// Example Three.js CSS3DObject setup
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

const iframe = document.createElement('iframe');
iframe.src = 'http://localhost:5173/embed';
iframe.style.width = '1200px';
iframe.style.height = '900px';
iframe.style.border = 'none';

const cssObject = new CSS3DObject(iframe);
// Position & align cssObject directly over your 3D CRT screen mesh
scene.add(cssObject);

// Listen for events from Barnacle Portfolio
window.addEventListener('message', (event) => {
  if (event.data && event.data.source === 'barnacle-portfolio') {
    console.log('Event from Barnacle Portfolio:', event.data.event, event.data.payload);
  }
});
```

---

## 🛑 Repository Policy Note
- Remote Git updates are performed strictly when explicitly requested by the project owner. All modifications are compiled and verified locally.
