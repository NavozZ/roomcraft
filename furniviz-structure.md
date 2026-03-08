# FurniViz — Complete Project File Structure
## PUSL3122 | React + Vite + Three.js | Web-Based

```
furniviz-web/
│
├── 📄 index.html                        # App entry point (Vite)
├── 📄 vite.config.js                    # Vite configuration
├── 📄 package.json                      # Dependencies
├── 📄 .gitignore                        # Git ignore rules
├── 📄 README.md                         # GitHub README (with video + repo links)
│
├── 📁 public/
│   ├── 📁 models/                       # 3D furniture model files (.glb/.gltf)
│   │   ├── chair.glb
│   │   ├── dining-table.glb
│   │   ├── sofa.glb
│   │   ├── side-table.glb
│   │   ├── wardrobe.glb
│   │   ├── bed.glb
│   │   └── bookshelf.glb
│   └── 📁 textures/                     # Floor/wall texture images
│       ├── wood-floor.jpg
│       ├── carpet.jpg
│       └── tile.jpg
│
└── 📁 src/
    │
    ├── 📄 main.jsx                      # React root render (Navodya)
    ├── 📄 App.jsx                       # Routes setup (Navodya)
    ├── 📄 index.css                     # Global styles, CSS variables
    │
    ├── 📁 pages/                        # ─── FULL PAGE VIEWS ───────────────
    │   │
    │   ├── 📄 LandingPage.jsx           # Home/welcome screen (Navodya)
    │   ├── 📄 LoginPage.jsx             # Login form - Admin & User (Asantha)
    │   ├── 📄 RegisterPage.jsx          # Register new account (Asantha)
    │   │
    │   ├── 📁 admin/                    # ── ADMIN (Designer) pages ─────────
    │   │   ├── 📄 AdminDashboard.jsx    # Portfolio: list of saved designs (Asantha)
    │   │   ├── 📄 RoomSetup.jsx         # Enter room dimensions/shape (Waruni)
    │   │   ├── 📄 DesignEditor.jsx      # Main editor: 2D canvas + tools (Sadaru)
    │   │   ├── 📄 View3D.jsx            # 3D room visualisation page (Mayumi)
    │   │   └── 📄 DesignDetail.jsx      # View/edit one saved design (Asantha)
    │   │
    │   └── 📁 user/                     # ── USER (Customer) pages ───────────
    │       ├── 📄 UserDashboard.jsx     # Customer home: browse/view designs (Navodya)
    │       ├── 📄 UserView3D.jsx        # Customer 3D view (read-only) (Mayumi)
    │       └── 📄 UserRoomSetup.jsx     # Customer room setup form (Waruni)
    │
    ├── 📁 components/                   # ─── REUSABLE COMPONENTS ────────────
    │   │
    │   ├── 📁 layout/                   # Shared layout components (Navodya)
    │   │   ├── 📄 Navbar.jsx            # Top navigation bar
    │   │   ├── 📄 Sidebar.jsx           # Left tool sidebar
    │   │   └── 📄 ProtectedRoute.jsx    # Redirect if not logged in
    │   │
    │   ├── 📁 canvas2d/                 # 2D room layout (Sadaru)
    │   │   ├── 📄 Canvas2D.jsx          # Main 2D canvas component
    │   │   ├── 📄 FurniturePalette.jsx  # Left panel: list of furniture to drag
    │   │   ├── 📄 FurnitureItem.jsx     # Individual draggable furniture shape
    │   │   ├── 📄 RoomGrid.jsx          # Room floor plan with grid overlay
    │   │   └── 📄 ScaleBar.jsx          # Meter scale indicator
    │   │
    │   ├── 📁 canvas3d/                 # 3D visualisation (Mayumi)
    │   │   ├── 📄 Room3D.jsx            # Three.js 3D room scene
    │   │   ├── 📄 FurnitureModel.jsx    # Load + place a 3D furniture model
    │   │   ├── 📄 RoomBox.jsx           # Floor + walls as 3D geometry
    │   │   ├── 📄 CameraControls.jsx    # Orbit/zoom/rotate controls
    │   │   └── 📄 Lighting.jsx          # Scene lighting setup
    │   │
    │   ├── 📁 colour/                   # Colour & shading tools (Ravindu)
    │   │   ├── 📄 ColourPanel.jsx       # Full colour control panel
    │   │   ├── 📄 ColourPicker.jsx      # Colour picker for furniture/walls
    │   │   ├── 📄 ShadingSlider.jsx     # Shading intensity slider
    │   │   └── 📄 ColourSwatch.jsx      # Preset colour swatches
    │   │
    │   ├── 📁 room/                     # Room setup components (Waruni)
    │   │   ├── 📄 RoomForm.jsx          # Form: width, height, shape, colours
    │   │   ├── 📄 ShapeSelector.jsx     # Pick room shape (rectangle, L-shape)
    │   │   └── 📄 RoomPreview.jsx       # Small live preview of room
    │   │
    │   └── 📁 ui/                       # Generic UI components (Navodya)
    │       ├── 📄 Button.jsx            # Reusable styled button
    │       ├── 📄 Modal.jsx             # Reusable modal/dialog
    │       ├── 📄 Toast.jsx             # Success/error notifications
    │       ├── 📄 LoadingSpinner.jsx    # Loading state indicator
    │       └── 📄 ConfirmDialog.jsx     # "Are you sure?" dialog
    │
    ├── 📁 context/                      # ─── GLOBAL STATE ────────────────────
    │   ├── 📄 AuthContext.jsx           # Login state, current user (Asantha)
    │   └── 📄 DesignContext.jsx         # Current design being edited (Sadaru)
    │
    ├── 📁 hooks/                        # ─── CUSTOM REACT HOOKS ──────────────
    │   ├── 📄 useAuth.js                # Access auth state easily (Asantha)
    │   ├── 📄 useDesign.js              # Access/update current design (Sadaru)
    │   └── 📄 useLocalStorage.js        # Save/load from localStorage (Asantha)
    │
    ├── 📁 services/                     # ─── BUSINESS LOGIC ──────────────────
    │   ├── 📄 authService.js            # Login, register, logout (Asantha)
    │   ├── 📄 designService.js          # Save, load, delete designs (Asantha)
    │   └── 📄 furnitureService.js       # Furniture catalogue data (Sadaru)
    │
    ├── 📁 data/                         # ─── STATIC DATA ─────────────────────
    │   ├── 📄 furnitureCatalogue.js     # All furniture items with dimensions
    │   └── 📄 defaultDesigns.js         # 6-7 sample room designs (FAQ req.)
    │
    └── 📁 utils/                        # ─── HELPER FUNCTIONS ─────────────────
        ├── 📄 scaleUtils.js             # Convert metres ↔ pixels
        ├── 📄 colourUtils.js            # Hex/RGB conversion, shading (Ravindu)
        └── 📄 storageUtils.js           # localStorage read/write helpers
```

---

## 👥 Who Owns What

| Member | Files They Write |
|--------|-----------------|
| **Navodya** | `App.jsx`, `main.jsx`, `LandingPage.jsx`, `UserDashboard.jsx`, `Navbar.jsx`, `Sidebar.jsx`, `ProtectedRoute.jsx`, `Button.jsx`, `Modal.jsx`, `Toast.jsx`, `LoadingSpinner.jsx`, `ConfirmDialog.jsx`, `index.css` |
| **Sadaru** | `DesignEditor.jsx`, `Canvas2D.jsx`, `FurniturePalette.jsx`, `FurnitureItem.jsx`, `RoomGrid.jsx`, `ScaleBar.jsx`, `DesignContext.jsx`, `useDesign.js`, `furnitureService.js`, `furnitureCatalogue.js`, `scaleUtils.js` |
| **Mayumi** | `View3D.jsx`, `UserView3D.jsx`, `Room3D.jsx`, `FurnitureModel.jsx`, `RoomBox.jsx`, `CameraControls.jsx`, `Lighting.jsx` |
| **Asantha** | `LoginPage.jsx`, `RegisterPage.jsx`, `AdminDashboard.jsx`, `DesignDetail.jsx`, `AuthContext.jsx`, `useAuth.js`, `useLocalStorage.js`, `authService.js`, `designService.js`, `storageUtils.js` |
| **Ravindu** | `ColourPanel.jsx`, `ColourPicker.jsx`, `ShadingSlider.jsx`, `ColourSwatch.jsx`, `colourUtils.js` |
| **Waruni** | `RoomSetup.jsx`, `UserRoomSetup.jsx`, `RoomForm.jsx`, `ShapeSelector.jsx`, `RoomPreview.jsx` |

---

## 🔀 How Pages Connect (Routes)

```
/                    → LandingPage        (everyone sees this)
/login               → LoginPage          (Admin or User login)
/register            → RegisterPage       (create account)

/admin/dashboard     → AdminDashboard     (designer's saved designs)
/admin/room-setup    → RoomSetup          (create new design - step 1)
/admin/editor/:id    → DesignEditor       (2D canvas - step 2)
/admin/view3d/:id    → View3D             (3D view - step 3)
/admin/design/:id    → DesignDetail       (view/edit saved design)

/user/dashboard      → UserDashboard      (customer home)
/user/room-setup     → UserRoomSetup      (customer room setup)
/user/view3d/:id     → UserView3D         (customer 3D view, read-only)
```

---

## 💾 Data Flow (how data moves through the app)

```
User fills RoomForm
       ↓
DesignContext stores { room, furnitureList }
       ↓
Canvas2D reads + updates furnitureList (drag/drop/colour)
       ↓
Room3D reads same furnitureList → renders in 3D
       ↓
designService.save() → writes to localStorage
       ↓
AdminDashboard reads all saved designs → shows portfolio
```

---

## 📦 package.json Dependencies

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "three": "^0.160.x",
    "@react-three/fiber": "^8.x",
    "@react-three/drei": "^9.x"
  },
  "devDependencies": {
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x"
  }
}
```

Install command:
```bash
npm create vite@latest furniviz-web -- --template react
cd furniviz-web
npm install
npm install three @react-three/fiber @react-three/drei react-router-dom
```
