# Andy Deris Portfolio

A modern portfolio website built with React, TypeScript, Vite, and Tailwind CSS, featuring an admin dashboard with Firebase integration.

## Features

- **Public Portfolio** - Showcase projects and information
- **Admin Dashboard** - Protected admin area for content management
- **Authentication** - Login system with protected routes
- **Responsive Design** - Built with Tailwind CSS
- **Animations** - Smooth transitions with Motion

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS 4
- **Routing:** React Router DOM 7
- **Backend/Database:** Firebase (Firestore)
- **Icons:** Lucide React
- **Animations:** Motion

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd andyderis-portfolio
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase and Google GenAI credentials.

4. Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run clean` - Remove dist directory
- `npm run lint` - Run TypeScript type checking

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── AdminLayout.tsx
│   └── ProtectedRoute.tsx
├── pages/            # Page components
│   ├── Admin/        # Admin dashboard pages
│   ├── Home.tsx      # Public homepage
│   └── Login.tsx     # Login page
├── firebase.ts       # Firebase configuration
├── App.tsx           # Main app with routing
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Firestore Database
3. Configure authentication if needed
4. Update `firebase-blueprint.json` or `firebase-applet-config.json` with your settings
5. Add your Firebase config to `.env.local`