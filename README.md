# alycodes-react

[![Build and Push Docker Image](https://github.com/alyraffauf/alycodes-react/actions/workflows/docker.yml/badge.svg)](https://github.com/alyraffauf/alycodes-react/actions/workflows/docker.yml)

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

## Nix Flake

This project includes a comprehensive Nix flake for reproducible builds and development environments.

### Available Commands

- **`nix run`** - Start development server (npm start)
- **`nix run .#build`** - Build production app (npm run build)
- **`nix run .#serve`** - Build and serve with preview
- **`nix develop`** - Enter development shell with Node.js
- **`nix build`** - Build the website as a Nix package
- **`nix build .#docker`** - Build Docker image with nginx

### Docker Deployment

The flake builds a production-ready Docker image with nginx:

```bash
# Build the Docker image
nix build .#docker

# Load into Docker (if Docker is available)
docker load < result

# Run the container
docker run -p 8080:80 alycodes-react:latest
```

The Docker image includes:
- Optimized nginx configuration
- Gzip compression
- Static asset caching
- Security headers
- Client-side routing support

### GitHub Container Registry

The project includes a GitHub workflow that automatically builds and pushes Docker images to the GitHub Container Registry on every push to master:

```bash
# Pull the latest image from GitHub Container Registry
docker pull ghcr.io/alyraffauf/alycodes-react:latest

# Run the container
docker run -p 8080:80 ghcr.io/alyraffauf/alycodes-react:latest
```

Available tags:
- `latest` - Latest build from master branch
- `master-<sha>` - Specific commit builds
- Semantic version tags (if using releases)

The workflow automatically:
- Builds the Docker image using Nix
- Tags with appropriate version information
- Pushes to `ghcr.io/alyraffauf/alycodes-react`
- Uses GitHub's built-in authentication

## License

This is a personal website project. All content and code are proprietary to Aly Raffauf.

## Contact

For questions or inquiries, please visit the website or reach out through the contact information provided there.