---
title: "Building Cyberpunk UIs with React and CSS"
date: "2024-01-15"
tags: ["React", "CSS", "Design", "Terminal", "Cyberpunk"]
description: "A deep dive into creating terminal-inspired interfaces with neon aesthetics"
---

# Building Cyberpunk UIs with React and CSS

In this post, I'll walk through creating the terminal-inspired, cyberpunk aesthetic that powers this portfolio site.

## The Vision

I wanted to create something that felt like a hacker's terminal from a sci-fi movie - complete with:
- Neon glow effects
- Monospace fonts (Fira Code)
- Terminal-style interactions
- Retro-futuristic color schemes

## Key CSS Techniques

### Glow Effects
```css
.text-glow {
  text-shadow: 0 0 10px var(--neon-pink);
}
```

### Terminal Styling
Using CSS Grid for the `ls -la` output format creates authentic terminal vibes while maintaining responsive design.

## React Component Architecture

Each "terminal window" is a reusable component with:
- Close/minimize/maximize controls
- Animated entrance/exit
- Touch gesture support

The result is an interface that's both nostalgic and modern.