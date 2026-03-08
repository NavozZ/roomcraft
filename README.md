# 🪑 RoomCraft — Furniture Room Visualiser
### PUSL3122 HCI, Computer Graphics and Visualisation — Group Coursework 2025/26

> Design your perfect room before you buy.

---

## 🔗 Links
- **Video Presentation:** `[YouTube link — add before submission]`
- **Live Demo:** Run locally (see setup below)

## 👥 Group Members
| Name | Role |
|------|------|
| Navodya | Project Lead, UI/UX, Landing Page, Routing |
| Sadaru | 2D Canvas, Furniture Drag & Drop |
| Mayumi | 3D Room Visualisation (Three.js) |
| Asantha | Auth, Save/Load Designs, Dashboard |
| Ravindu | Colour Picker, Shading Tools |
| Waruni | Room Setup Form, User Testing, Evaluation |

## 🛠️ Tech Stack
- **React 18** + **Vite** — UI framework
- **React Router v6** — page routing
- **Three.js** + **@react-three/fiber** — 3D rendering
- **localStorage** — data persistence (no backend required)

## 🚀 Setup
```bash
git clone https://github.com/YOUR_USERNAME/roomcraft.git
cd roomcraft
npm install
npm run dev
```
Open: **http://localhost:5173**

## 🔑 Demo Accounts
| Role | Username | Password |
|------|----------|----------|
| Admin (Designer) | `admin` | `admin123` |
| User (Customer) | `user` | `user123` |

## 📁 Structure
```
src/
├── pages/admin/     → Designer screens (Asantha, Sadaru, Mayumi, Waruni)
├── pages/user/      → Customer screens
├── components/
│   ├── canvas2d/    → 2D room layout (Sadaru)
│   ├── canvas3d/    → 3D visualisation (Mayumi)
│   ├── colour/      → Colour tools (Ravindu)
│   ├── room/        → Room setup (Waruni)
│   └── layout/      → Navbar, routing (Navodya)
├── context/         → Shared state (Auth + Design)
└── hooks/           → useAuth, useDesign
```

## 📋 Credits
- Three.js — MIT License
- @react-three/fiber — MIT License
- @react-three/drei — MIT License
- React Router — MIT License
- Fonts: Cormorant Garamond + DM Sans (Google Fonts, OFL)
- 3D Models: [credit sources here when added]
