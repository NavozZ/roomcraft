# 🪑 RoomCraft — Furniture Room Visualiser
### PUSL3122 HCI, Computer Graphics and Visualisation — Group Coursework 2025/26

> Design your perfect room before you buy.

---

## 🔗 Links

- **GitHub Repository:** [https://github.com/NavozZ/roomcraft](https://github.com/NavozZ/roomcraft)
- **Video Presentation:** `-`
- **Live Demo:** Run locally (see setup below)

---

## 👥 Group Members

| Name | Role | Branch |
|------|------|--------|
| Navodya | Project Lead · Landing Page, Navbar, Routing, All Dashboards, DesignDetail, Full Dark UI Upgrade | `feature/design-detail` |
| Asantha | Authentication · LoginPage, RegisterPage, AuthContext, designService | `feature/auth-login` |
| Waruni | Room Setup · RoomSetup, UserRoomSetup, User Testing & Evaluation | `feature/user-room-setup` |
| Sadaru | 2D Canvas · DesignEditor, UserDesignEditor, furnitureCatalogue (10 items) | `feature/2d-canvas` |
| Mayumi | 3D Visualisation · View3D, UserView3D, FurnitureModel (GLB loader) | `feature/3d-view` |
| Ravindu | Colour & Shading · ColourPanel (4 palettes, shading, opacity, room colours) | `feature/colour-panel` |

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI component framework |
| Vite | 5.x | Build tool and dev server |
| React Router v6 | 6.x | Client-side routing and role-based protected routes |
| Three.js | r128 | 3D rendering engine |
| @react-three/fiber | 8.x | React integration for Three.js |
| @react-three/drei | 9.x | useGLTF, OrbitControls, Text, PerspectiveCamera |
| Tailwind CSS | 3.x | Utility-first styling (editor & component classes) |
| localStorage | Native | Data persistence — no backend required |

---

## 🚀 Setup

```bash
git clone https://github.com/NavozZ/roomcraft.git
cd roomcraft
npm install
npm run dev
```

Open: **http://localhost:5173**

---

## 🔑 Demo Accounts

| Role | Username | Password |
|------|----------|----------|
| Admin (Designer) | `admin` | `admin123` |
| User (Customer) | `user` | `user123` |

---

## ✨ Features

### Core Functionality
- **User Authentication** — Register, login, logout, and role-based access control (Designer / Customer)
- **Room Setup** — Define room name, dimensions (metres), wall colour, and floor type with live 2D preview
- **2D Design Editor** — Drag and drop furniture from a catalogue of 10 items onto a scaled canvas (60px/m); reposition, rotate, and arrange
- **Customer 2D Editor** — Full drag-and-drop editor access for the customer (user) role via `/user/editor/:id`
- **Colour & Shading Panel** — 4 colour palettes (Wood Tones, Neutrals, Pastels, Bold), custom colour picker, shading slider with preview, opacity control, wall and floor colour presets
- **3D Visualisation** — Full Three.js 3D room with floor, walls, ceiling, skirting boards, OrbitControls (rotate, pan, zoom), lighting, and shadows
- **Real 3D Furniture Models** — GLB model loader using `useGLTF`; auto-scales models to real-world dimensions, blends user colour choice; falls back to styled box if file not present
- **Save / Edit / Delete Designs** — Full CRUD via localStorage; delete confirmation modal on dashboard and editor
- **Customer Delete** — Customers can delete their own rooms from the dashboard and from inside the editor

### UI & Experience
- **Dark Glass Theme** — Unified `#0e0a06` dark background with glassmorphism cards (`backdrop-filter: blur`) across all 11 pages
- **Typewriter Effect** — Hero headline cycles through room types using a custom React hook
- **Parallax** — Background grid moves at 0.25× scroll speed on the landing page
- **Scroll Reveal** — Sections fade and slide up as they enter the viewport via `IntersectionObserver`
- **Mouse-Tracking Glow** — Cards emit a radial amber glow that follows the cursor
- **Glow Buttons** — Amber `box-shadow` intensifies on hover with `translateY` lift
- **Floating Particles** — Amber particles float upward in the hero section via CSS keyframes
- **Loading Skeletons** — Animated shimmer placeholders while designs load
- **Toast Notifications** — Dark glass toast slides in from bottom-right after delete actions
- **Delete Modals** — Glass confirmation dialogs replace all browser `window.confirm()` calls
- **Password Strength Bar** — Live indicator on Register page (Too Short → Weak → Fair → Strong)
- **Search & Filter** — Live search bar on Admin Dashboard filters designs by name

---

## 📁 Project Structure

```
src/
├── App.jsx                          # All routes wired (Navodya)
├── main.jsx
├── index.css                        # Tailwind + global component classes
├── pages/
│   ├── LandingPage.jsx              # Navodya — dark theme, typewriter, parallax, glassmorphism
│   ├── LoginPage.jsx                # Asantha — dark glass
│   ├── RegisterPage.jsx             # Asantha — dark glass, password strength bar
│   ├── admin/
│   │   ├── AdminDashboard.jsx       # Navodya — dark, skeletons, search, toast, delete modal
│   │   ├── RoomSetup.jsx            # Waruni — dark glass, live preview
│   │   ├── DesignEditor.jsx         # Sadaru — 2D drag-drop canvas
│   │   ├── View3D.jsx               # Mayumi — Three.js 3D room + GLB support
│   │   └── DesignDetail.jsx         # Navodya — dark glass, delete modal
│   └── user/
│       ├── UserDashboard.jsx        # Navodya — dark, skeletons, all rooms grid
│       ├── UserRoomSetup.jsx        # Waruni — dark glass, live preview
│       ├── UserDesignEditor.jsx     # Sadaru — full 2D editor for customers
│       └── UserView3D.jsx           # Mayumi — Three.js 3D room + GLB support
├── components/
│   ├── FurnitureModel.jsx           # Mayumi — GLB loader with auto-scale + fallback box
│   ├── colour/
│   │   └── ColourPanel.jsx          # Ravindu — palettes, shading, opacity, room colours
│   └── layout/
│       ├── Navbar.jsx               # Navodya — transparent on landing, glass on scroll
│       └── ProtectedRoute.jsx       # Navodya — role-based auth guard, dark loader
├── context/
│   ├── AuthContext.jsx              # Asantha — login, register, session persistence
│   └── DesignContext.jsx            # Shared design state
├── hooks/
│   ├── useAuth.js
│   └── useDesign.js
├── services/
│   └── designService.js             # Asantha — localStorage CRUD
└── data/
    └── furnitureCatalogue.js        # Sadaru — 10 furniture items with real-world dimensions

public/
└── models/                          # Place .glb furniture files here (see below)
    └── README.md
```

---

## 🪑 Adding Real 3D Furniture Models

The 3D view supports real `.glb` furniture models. If no model file is found, a styled box is shown automatically — the app never crashes.

**Steps:**
1. Download free `.glb` files from [Poly Pizza](https://poly.pizza) (search sofa, chair, bed etc.)
2. Rename each file to match the furniture type exactly
3. Place in `public/models/`

| Filename | Furniture |
|----------|-----------|
| `sofa.glb` | Sofa |
| `chair.glb` | Chair |
| `bed.glb` | Bed |
| `dining-table.glb` | Dining Table |
| `coffee-table.glb` | Coffee Table |
| `wardrobe.glb` | Wardrobe |
| `bookshelf.glb` | Bookshelf |
| `tv-stand.glb` | TV Stand |
| `side-table.glb` | Side Table |
| `desk.glb` | Desk |

> Models are auto-scaled to real-world dimensions using Three.js `Box3` bounding box and colour-tinted to match the user's colour choice via `material.color.lerp()`.

---

## 🗺️ Application Routes

| Route | Page | Role |
|-------|------|------|
| `/` | Landing Page | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/admin` | Admin Dashboard | Designer |
| `/admin/room-setup` | Room Setup | Designer |
| `/admin/editor/:id` | Design Editor | Designer |
| `/admin/view3d/:id` | 3D View | Designer |
| `/admin/design/:id` | Design Detail | Designer |
| `/user` | Customer Dashboard | Customer |
| `/user/room-setup` | Room Setup | Customer |
| `/user/editor/:id` | Design Editor | Customer |
| `/user/view3d/:id` | 3D View | Customer |

---

## 📋 Credits

- [Three.js](https://threejs.org/) — MIT License
- [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) — MIT License
- [@react-three/drei](https://github.com/pmndrs/drei) — MIT License
- [React Router](https://reactrouter.com/) — MIT License
- [Tailwind CSS](https://tailwindcss.com/) — MIT License
- [Poly Pizza](https://poly.pizza) — Free 3D model assets (CC0 / MIT)
- Fonts: [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) + [DM Sans](https://fonts.google.com/specimen/DM+Sans) (Google Fonts, OFL)

---

## ⚠️ Academic Integrity Notice

This project was developed for a university assignment (PUSL3122, University of Plymouth / NSBM Green University, 2025/26).

**Copying or reusing this code for academic submissions is prohibited.**
