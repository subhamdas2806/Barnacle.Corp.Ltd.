# Barnacle Corp Ltd. — Windows 95 OS Portfolio Web Application

An authentic, fully interactive retro **Windows 95 Desktop Web Application** created for **Subham Das**. Built with React, Vite, and Web Audio API synthesizer.

Designed as a modular, standalone web application so it can be hosted locally or deployed to Vercel/Netlify, and easily embedded inside a 3D computer monitor scene in Blender / Three.js (e.g. using `CSS3DRenderer` or canvas textures).

---

## 🖥️ System Features & Apps Included

1. **Barnacle Corp Ltd. System Explorer (Portfolio App)**
   - Minimalist centered landing page featuring **BARNACLE SCUM - Corporate Limited** with pixelated dithered typography.
   - Complete section explorer: `ABOUT`, `EXPERIENCE`, `EDUCATION`, `PROJECTS`, `CERTIFICATIONS`, and `CONTACT`.
   - Floppy disk header link for instant viewable/printable PDF resume generation.

2. **MS Paint (Paint.exe)**
   - Complete Win95 paint app featuring Pencil, Brush, Eraser, Fill Bucket, Line, Rectangle, Ellipse, Eyedropper, Text, and 28 Win95 swatches.

3. **Doom (3D Raycaster)**
   - Custom 3D canvas raycasting shooter game with WASD movement, health, ammo, and shooting.

4. **The Oregon Trail**
   - Retro text/choice adventure game with travel stats, hunting, resting, and river crossings.

5. **Henordle**
   - 5-letter retro Wordle game with an interactive Win95 virtual keyboard.

6. **Minesweeper**
   - Authentic Win95 Minesweeper with smiley status face, mine counter, and timer.

7. **Credits.txt / Notepad**
   - System overview & developer instructions.

---

## 📦 Project Setup & Local Hosting

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🕹️ Blender & Three.js 3D Computer Integration Guide

This repository contains **strictly the OS web application layer**. The 3D scene / computer mesh container is kept separate so you can drop your Blender model in whenever ready.

To render this OS on your 3D computer screen in Three.js:

1. Host this project locally (`http://localhost:5173`) or deploy to Vercel / Netlify.
2. In your Three.js game scene, instantiate a `CSS3DRenderer` alongside your main `WebGLRenderer`.
3. Create a `CSS3DObject` wrapping an `<iframe>` pointing to your hosted OS URL.
4. Position and align the `CSS3DObject` plane directly over your 3D monitor screen mesh in Blender.
5. Enable pointer events on the iframe so players can interact with the desktop directly inside your 3D game environment!
