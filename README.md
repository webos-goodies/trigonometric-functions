# Interactive Trigonometry Visualizer

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://webos-goodies.github.io/trigonometric-functions/index.html)

**Visualizing the relationship between the circle, right triangles, and trigonometric function graphs for students learning trigonometry for the first time.**

🎮 **[Try the Live Demo](https://webos-goodies.github.io/trigonometric-functions/index.html)**

---

## 🎯 Project Mission

When students first encounter trigonometry in mathematics and physics, they often struggle to connect three fundamentally related concepts:
1. **Ratios of sides** in a right triangle
2. **Coordinates** on a unit circle
3. **Periodic wave graphs** ($\sin$, $\cos$, $\tan$)

This application bridges that gap by presenting all three representations simultaneously on a single, synchronized canvas. By dragging the triangle on the unit circle, learners can immediately observe how geometric properties in the circle translate directly into the waveforms of sine, cosine, and tangent.

---

## 🖥 Screen Layout & Architecture

The square canvas is divided into four quadrants around a central origin, ordered counter-clockwise starting from the top-right:

```text
┌─────────────────────────────────┬─────────────────────────────────┐
│ Region 2: sin(θ) Graph          │ Region 1: Unit Circle & Triangle│
│ (Horizontal axis: θ,            │ (Interactive Drag Control)      │
│  Vertical axis: sin θ)          │                                 │
├─────────────────────────────────┼─────────────────────────────────┤
│ Region 3: tan(θ) Graph          │ Region 4: cos(θ) Graph          │
│ (Horizontal axis: θ,            │ (Vertical axis: θ,              │
│  Vertical axis: tan θ)          │  Horizontal axis: cos θ)        │
└─────────────────────────────────┴─────────────────────────────────┘
```

### 1. Region 1 (Top-Right): Unit Circle & Right Triangle
- **Interactive Control**: Click and drag with the left mouse button (or touch on mobile/tablets) anywhere in Region 1 to adjust the angle $\theta$ seamlessly through $0^\circ \sim 360^\circ$.
- **Geometric Elements**:
  - **Hypotenuse (Cyan)**: Line segment from the origin $(0, 0)$ to the circle radius.
  - **Opposite Side / Height (Rose Pink)**: Vertical line segment corresponding to $\sin\theta$.
  - **Adjacent Side / Base (Emerald Green)**: Horizontal line segment along the X-axis corresponding to $\cos\theta$.
- **Real-Time Readout**: Displays the current angle `θ = ...°` in the upper-right corner.

### 2. Region 2 (Top-Left): $\sin(\theta)$ Graph
- **Horizontal Projection**: A rose pink dashed line extends from the triangle's vertex on the unit circle directly across the canvas, demonstrating that **the height of the right triangle is identical to $\sin\theta$**.
- **Synchronized Scrolling**: The sine curve automatically scrolls horizontally so that the current angle $\theta$ remains at the center of the region.
- **Vertical Drop Line**: A rose pink line drops from the $\sin(\theta)$ point to the X-axis, complete with a right-angle indicator ($\llcorner$).
- **Value Readout**: Displays `sin = ...` in the top-right corner.

### 3. Region 4 (Bottom-Right): $\cos(\theta)$ Graph (Rotated 90°)
- **Vertical Projection**: An emerald green dashed line extends vertically from the triangle's base coordinate down across the canvas, illustrating that **the horizontal position on the circle corresponds directly to $\cos\theta$**.
- **Vertical Scrolling**: Rotated $90^\circ$ relative to standard graphs (vertical axis represents $\theta$, horizontal axis represents $\cos\theta$). The curve scrolls vertically with $\theta$ centered.
- **Horizontal Drop Line**: An emerald green line connects the point to the central axis with a right-angle indicator.
- **Value Readout**: Displays `cos = ...` in the top-right corner.

### 4. Region 3 (Bottom-Left): $\tan(\theta)$ Graph
- **Dynamic Tangent Curves**: Plots the signature S-curve with the horizontal scale matching Region 2.
- **Asymptote Handling**: Accurately computes and clips near $\theta = \pm 90^\circ, \pm 270^\circ$ ($\pm \pi/2 + k\pi$) to prevent erroneous vertical connecting lines.
- **Drop Line**: Features a purple vertical line dropping to the X-axis from the $\tan(\theta)$ point.
- **Value Readout**: Displays `tan = ...` (including $\pm\infty$) in the top-right corner.

---

## ✨ Educational & Design Highlights

- **Visual Color Cohesion**:
  - **Cyan (`#38bdf8`)**: Circle circumference and all function curves.
  - **Rose Pink (`#f43f5e`)**: Triangle height, $\sin\theta$ drop line, and horizontal projection line.
  - **Emerald Green (`#10b981`)**: Triangle base, $\cos\theta$ drop line, and vertical projection line.
  - **Purple (`#a855f7`)**: $\tan\theta$ drop line.
- **Global Guide Lines**:
  - Amplitude boundary lines at $y = \pm 1$ and $x = \pm 1$ demonstrate that sine and cosine never exceed the radius of the unit circle.
  - Subtle grid lines every $90^\circ$ ($\pi/2$) help students identify key nodes: zeroes, peaks, troughs, and asymptotes.
- **Zero External Dependencies**:
  - Built with pure HTML5 Canvas, CSS3, and vanilla modern JavaScript (ES6+). No frameworks, no external libraries, and ultra-fast loading.
- **Responsive & Crisp**:
  - Automatically scales to fit any window size while maintaining a 1:1 aspect ratio.
  - Fully supports high-DPI (Retina) displays via `window.devicePixelRatio`.

---

## 🚀 Getting Started

### Online Demo
Open **[https://webos-goodies.github.io/trigonometric-functions/index.html](https://webos-goodies.github.io/trigonometric-functions/index.html)** in any modern web browser.

### Running Locally
No build tools, package managers, or installation steps are required:

1. Clone the repository:
   ```bash
   git clone https://github.com/webos-goodies/trigonometric-functions.git
   cd trigonometric-functions
   ```

2. Open `index.html` directly in your browser:
   - Double-click `index.html`, or
   - Use any static HTTP server (e.g., Python):
     ```bash
     python3 -m http.server 8080
     # Navigate to http://localhost:8080
     ```

---

## 📁 Repository Structure

```text
.
├── index.html       # HTML entry point with canvas element
├── style.css        # Clean dark-mode stylesheet & layout
├── script.js        # Mathematics, rendering engine, and interaction handlers
└── README.md        # Documentation
```
