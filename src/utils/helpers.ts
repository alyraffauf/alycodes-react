/**
 * Essential utility functions used across components
 * Optimized for performance with caching and minimal dependencies
 */

// Cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Terminal animation handling
export const handleTerminalClose = (
  setIsClosing: (value: boolean) => void,
  setIsVisible: (value: boolean) => void,
  delay: number = 300,
): void => {
  setIsClosing(true);
  setTimeout(() => {
    setIsVisible(false);
    setIsClosing(false);
  }, delay);
};

// Keyboard event handling for accessibility
export const handleEnterKeyPress = (
  e: React.KeyboardEvent,
  callback: () => void,
): void => {
  if (e.key === "Enter") {
    callback();
  }
};

// Skill category color mapping - memoized
const skillColorMap = new Map<string, string>([
  ["frontend", "var(--neon-pink)"],
  ["backend", "var(--cyber-blue)"],
  ["language", "var(--electric-purple)"],
  ["database", "var(--warning-orange)"],
  ["devops", "var(--success-green)"],
  ["cloud", "var(--cyber-blue)"],
  ["api", "var(--electric-purple)"],
]);

export const getSkillColor = (category: string): string => {
  return skillColorMap.get(category) || "var(--neon-pink)";
};

// Cache utilities
const getCachedData = <T>(key: string): T | null => {
  const cached = apiCache.get(key);
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > CACHE_DURATION) {
    apiCache.delete(key);
    return null;
  }

  return cached.data;
};

const setCachedData = <T>(key: string, data: T): void => {
  apiCache.set(key, { data, timestamp: Date.now() });
};

// GitHub API utilities with caching
export const fetchGitHubStars = async (username: string): Promise<number> => {
  const cacheKey = `github_stars_${username}`;
  const cached = getCachedData<number>(cacheKey);

  if (cached !== null) return cached;

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`,
      {
        headers: { Accept: "application/vnd.github.v3+json" },
      },
    );

    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

    const repos = await response.json();
    const totalStars = repos.reduce(
      (total: number, repo: any) => total + (repo.stargazers_count || 0),
      0,
    );

    setCachedData(cacheKey, totalStars);
    return totalStars;
  } catch (error) {
    console.error("Error fetching GitHub stars:", error);
    const expiredCache = apiCache.get(cacheKey);
    if (expiredCache) return expiredCache.data;
    throw error;
  }
};

export const fetchGitHubRepoCount = async (
  username: string,
): Promise<number> => {
  const cacheKey = `github_repos_${username}`;
  const cached = getCachedData<number>(cacheKey);

  if (cached !== null) return cached;

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`,
      {
        headers: { Accept: "application/vnd.github.v3+json" },
      },
    );

    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

    const repos = await response.json();
    const repoCount = repos.length;

    setCachedData(cacheKey, repoCount);
    return repoCount;
  } catch (error) {
    console.error("Error fetching GitHub repo count:", error);
    const expiredCache = apiCache.get(cacheKey);
    if (expiredCache) return expiredCache.data;
    throw error;
  }
};

export const fetchBlueskyProfile = async (
  handle: string,
): Promise<{ followers: number; posts: number }> => {
  const cacheKey = `bluesky_${handle}`;
  const cached = getCachedData<{ followers: number; posts: number }>(cacheKey);

  if (cached !== null) return cached;

  try {
    const response = await fetch(
      `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${handle}`,
      {
        headers: { Accept: "application/json" },
      },
    );

    if (!response.ok) throw new Error(`Bluesky API error: ${response.status}`);

    const profile = await response.json();
    const result = {
      followers: profile.followersCount || 0,
      posts: profile.postsCount || 0,
    };

    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Error fetching Bluesky profile:", error);
    const expiredCache = apiCache.get(cacheKey);
    if (expiredCache) return expiredCache.data;
    throw error;
  }
};

// Blog utility functions
export interface BlogFrontmatter {
  title: string;
  date: string;
  tags?: string[];
  description?: string;
  slug?: string;
  [key: string]: any;
}

export interface ParsedMarkdown {
  frontmatter: BlogFrontmatter;
  content: string;
}

export const parseMarkdownWithFrontmatter = (
  markdownContent: string,
): ParsedMarkdown => {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdownContent.match(frontmatterRegex);

  if (!match) {
    return {
      frontmatter: {
        title: "Untitled",
        date: new Date().toISOString().split("T")[0],
      },
      content: markdownContent,
    };
  }

  const yamlContent = match[1];
  const content = match[2];

  const frontmatter: BlogFrontmatter = {
    title: "Untitled",
    date: new Date().toISOString().split("T")[0],
  };

  try {
    const lines = yamlContent.split("\n");
    let currentKey: string | null = null;
    let currentArray: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith("- ")) {
        if (currentKey) {
          let item = trimmed
            .substring(2)
            .trim()
            .replace(/^["']|["']$/g, "");
          currentArray.push(item);
        }
        continue;
      }

      if (currentKey && currentArray.length > 0) {
        (frontmatter as any)[currentKey] = currentArray;
        currentKey = null;
        currentArray = [];
      }

      const colonIndex = line.indexOf(":");
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        let value = line
          .substring(colonIndex + 1)
          .trim()
          .replace(/^["']|["']$/g, "");

        if (value === "" || value === null) {
          currentKey = key;
          currentArray = [];
        } else if (
          key === "tags" &&
          value.startsWith("[") &&
          value.endsWith("]")
        ) {
          frontmatter.tags = value
            .slice(1, -1)
            .split(",")
            .map((tag) => tag.trim().replace(/^["']|["']$/g, ""))
            .filter(Boolean);
        } else {
          (frontmatter as any)[key] = value;
        }
      }
    }

    if (currentKey && currentArray.length > 0) {
      (frontmatter as any)[currentKey] = currentArray;
    }
  } catch (error) {
    console.warn("Error parsing frontmatter:", error);
  }

  return { frontmatter, content };
};

export const formatFileSize = (content: string): string => {
  const bytes = new TextEncoder().encode(content).length;
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

export const formatBlogDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) throw new Error("Invalid date");
    return dateString; // Return YYYY-MM-DD format as-is
  } catch (error) {
    console.warn("Error formatting date:", dateString, error);
    return new Date().toISOString().split("T")[0];
  }
};
