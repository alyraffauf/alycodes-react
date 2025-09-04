import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  handleTerminalClose,
  handleEnterKeyPress,
  fetchGitHubData,
  fetchBlueskyProfile,
  formatBlogDate,
} from "../utils/helpers";
import { highlightCode } from "../utils/syntaxHighlighter";
import { loadBlogPosts, BlogPost } from "../utils/blogUtils";
import useScrollRestoration from "../hooks/useScrollRestoration";

// Styles
import "./Hero.css";
import "./Hero.mobile.css";
import "./Blog.css";

// Constants
const INTRO_TEXT = "I build things sometimes.";
const TERMINAL_ANIMATION_DELAY = 300;
const PREVIEW_POST_COUNT = 5;

const BIO_TEXT = `Coder, cyclist, ThinkPad enthusiast, long-haul homelaber, GNU/Linux girl, and mid-tier keyboard snob.`;

const INITIAL_STATS_DATA: Array<{ key: string; value: string | number }> = [
  { key: "followers", value: "Loading..." },
  { key: "posts", value: "Loading..." },
  { key: "repos", value: "Loading..." },
  { key: "stargazers", value: "Loading..." },
];

const IDENTITY_DATA = [
  { key: "name", value: "Aly Raffauf" },
  { key: "location", value: "Atlanta, GA" },
  { key: "status", value: "AVAILABLE", isStatus: true },
];

// Simple blog post loading function

// Memoized blog post item component
const BlogPostItem = React.memo<{
  post: BlogPost;
  onPostClick: (post: BlogPost) => void;
  onKeyDown: (e: React.KeyboardEvent, post: BlogPost) => void;
}>(({ post, onPostClick, onKeyDown }) => (
  <div
    className="directory-entry"
    onClick={() => onPostClick(post)}
    onKeyDown={(e) => onKeyDown(e, post)}
    role="button"
    tabIndex={0}
  >
    <span className="permissions text-muted">-rw-r--r--</span>
    <span className="owner text-secondary">aly</span>
    <span className="group text-secondary">users</span>
    <span className="size text-warning">{post.size}</span>
    <span className="date text-muted">{formatBlogDate(post.date)}</span>
    <span className="post-name text-cyber">
      {post.slug.replace(/^\d{4}-\d{2}-\d{2}-/, "")}.md
    </span>
  </div>
));

BlogPostItem.displayName = "BlogPostItem";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { saveScrollPosition, restoreScrollPosition } =
    useScrollRestoration("home");

  // Ensure body scroll is enabled for home page (fix mobile scroll issues)
  useEffect(() => {
    document.body.style.overflow = "unset";
    document.body.classList.remove("disable-scanlines");

    return () => {
      // No cleanup needed for home page
    };
  }, []);

  // Terminal visibility state
  const [isStatsTerminalVisible, setIsStatsTerminalVisible] = useState(true);
  const [isIdentityTerminalVisible, setIsIdentityTerminalVisible] =
    useState(true);
  const [isBioTerminalVisible, setIsBioTerminalVisible] = useState(true);
  const [isBlogTerminalVisible, setIsBlogTerminalVisible] = useState(true);

  // Terminal animation state
  const [isStatsClosing, setIsStatsClosing] = useState(false);
  const [isIdentityClosing, setIsIdentityClosing] = useState(false);
  const [isBioClosing, setIsBioClosing] = useState(false);
  const [isBlogClosing, setIsBlogClosing] = useState(false);

  // Data state
  const [statsData, setStatsData] = useState(INITIAL_STATS_DATA);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch GitHub data on component mount
  useEffect(() => {
    const loadGitHubData = async () => {
      try {
        const [githubData, blueskyProfile] = await Promise.all([
          fetchGitHubData("alyraffauf"),
          fetchBlueskyProfile("aly.ruffruff.party"),
        ]);

        setStatsData((prev) =>
          prev.map((item) => {
            if (item.key === "stargazers") {
              return { ...item, value: githubData.stars };
            }
            if (item.key === "repos") {
              return { ...item, value: githubData.repoCount };
            }
            if (item.key === "followers") {
              return { ...item, value: blueskyProfile.followers };
            }
            if (item.key === "posts") {
              return { ...item, value: blueskyProfile.posts };
            }
            return item;
          }),
        );
      } catch (error) {
        setStatsData((prev) =>
          prev.map((item) => {
            if (item.key === "stargazers") {
              return { ...item, value: "Error loading" };
            }
            if (item.key === "repos") {
              return { ...item, value: "Error loading" };
            }
            if (item.key === "followers") {
              return { ...item, value: "Error loading" };
            }
            if (item.key === "posts") {
              return { ...item, value: "Error loading" };
            }
            return item;
          }),
        );
      }
    };

    loadGitHubData();
  }, []);

  // Load blog posts
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      const posts = await loadBlogPosts();
      setBlogPosts(posts);
      setIsLoading(false);

      // Restore scroll position after content has loaded
      // This ensures accuracy when returning from blog pages
      requestAnimationFrame(() => {
        setTimeout(() => {
          restoreScrollPosition();
        }, 100); // Small delay to ensure DOM is updated
      });
    };

    loadPosts();
  }, [restoreScrollPosition]);

  // Terminal close handlers
  const handleCloseStats = () =>
    handleTerminalClose(
      setIsStatsClosing,
      setIsStatsTerminalVisible,
      TERMINAL_ANIMATION_DELAY,
    );
  const handleCloseIdentity = () =>
    handleTerminalClose(
      setIsIdentityClosing,
      setIsIdentityTerminalVisible,
      TERMINAL_ANIMATION_DELAY,
    );
  const handleCloseBio = () =>
    handleTerminalClose(
      setIsBioClosing,
      setIsBioTerminalVisible,
      TERMINAL_ANIMATION_DELAY,
    );
  const handleCloseBlogTerminal = () =>
    handleTerminalClose(
      setIsBlogClosing,
      setIsBlogTerminalVisible,
      TERMINAL_ANIMATION_DELAY,
    );

  // Navigation handlers
  const handleMoreClick = () => {
    saveScrollPosition();
    navigate("/blog");
  };

  // Blog post handlers
  const handlePostClick = (post: BlogPost) => {
    saveScrollPosition();
    navigate(`/blog/${post.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent, post: BlogPost) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePostClick(post);
    }
  };

  // Render terminal header with controls
  const renderTerminalHeader = (
    title: string,
    onClose: () => void,
    ariaLabel: string,
  ) => (
    <div className="terminal-header">
      <div className="terminal-controls">
        <span
          className="terminal-control close"
          onClick={onClose}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => handleEnterKeyPress(e, onClose)}
          aria-label={ariaLabel}
        ></span>
        <span className="terminal-control minimize"></span>
        <span className="terminal-control maximize"></span>
      </div>
      <span className="terminal-title">{title}</span>
    </div>
  );

  // Render stats terminal content with syntax highlighting
  const renderStatsTerminal = () => {
    const nixCode = `{
${statsData
  .map((item) => {
    const value =
      typeof item.value === "number" ? item.value : `"${item.value}"`;
    return `  ${item.key} = ${value};`;
  })
  .join("\n")}
}`;

    return (
      <div className="terminal-body">
        <div className="prompt-line mb-4">
          <span className="prompt text-primary">aly@raffauf:~$</span>
          <span className="command text-secondary"> cat stats.nix</span>
        </div>
        <div
          className="output"
          dangerouslySetInnerHTML={{
            __html: highlightCode(nixCode, "nix"),
          }}
        />
      </div>
    );
  };

  // Render identity terminal content with syntax highlighting
  const renderIdentityTerminal = () => {
    const nixCode = `{
${IDENTITY_DATA.map((item) => {
  return `  ${item.key} = "${item.value}";`;
}).join("\n")}
}`;

    return (
      <div className="terminal-body">
        <div className="prompt-line mb-4">
          <span className="prompt text-primary">aly@raffauf:~$</span>
          <span className="command text-secondary"> cat attrs.nix</span>
        </div>
        <div
          className="output"
          dangerouslySetInnerHTML={{
            __html: highlightCode(nixCode, "nix"),
          }}
        />
      </div>
    );
  };

  // Render bio terminal content
  const renderBioTerminal = () => {
    return (
      <div className="terminal-body">
        <div className="prompt-line mb-4">
          <span className="prompt text-primary">aly@raffauf:~$</span>
          <span className="command text-secondary"> cat bio.txt</span>
        </div>
        <div
          className="output"
          dangerouslySetInnerHTML={{
            __html: highlightCode(BIO_TEXT, ""),
          }}
        />
      </div>
    );
  };

  // Render blog terminal header
  const renderBlogTerminalHeader = () => (
    <div className="terminal-header">
      <div className="terminal-controls">
        <span
          className="terminal-control close"
          onClick={handleCloseBlogTerminal}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => handleEnterKeyPress(e, handleCloseBlogTerminal)}
          aria-label="Close blog terminal"
        />
        <span className="terminal-control minimize" />
        <span className="terminal-control maximize" />
      </div>
      <span
        className="terminal-title"
        style={{ color: "var(--text-secondary)" }}
      >
        ~/blog
      </span>
    </div>
  );

  // Render blog terminal prompt
  const renderBlogPrompt = () => (
    <div className="terminal-prompt mb-4">
      <span
        className="prompt"
        style={{
          color: "var(--neon-pink)",
          textShadow: "0 0 10px var(--neon-pink)",
        }}
      >
        aly@raffauf:~/blog$
      </span>
      <span
        className="command"
        style={{
          color: "var(--cyber-blue)",
          textShadow: "0 0 5px var(--cyber-blue)",
        }}
      >
        {" "}
        ls -la *.md
      </span>
    </div>
  );

  // Render blog list content
  const renderBlogList = () => {
    if (isLoading) {
      return (
        <div className="loading-state">
          <span className="comment-prefix"># </span>
          Loading blog posts...
        </div>
      );
    }

    if (blogPosts.length === 0) {
      return (
        <div className="empty-state">
          <span className="comment-prefix"># </span>
          No blog posts found
        </div>
      );
    }

    const previewPosts = blogPosts.slice(0, PREVIEW_POST_COUNT);

    return (
      <div className="directory-listing">
        <div className="listing-header font-mono text-xs text-muted mb-2">
          -rw-r--r-- permissions owner group size date name
        </div>
        {previewPosts.map((post) => (
          <div key={post.id} className="post-item">
            <BlogPostItem
              post={post}
              onPostClick={handlePostClick}
              onKeyDown={handleKeyDown}
            />
          </div>
        ))}
        {blogPosts.length > PREVIEW_POST_COUNT && (
          <div className="more-posts-container">
            <button
              className="more-posts-btn"
              onClick={handleMoreClick}
              onKeyDown={(e) => handleEnterKeyPress(e, handleMoreClick)}
              aria-label="View all blog posts"
            >
              <span className="more-text">more...</span>
              <span className="more-count">
                ({blogPosts.length - PREVIEW_POST_COUNT} more)
              </span>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <section id="home" className="hero section min-h-screen">
        <div className="hero-content">
          <div className="hero-layout">
            {/* Left side - Main content and identity terminal */}
            <div className="hero-left">
              <h1 className="hero-title heading-1 font-cyber text-glow mb-6">
                ALY RAFFAUF
              </h1>

              <div className="hero-subtitle text-lg mb-8">
                <span className="font-mono text-secondary">{INTRO_TEXT}</span>
              </div>

              {/* Action buttons */}
              <div className="hero-actions flex gap-4 mb-8">
                <a
                  href="https://github.com/alyraffauf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  GitHub
                </a>
                <a href="mailto:aly@aly.codes" className="btn btn-secondary">
                  Email
                </a>
              </div>

              {/* Identity Terminal */}
              {isIdentityTerminalVisible && (
                <div
                  className={`terminal-window ${
                    isIdentityClosing ? "terminal-fade-out" : ""
                  }`}
                >
                  {renderTerminalHeader(
                    "~",
                    handleCloseIdentity,
                    "Close identity terminal",
                  )}
                  {renderIdentityTerminal()}
                </div>
              )}
            </div>

            {/* Right side - Stats and bio terminals */}
            <div className="hero-right hero-right-offset">
              {/* Stats Terminal */}
              {isStatsTerminalVisible && (
                <div
                  className={`terminal-window stats-terminal mb-8 ${
                    isStatsClosing ? "terminal-fade-out" : ""
                  }`}
                >
                  {renderTerminalHeader(
                    "~",
                    handleCloseStats,
                    "Close stats terminal",
                  )}
                  {renderStatsTerminal()}
                </div>
              )}

              {/* Bio Terminal */}
              {isBioTerminalVisible && (
                <div
                  className={`terminal-window bio-terminal ${
                    isBioClosing ? "terminal-fade-out" : ""
                  }`}
                >
                  {renderTerminalHeader(
                    "~",
                    handleCloseBio,
                    "Close bio terminal",
                  )}
                  {renderBioTerminal()}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Blog section without section header */}
      <section
        id="blog"
        className="section"
        role="main"
        aria-labelledby="blog-title"
      >
        <div className="container">
          {isBlogTerminalVisible && (
            <div
              className={`terminal-window blog-terminal ${
                isBlogClosing ? "terminal-fade-out" : ""
              }`}
            >
              {renderBlogTerminalHeader()}
              <div className="terminal-body">
                {renderBlogPrompt()}
                {renderBlogList()}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default React.memo(Home);
