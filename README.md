# ASHA Worker App

A mobile healthcare application designed for **ASHA (Accredited Social Health Activist) workers** in rural India. Built with Expo, React Native, and TypeScript, this offline-first app enables healthcare workers to manage medicine deliveries, track tasks, and navigate patient locations even in low-connectivity environments.

![TypeScript](https://img.shields.io/badge/TypeScript-97.1%25-3178C6?style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-2.9%25-F7DF1E?style=flat-square)
![Expo](https://img.shields.io/badge/Expo-~54.0.29-000020?style=flat-square)
![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=flat-square)

## 🌟 Features

- **📱 Offline-First Architecture** - Works seamlessly in low-connectivity environments with automatic sync when online
- **🌐 Multi-Language Support** - Available in 8+ Indian regional languages (Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam)
- **📍 Offline Maps & Navigation** - Pre-cached map tiles with GPS navigation to patient locations
- **📷 QR Code Scanning** - Camera-based medicine verification for pickup and delivery
- **✅ Task Management** - Color-coded priority system (Urgent/Pending/Ready) with real-time updates
- **🔐 Secure Authentication** - Phone number + OTP login with offline fallback
- **📸 Delivery Verification** - Photo or thumbprint-based patient verification
- **🎨 Accessible Design** - Large touch targets, WCAG AA compliant, supports gloves usage

## 🏗️ Tech Stack

### Frontend
- **Framework:** Expo SDK ~54.0.29, React Native 0.81.5
- **Language:** TypeScript 5.9.3, JavaScript
- **Navigation:** Expo Router 6.0, React Navigation 7.x
- **Styling:** NativeWind (Tailwind CSS for React Native), CSS
- **State Management:** TanStack React Query 5.x
- **Database:** Expo SQLite, Drizzle ORM 0.44

### Backend
- **Server:** Express.js 4.x, Node.js
- **API:** tRPC 11.7 (end-to-end typesafe APIs)
- **Database:** MySQL 2, PostgreSQL (via Drizzle)
- **Authentication:** JWT (jose 6.1)

### Key Libraries
- **Maps:** MapLibre GL, React Native Maps
- **QR Scanning:** Expo Barcode Scanner, Expo Camera
- **UI Components:** Expo Vector Icons, React Native Gesture Handler, Reanimated
- **Forms & Validation:** Zod 4.x
- **Testing:** Vitest 2.x

### Development Tools
- **Package Manager:** pnpm 9.12.0
- **Build:** esbuild, Metro bundler
- **Linting:** ESLint 9.x, Prettier 3.x
- **Type Checking:** TypeScript

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **pnpm** (v9.12.0 or higher) - [Install Guide](https://pnpm.io/installation)
- **Expo CLI** - Will be installed with dependencies
- **Git** - [Download](https://git-scm.com/)

For mobile development:
- **iOS:** Xcode 15+ (macOS only)
- **Android:** Android Studio with SDK 33+

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Iffat-A-Ansari/asha-worker-app.git
cd asha-worker-app
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL=your_database_url

# Server
NODE_ENV=development
EXPO_PORT=8081

# Add other required environment variables
```

### 4. Set Up the Database

```bash
pnpm db:push
```

This will generate and run database migrations using Drizzle Kit.

### 5. Start the Development Server

```bash
pnpm dev
```

This concurrently starts:
- The Metro bundler for the React Native app
- The Express.js backend server

### 6. Run on Your Device

**Option A: Expo Go (Recommended for Development)**
1. Install [Expo Go](https://expo.dev/go) on your iOS/Android device
2. Scan the QR code displayed in the terminal
3. App will load on your device

**Option B: iOS Simulator (macOS)**
```bash
pnpm ios
```

**Option C: Android Emulator**
```bash
pnpm android
```

**Option D: Web Browser**
```bash
pnpm dev:metro
```
Then open the URL shown in the terminal (usually http://localhost:8081)

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start both frontend and backend in development mode |
| `pnpm dev:server` | Start backend server only (watch mode) |
| `pnpm dev:metro` | Start Expo development server |
| `pnpm build` | Build production server bundle |
| `pnpm start` | Start production server |
| `pnpm check` | Run TypeScript type checking |
| `pnpm lint` | Run ESLint on the codebase |
| `pnpm format` | Format code with Prettier |
| `pnpm test` | Run tests with Vitest |
| `pnpm db:push` | Generate and apply database migrations |
| `pnpm android` | Run on Android device/emulator |
| `pnpm ios` | Run on iOS simulator |
| `pnpm qr` | Generate QR code for easy app access |

## 📁 Project Structure

```
asha-worker-app/
├── app/                    # Expo Router app directory
├── assets/images/          # Static assets and images
├── components/             # Reusable UI components
├── constants/              # App-wide constants and config
├── drizzle/                # Database schema and migrations
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries and helpers
├── scripts/                # Build and automation scripts
├── server/                 # Express.js backend server
│   └── _core/              # Core server logic
├── shared/                 # Shared types and utilities
├── tests/                  # Test files
├── global.css              # Global styles
├── app.config.ts           # Expo configuration
├── drizzle.config.ts       # Drizzle ORM configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vercel.json             # Vercel deployment config
```

## 🌐 Deployment

### Web Deployment (Vercel)

The app can be deployed to Vercel for web access:

1. **Connect Repository:** Link your GitHub repo to Vercel
2. **Configure Build:** Vercel auto-detects Expo/Next.js projects
3. **Set Environment Variables:** Add all required env vars in Vercel dashboard
4. **Deploy:** Push to main branch or run `vercel` CLI

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

### Mobile Deployment (Expo EAS)

For production mobile apps:

```bash
# Install EAS CLI
pnpm add -g eas-cli

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## 🧪 Testing

Run the test suite:

```bash
pnpm test
```

Write tests in the `tests/` directory using Vitest:

```typescript
import { describe, it, expect } from 'vitest'

describe('Example Test', () => {
  it('should pass', () => {
    expect(true).toBe(true)
  })
})
```

## 🎨 Design System

The app follows a comprehensive design system optimized for rural healthcare workers:

- **Color Palette:** Primary (#0A7EA4), Success (#22C55E), Warning (#F59E0B), Error (#EF4444)
- **Typography:** System fonts with size scaling (12px-32px)
- **Spacing:** 8px base unit (8px, 16px, 24px)
- **Touch Targets:** Minimum 44x44px for accessibility
- **Dark Mode:** Full dark theme support

See [design.md](./design.md) for complete design specifications.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Write tests for new features
- Maintain WCAG AA accessibility standards
- Test on both online and offline scenarios
- Support all 8+ languages in UI changes

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Developer:** [Iffat-A-Ansari](https://github.com/Iffat-A-Ansari)

## 🙏 Acknowledgments

- ASHA workers across India for their invaluable feedback
- Rural healthcare communities who inspired this solution
- Open-source contributors of Expo, React Native, and TypeScript ecosystems

## 📞 Support

For issues, questions, or contributions, please:
- Open an [Issue](https://github.com/Iffat-A-Ansari/asha-worker-app/issues)
- Check existing [documentation](./design.md)
- Review [deployment guides](./DEPLOYMENT_GUIDE.md)

---

**Built with ❤️ for rural India's healthcare heroes**
