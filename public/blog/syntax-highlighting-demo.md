---
title: "Syntax Highlighting Demo"
date: "2024-01-20"
tags: ["Demo", "Code", "Syntax", "Highlighting"]
description: "A demonstration of syntax highlighting across multiple programming languages"
---

# Syntax Highlighting Demo

This post showcases the syntax highlighting capabilities of the blog with various programming languages and code examples.

## JavaScript/TypeScript

Here's some TypeScript with React:

```typescript
interface BlogPost {
  id: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
}

const BlogComponent: React.FC<{ post: BlogPost }> = ({ post }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    console.log(`Loading post: ${post.title}`);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000);
  }, [post.id]);

  return (
    <article className="blog-post">
      <h1>{post.title}</h1>
      <div className="post-meta">
        {post.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
      {isLoading ? <div>Loading...</div> : <div>{post.content}</div>}
    </article>
  );
};
```

## CSS with Cyberpunk Styling

```css
.cyberpunk-button {
  background: transparent;
  border: 2px solid var(--neon-pink);
  color: var(--neon-pink);
  padding: 12px 24px;
  font-family: "Fira Code", monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.cyberpunk-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, var(--neon-pink), transparent);
  transition: left 0.5s;
}

.cyberpunk-button:hover {
  background: var(--neon-pink);
  color: var(--terminal-bg);
  box-shadow: 0 0 20px var(--neon-pink);
  transform: translateY(-2px);
}

.cyberpunk-button:hover::before {
  left: 100%;
}
```

## Nix Configuration

```nix
{ config, pkgs, ... }:

{
  # System configuration
  networking.hostName = "cyberpunk-workstation";
  networking.firewall.enable = true;
  
  # Enable services
  services = {
    openssh.enable = true;
    postgresql = {
      enable = true;
      package = pkgs.postgresql_15;
      dataDir = "/var/lib/postgresql/15";
    };
  };

  # User configuration
  users.users.aly = {
    isNormalUser = true;
    extraGroups = [ "wheel" "docker" "networkmanager" ];
    packages = with pkgs; [
      firefox
      vscode
      git
      nodejs
      rust-analyzer
    ];
  };

  # Development environment
  environment.systemPackages = with pkgs; [
    vim
    tmux
    curl
    jq
    ripgrep
  ];
}
```

## Rust Code

```rust
use std::collections::HashMap;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct BlogPost {
    id: String,
    title: String,
    content: String,
    tags: Vec<String>,
    published: bool,
}

impl BlogPost {
    fn new(title: &str, content: &str) -> Self {
        Self {
            id: uuid::Uuid::new_v4().to_string(),
            title: title.to_string(),
            content: content.to_string(),
            tags: Vec::new(),
            published: false,
        }
    }

    fn add_tag(&mut self, tag: &str) {
        if !self.tags.contains(&tag.to_string()) {
            self.tags.push(tag.to_string());
        }
    }

    fn publish(&mut self) -> Result<(), &'static str> {
        if self.title.is_empty() || self.content.is_empty() {
            return Err("Title and content cannot be empty");
        }
        self.published = true;
        Ok(())
    }
}

fn main() {
    let mut post = BlogPost::new("Cyberpunk Blog", "Welcome to the future!");
    post.add_tag("cyberpunk");
    post.add_tag("rust");
    
    match post.publish() {
        Ok(_) => println!("Post published: {}", post.title),
        Err(e) => eprintln!("Failed to publish: {}", e),
    }
}
```

## Python

```python
from typing import List, Dict, Optional
import asyncio
import aiohttp
from dataclasses import dataclass

@dataclass
class BlogPost:
    title: str
    content: str
    tags: List[str]
    published: bool = False
    
    def add_tag(self, tag: str) -> None:
        """Add a tag if it doesn't already exist."""
        if tag not in self.tags:
            self.tags.append(tag)
    
    @property
    def word_count(self) -> int:
        """Calculate the word count of the content."""
        return len(self.content.split())

class BlogManager:
    def __init__(self):
        self.posts: Dict[str, BlogPost] = {}
    
    async def fetch_post_data(self, url: str) -> Optional[Dict]:
        """Fetch post data from an API."""
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(url) as response:
                    if response.status == 200:
                        return await response.json()
            except aiohttp.ClientError as e:
                print(f"Error fetching data: {e}")
        return None
    
    def create_post(self, title: str, content: str, tags: List[str] = None) -> BlogPost:
        """Create a new blog post."""
        post = BlogPost(
            title=title,
            content=content,
            tags=tags or []
        )
        self.posts[title] = post
        return post

# Usage example
async def main():
    manager = BlogManager()
    post = manager.create_post(
        "Cyberpunk Python",
        "Building the future with Python and neon lights!",
        ["python", "cyberpunk", "async"]
    )
    
    data = await manager.fetch_post_data("https://api.example.com/posts")
    if data:
        print(f"Fetched {len(data)} posts")

if __name__ == "__main__":
    asyncio.run(main())
```

## Bash/Shell

```bash
#!/bin/bash

# Cyberpunk development environment setup script
set -euo pipefail

NEON_PINK='\033[95m'
CYBER_BLUE='\033[96m'
RESET='\033[0m'

log_info() {
    echo -e "${CYBER_BLUE}[INFO]${RESET} $1"
}

log_success() {
    echo -e "${NEON_PINK}[SUCCESS]${RESET} $1"
}

install_dependencies() {
    log_info "Installing cyberpunk development tools..."
    
    # Update package list
    sudo apt update
    
    # Install essential tools
    sudo apt install -y \
        curl \
        git \
        vim \
        tmux \
        jq \
        ripgrep \
        bat \
        exa
    
    # Install Node.js
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
    
    # Install Rust
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source ~/.cargo/env
    
    log_success "Dependencies installed successfully!"
}

setup_cyberpunk_theme() {
    log_info "Setting up cyberpunk terminal theme..."
    
    # Create cyberpunk color scheme
    cat > ~/.cyberpunk_colors << 'EOF'
export NEON_PINK='\033[95m'
export CYBER_BLUE='\033[96m'
export ELECTRIC_PURPLE='\033[94m'
export WARNING_ORANGE='\033[93m'
export RESET='\033[0m'
EOF
    
    # Add to bashrc
    echo "source ~/.cyberpunk_colors" >> ~/.bashrc
    
    log_success "Cyberpunk theme configured!"
}

main() {
    log_info "Starting cyberpunk development environment setup..."
    
    install_dependencies
    setup_cyberpunk_theme
    
    log_success "Setup complete! Welcome to the cyberpunk future! 🚀"
}

main "$@"
```

## JSON Configuration

```json
{
  "name": "cyberpunk-blog",
  "version": "2.0.0",
  "description": "A cyberpunk-themed blog with syntax highlighting",
  "main": "index.js",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "jest",
    "lint": "eslint src/**/*.{ts,tsx}",
    "format": "prettier --write src/**/*.{ts,tsx,css,md}"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^7.8.2",
    "prismjs": "^1.29.0"
  },
  "devDependencies": {
    "@types/prismjs": "^1.26.0",
    "@types/react": "^19.1.12",
    "@types/react-dom": "^19.1.9",
    "@vitejs/plugin-react": "^5.0.2",
    "typescript": "^5.9.2",
    "vite": "^7.1.4"
  },
  "keywords": [
    "cyberpunk",
    "blog",
    "react",
    "typescript",
    "syntax-highlighting",
    "terminal",
    "neon"
  ],
  "author": "Aly Raffauf",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/alyraffile/cyberpunk-blog.git"
  }
}
```

## YAML Configuration

```yaml
# Docker Compose for cyberpunk blog
version: '3.8'

services:
  blog:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - CYBERPUNK_MODE=enabled
    volumes:
      - ./public/blog:/app/blog
    networks:
      - cyberpunk-net
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.blog.rule=Host(`blog.cyberpunk.dev`)"

  database:
    image: postgres:15
    environment:
      - POSTGRES_DB=cyberpunk_blog
      - POSTGRES_USER=neo
      - POSTGRES_PASSWORD=matrix123
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - cyberpunk-net
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - cyberpunk-net
    restart: unless-stopped

networks:
  cyberpunk-net:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
```

## SQL

```sql
-- Cyberpunk blog database schema
CREATE DATABASE cyberpunk_blog;
USE cyberpunk_blog;

-- Posts table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author_id UUID REFERENCES users(id)
);

-- Tags table
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#ff69b4',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Post tags junction table
CREATE TABLE post_tags (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- Insert some cyberpunk tags
INSERT INTO tags (name, color) VALUES
('cyberpunk', '#ff69b4'),
('neon', '#00ffff'),
('terminal', '#da70d6'),
('hacking', '#ff8800'),
('future', '#00ff88');

-- Query to get posts with their tags
SELECT 
    p.title,
    p.slug,
    p.excerpt,
    p.published,
    p.created_at,
    STRING_AGG(t.name, ', ') as tags
FROM posts p
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
WHERE p.published = TRUE
GROUP BY p.id, p.title, p.slug, p.excerpt, p.published, p.created_at
ORDER BY p.created_at DESC;
```

## Summary

This demonstrates syntax highlighting for:
- TypeScript/JavaScript with React
- CSS with custom properties
- Nix configuration language
- Rust with error handling
- Python with async/await and dataclasses
- Bash scripting with colors
- JSON configuration
- YAML for Docker Compose
- SQL for database schemas

Each language should now have proper syntax highlighting with cyberpunk-themed colors that match the overall aesthetic of the blog!