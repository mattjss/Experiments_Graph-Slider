# Graph Slider

An elegant, smooth graph slider interaction design project inspired by Rauno Freiberg.

## Tech Stack

- **React 18** - Component framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library for smooth animations
- **ESLint & Prettier** - Code quality and formatting

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

Create a production build:

```bash
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

The production preview will be available at `http://localhost:4173` (or another port if 4173 is in use)

### Code Quality

Lint your code:

```bash
npm run lint
```

Format your code:

```bash
npm run format
```

## Project Structure

```
├── src/
│   ├── components/     # Reusable components
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # App entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
└── package.json        # Dependencies
```

## Design Philosophy

This project emphasizes:
- **Smooth interactions** - Every interaction should feel fluid and responsive
- **Micro-animations** - Subtle motion that enhances UX without distracting
- **Visual polish** - Attention to detail in every pixel
- **Performance** - 60fps animations and optimized rendering
