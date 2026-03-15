# 🪑 RoomCraft — Furniture Room Visualiser
### PUSL3122 HCI, Computer Graphics and Visualisation — Group Coursework 2025/26

> Design your perfect room before you buy.

---

## 🔗 Links

- **GitHub Repository:** [https://github.com/NavozZ/roomcraft](https://github.com/NavozZ/roomcraft)
- **Video Presentation:** `[OneDrive link — add before submission]`
- **Live Demo:** Run locally (see setup below)

---

## 👥 Group Members

| Name | Role | Branch |
|------|------|--------|
| Navodya | Project Lead · Landing Page, Navbar, Routing, AdminDashboard, UserDashboard, DesignDetail | `feature/design-detail` |
| Asantha | Authentication · LoginPage, RegisterPage, AuthContext, designService | `feature/auth-login` |
| Waruni | Room Setup · RoomSetup, UserRoomSetup, User Testing & Evaluation | `feature/user-room-setup` |
| Sadaru | 2D Canvas · DesignEditor, furnitureCatalogue (10 items) | `feature/2d-canvas` |
| Mayumi | 3D Visualisation · View3D, UserView3D (Three.js + React Three Fiber) | `feature/3d-view` |
| Ravindu | Colour & Shading · ColourPanel (4 palettes, shading slider, room colours) | `feature/colour-panel` |

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI component framework |
| Vite | 5.x | Build tool and dev server |
| React Router v6 | 6.x | Client-side routing and protected routes |
| Three.js | r128 | 3D rendering engine |
| @react-three/fiber | 8.x | React integration for Three.js |
| @react-three/drei | 9.x | Three.js helpers (OrbitControls, Text, Camera) |
| Tailwind CSS | 3.x | Utility-first styling |
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

- **User Authentication** — Register, login, and role-based access control (Designer / Customer)
- **Room Setup** — Define room dimensions (metres), wall colour, and floor type
- **2D Design Editor** — Drag and drop furniture from a catalogue of 10 items onto a scaled canvas; reposition, rotate, and resize
- **Colour & Shading Panel** — 4 colour palettes, custom colour picker, shading slider, opacity control, and room colour presets
- **3D Visualisation** — Full Three.js 3D room with OrbitControls (rotate, pan, zoom), lighting, and shadows
- **Save / Edit / Delete Designs** — All designs persist in localStorage and survive page refresh
- **Customer View** — Customers can browse and view saved designs in 3D independently

---

## 📁 Project Structure

```
src/
├── App.jsx                        # All routes wired (Navodya)
├── main.jsx
├── index.css                      # Tailwind + global component classes
├── pages/
│   ├── LandingPage.jsx            # Navodya
│   ├── LoginPage.jsx              # Asantha
│   ├── RegisterPage.jsx           # Asantha
│   ├── admin/
│   │   ├── AdminDashboard.jsx     # Navodya
│   │   ├── RoomSetup.jsx          # Waruni
│   │   ├── DesignEditor.jsx       # Sadaru
│   │   ├── View3D.jsx             # Mayumi
│   │   └── DesignDetail.jsx       # Navodya
│   └── user/
│       ├── UserDashboard.jsx      # Navodya
│       ├── UserRoomSetup.jsx      # Waruni
│       └── UserView3D.jsx         # Mayumi
├── components/
│   ├── colour/
│   │   └── ColourPanel.jsx        # Ravindu
│   └── layout/
│       ├── Navbar.jsx             # Navodya
│       └── ProtectedRoute.jsx     # Navodya
├── context/
│   ├── AuthContext.jsx            # Asantha
│   └── DesignContext.jsx
├── hooks/
│   ├── useAuth.js
│   └── useDesign.js
├── services/
│   └── designService.js           # Asantha — localStorage CRUD
└── data/
    └── furnitureCatalogue.js      # Sadaru — 10 furniture items
```

---

## 📋 Credits

- [Three.js](https://threejs.org/) — MIT License
- [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) — MIT License
- [@react-three/drei](https://github.com/pmndrs/drei) — MIT License
- [React Router](https://reactrouter.com/) — MIT License
- [Tailwind CSS](https://tailwindcss.com/) — MIT License
- Fonts: [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) + [DM Sans](https://fonts.google.com/specimen/DM+Sans) (Google Fonts, OFL)

---

## ⚠️ Academic Integrity Notice

This project was developed for a university assignment (PUSL3122, University of Plymouth / NSBM Green University, 2025/26).

**Copying or reusing this code for academic submissions is prohibited.**
