# alycodes-react

Personal website for Aly Raffauf built with React, TypeScript, and Vite.

## Description

A modern, responsive personal website featuring a cyberpunk-inspired design with neon pink aesthetics. The site includes a blog, portfolio projects, and personal information.

## Features

- ⚡ Built with Vite for fast development and optimized builds
- ⚛️ React 18 with TypeScript for type safety
- 🎨 Cyberpunk-themed UI with custom CSS
- 📝 Blog system with markdown support
- 🖼️ Syntax highlighting with Prism.js
- 📱 Responsive design for all devices
- 🚀 Optimized bundle splitting and performance

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Custom CSS with cyberpunk aesthetics
- **Syntax Highlighting**: Prism.js
- **Fonts**: Fira Code, Orbitron

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The site will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Blog

The blog system automatically generates an index from markdown files in the `public/blog/` directory. To add a new blog post:

1. Create a new `.md` file in `public/blog/`
2. Run `npm run blog:index` to regenerate the index
3. The blog index is automatically updated during the build process

## Project Structure

```
alycodes/
├── public/
│   └── blog/           # Blog markdown files
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── styles/        # CSS files
│   └── main.tsx       # App entry point
├── scripts/           # Build and utility scripts
└── dist/             # Production build output
```

## License

This is a personal website project. All content and code are proprietary to Aly Raffauf.

## Contact

For questions or inquiries, please visit the website or reach out through the contact information provided there.