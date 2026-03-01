# ASHA Worker App - Mobile Design Specification

## Design Philosophy

The ASHA Worker App is designed for **healthcare workers in rural India** who operate in low-connectivity environments. The design prioritizes:

- **One-handed usage** on mobile devices (portrait 9:16 orientation)
- **Large, accessible touch targets** for workers wearing gloves or working in dusty conditions
- **Offline-first functionality** with clear sync status indicators
- **Minimal cognitive load** with color-coded task priorities
- **Accessibility** supporting 8+ Indian regional languages

---

## Screen List

### Authentication & Onboarding
1. **Splash Screen** — App branding with offline-ready indicator
2. **Language Selection** — 8+ Indian languages (Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam)
3. **Login Screen** — Phone number + OTP, with offline fallback
4. **Profile Confirmation** — Verify worker identity, assigned zone, villages

### Core App Screens
5. **Home Dashboard** — Daily task overview, network status, sync queue
6. **Task List** — Detailed list of all assigned tasks with filtering
7. **QR Scan Screen** — Camera-based QR code scanning (pickup/delivery)
8. **Scan Result Screen** — Confirmation of scanned medicine details
9. **Navigation Screen** — Offline map with route to patient home
10. **Delivery Confirmation** — Photo/thumbprint verification at patient location
11. **Sync Status Screen** — Pending items, sync history, manual sync trigger
12. **Profile Screen** — Worker info, settings, language preference

---

## Primary Content & Functionality

### 1. Splash Screen
**Content:**
- ASHA Worker App logo (centered, 120px)
- Loading indicator (animated spinner)
- "Offline-ready" badge below logo

**Functionality:**
- Auto-advance to language selection after 2 seconds
- Persist language preference from previous session

---

### 2. Language Selection
**Content:**
- Title: "Choose Your Language"
- Radio button list: Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam
- "Continue" button (disabled until selection)

**Functionality:**
- Save language preference to AsyncStorage
- Apply language to entire app immediately
- All subsequent screens in selected language

---

### 3. Login Screen
**Content:**
- Title: "Login to ASHA Worker"
- Phone number input field (10 digits, Indian format)
- "Send OTP" button
- "Continue in Offline Mode" link (fallback)
- Status indicator (Online/Offline)

**Functionality:**
- Validate phone number format
- Send OTP via API (when online)
- Store OTP locally for offline verification
- Allow offline mode with cached credentials

---

### 4. Profile Confirmation
**Content:**
- Worker name (editable text field)
- ASHA ID (read-only, from API)
- Assigned zone (read-only dropdown)
- Villages list (scrollable, showing assigned villages)
- Photo upload button (optional)
- "Confirm & Continue" button

**Functionality:**
- Fetch worker profile from API
- Allow photo capture or gallery selection
- Validate all required fields
- Save profile to local database

---

### 5. Home Dashboard (Main Screen)
**Content:**
- **Header Section:**
  - Time display (top-left)
  - Greeting: "Hi, [Worker Name]"
  - Zone: "Zone: [Zone Name]"
  
- **Status Bar:**
  - Network indicator (🟢 ONLINE / 🔴 OFFLINE)
  - Pending sync count: "📶 5 pending sync"
  
- **Task Summary Cards (Color-Coded):**
  - 🔴 **URGENT (Red)** — Tasks overdue or due today
    - Show 2-3 sample tasks with distance and timer
  - 🟡 **PENDING (Yellow)** — Tasks for this week
    - Show completion progress: "✅ 3 Completed Today | ⏳ 2 Remaining"
  - 🟢 **READY AT CLINIC (Green)** — Medicines ready for pickup
    - Show count and "Pick up before 5pm" note
  
- **Bottom Action Buttons (4 columns):**
  - 📸 SCAN QR
  - 🗺️ MAP VIEW
  - 📋 ALL TASKS
  - 👤 PROFILE

**Functionality:**
- Real-time network status detection
- Auto-update task counts every 30 seconds
- Tap cards to navigate to task details
- Tap buttons for quick actions
- Pull-to-refresh to sync pending items

---

### 6. Task List Screen
**Content:**
- Filter tabs: "All", "Urgent", "Pending", "Completed"
- Task cards showing:
  - Patient name
  - Distance (km)
  - Priority badge (Red/Yellow/Green)
  - Status icon (⏳ pending, ✅ completed)
  - Estimated time to reach

**Functionality:**
- Filter tasks by status
- Sort by distance or priority
- Tap task to view details
- Swipe to mark complete (optional)

---

### 7. QR Scan Screen
**Content:**
- Header: "← Back | SCAN QR CODE"
- Full-screen camera view
- QR frame overlay (centered, 200x200px)
- Instruction text: "Position QR code in frame"
- Bottom controls:
  - 🔦 Flashlight toggle
  - 📱 Gallery (select from photos)

**Functionality:**
- Camera permission handling
- Real-time QR detection
- Flashlight on/off toggle
- Gallery image selection for offline scanning
- Auto-advance to result screen on successful scan
- Store scan locally with timestamp + GPS if offline

---

### 8. Scan Result Screen
**Content:**
- ✅ SCAN SUCCESSFUL (green banner)
- Medicine details:
  - Inhaler ID: VIX-45821
  - Medicine name: Salbutamol
  - Expiry date: Dec 2026
  - Verified by: Clinic Ranipur
- Patient assignment:
  - Assigned to: Ram Lal
  - Village: Bhadwari (8km)
- Action buttons:
  - [CONFIRM PICKUP] (primary)
  - [SCAN AGAIN] (secondary)
  - [VIEW ON MAP] (tertiary)

**Functionality:**
- Display scanned QR data
- Fetch medicine details from local database
- Confirm pickup (update task status)
- Option to scan another medicine
- Navigate to map view for patient location

---

### 9. Navigation Screen
**Content:**
- Header: "← Back | TO: Ram Lal"
- Offline map (cached tiles)
  - Current location: 🧭 YOU
  - Patient location: 🏠 PATIENT
  - Route line connecting both
- Distance: 8.2 km
- Estimated time: 20 mins walking
- Action buttons:
  - [📍 START NAVIGATION] (primary)
  - [📞 CALL PATIENT] (secondary)

**Functionality:**
- Load offline map tiles (pre-cached when online)
- Show current location (GPS)
- Show patient location from task data
- Calculate route distance and time
- Launch turn-by-turn navigation (Google Maps/Apple Maps)
- Call patient directly (phone integration)

---

### 10. Delivery Confirmation Screen
**Content:**
- Header: "← Back | DELIVER TO: Ram Lal"
- **Step 1: Scan Inhaler QR**
  - [SCAN QR CODE] button
- **Step 2: Patient Verification (choose one)**
  - [📸 TAKE PHOTO] — Capture patient holding inhaler
  - OR
  - [🖐️ THUMBPRINT] — Touch sensor verification
- **Confirmation**
  - [✓ CONFIRM DELIVERY] (primary button)

**Functionality:**
- Scan medicine QR to verify correct item
- Capture photo or thumbprint
- Store verification locally with timestamp + GPS
- Mark task as delivered
- Queue for sync when online
- Show success confirmation

---

### 11. Sync Status Screen
**Content:**
- Header: "← Back | SYNC STATUS"
- Current status: "📶 OFFLINE" or "🟢 ONLINE"
- Last sync time: "Today 10:23 AM"
- **Pending Items List:**
  - Item type (Pickup/Delivery/New Patient)
  - Medicine/Patient name
  - Status (pending/syncing/failed)
  - Timestamp
- Action buttons:
  - [🔄 SYNC NOW] (primary)
  - Note: "(Will auto-sync when online)"

**Functionality:**
- Display all pending sync items
- Show sync status for each item
- Manual sync trigger
- Auto-sync when network becomes available
- Retry failed syncs
- Show sync history (last 10 items)

---

### 12. Profile Screen
**Content:**
- Worker photo (circular, 80px)
- Worker name (editable)
- ASHA ID (read-only)
- Phone number (read-only)
- Assigned zone (read-only)
- Villages (scrollable list)
- Settings:
  - Language selection dropdown
  - Dark mode toggle
  - Notification preferences
- Logout button

**Functionality:**
- Edit worker name
- Change language (requires app restart)
- Toggle dark mode
- Manage notification settings
- Logout (clear local session)

---

## Key User Flows

### Flow 1: Daily Startup
1. User opens app → Splash screen (2 sec)
2. If not logged in → Language selection → Login → Profile confirmation
3. If logged in → Home dashboard (auto-sync pending items)
4. Display task summary and network status

### Flow 2: Pickup at Clinic
1. User taps "SCAN QR" on home screen
2. Camera opens → User positions QR code in frame
3. Successful scan → Result screen shows medicine details
4. User taps "CONFIRM PICKUP" → Task status updates to "picked_up"
5. Return to home dashboard

### Flow 3: Navigate to Patient
1. User taps "MAP VIEW" or selects task from list
2. Navigation screen opens with offline map
3. User taps "START NAVIGATION" → Opens Google Maps/Apple Maps
4. User follows turn-by-turn directions
5. Arrives at patient location

### Flow 4: Delivery Confirmation
1. User arrives at patient home
2. Taps task → Delivery confirmation screen
3. Scans medicine QR code
4. Captures photo or thumbprint of patient
5. Taps "CONFIRM DELIVERY" → Task marked as delivered
6. Queued for sync (if offline)

### Flow 5: Sync Pending Items
1. User goes online (network detected)
2. App auto-syncs pending items in background
3. User can manually tap "SYNC NOW" on sync status screen
4. Sync status updates in real-time
5. Failed items show retry option

---

## Color Palette

| Element | Light Mode | Dark Mode | Usage |
|---------|-----------|-----------|-------|
| **Primary** | #0A7EA4 | #0A7EA4 | Buttons, accents, active states |
| **Background** | #FFFFFF | #151718 | Screen background |
| **Surface** | #F5F5F5 | #1E2022 | Cards, elevated surfaces |
| **Foreground** | #11181C | #ECEDEE | Primary text |
| **Muted** | #687076 | #9BA1A6 | Secondary text, hints |
| **Border** | #E5E7EB | #334155 | Dividers, borders |
| **Success** | #22C55E | #4ADE80 | Completed tasks, success states |
| **Warning** | #F59E0B | #FBBF24 | Pending tasks, warnings |
| **Error** | #EF4444 | #F87171 | Urgent tasks, errors, offline |
| **Urgent (Red)** | #DC2626 | #EF4444 | Overdue tasks |
| **Pending (Yellow)** | #F59E0B | #FBBF24 | In-progress tasks |
| **Ready (Green)** | #10B981 | #34D399 | Ready for pickup |

---

## Typography

- **Headings (H1):** 32px, Bold, Foreground color
- **Headings (H2):** 24px, Semibold, Foreground color
- **Body Text:** 16px, Regular, Foreground color
- **Small Text:** 14px, Regular, Muted color
- **Labels:** 12px, Semibold, Muted color

---

## Spacing & Layout

- **Padding:** 16px (standard), 24px (large sections), 8px (compact)
- **Gap between elements:** 12px (standard), 16px (large)
- **Card border radius:** 12px
- **Button border radius:** 8px
- **Safe area insets:** Handled by ScreenContainer

---

## Interaction Patterns

### Touch Targets
- Minimum 44x44px for all interactive elements
- Larger for primary actions (56x56px)
- Adequate spacing to prevent accidental taps

### Feedback
- Button press: Scale 0.97 + haptic feedback (light)
- Card tap: Opacity 0.7
- Success action: Haptic feedback (success) + green banner
- Error: Haptic feedback (error) + red banner

### Loading States
- Spinner animation for async operations
- Skeleton screens for data loading
- "Syncing..." indicator during background sync

---

## Accessibility

- **Language Support:** 8+ Indian languages
- **Text Size:** Respects system font size settings
- **Color Contrast:** WCAG AA compliant (4.5:1 for text)
- **Touch Targets:** 44x44px minimum
- **Offline Indicators:** Always visible, clear status
- **Haptic Feedback:** Provides tactile confirmation

---

## Performance Considerations

- **Offline Maps:** Pre-cache zone maps when online
- **QR Scanning:** Use hardware acceleration
- **Database:** WatermelonDB for fast queries
- **Sync:** Background sync with exponential backoff
- **Images:** Compress photos before upload
- **Battery:** Minimize GPS polling, use geofencing

---

## Next Steps

1. Implement authentication flow (Language → Login → Profile)
2. Build home dashboard with task summary
3. Implement QR scanning with camera integration
4. Create offline map view with cached tiles
5. Build delivery confirmation with photo/thumbprint
6. Implement background sync logic
7. Polish UI with custom animations and transitions
8. Test on real devices with poor connectivity
