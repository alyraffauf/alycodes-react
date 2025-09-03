import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadBlogPosts, BlogPost } from "../utils/blogUtils";
import useScrollRestoration from "../hooks/useScrollRestoration";
import BlogPostItem from "./BlogPostItem";
import "./Blog.css";
import "./BlogList.css";

const BlogList: React.FC = () => {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load blog posts on mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const posts = await loadBlogPosts();
        setBlogPosts(posts);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load blog posts",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Disable body scroll and scanlines when component mounts
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const scanlines = document.querySelector("body::before") as HTMLElement;
    if (scanlines) {
      scanlines.style.display = "none";
    }
    // Alternative: add class to body to disable scanlines via CSS
    document.body.classList.add("disable-scanlines");

    return () => {
      document.body.style.overflow = "unset";
      document.body.classList.remove("disable-scanlines");
    };
  }, []);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClose = () => {
    navigate("/");
  };

  const handlePostClick = (post: BlogPost) => {
    navigate(`/blog/${post.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent, post: BlogPost) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePostClick(post);
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent): void => {
    // Only close if clicking on the background, not the terminal window
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="loading-text loading-state">
          <span className="comment-prefix"># </span>
          Loading blog posts...
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-text error-state">
          <span className="comment-prefix"># </span>
          Error: {error}
        </div>
      );
    }

    if (blogPosts.length === 0) {
      return (
        <div className="loading-text loading-state">
          <span className="comment-prefix"># </span>
          No blog posts found
        </div>
      );
    }

    return (
      <div className="directory-listing">
        <div className="listing-header">
          -rw-r--r-- permissions owner group size date name
        </div>
        {blogPosts.map((post) => (
          <BlogPostItem
            key={post.id}
            post={post}
            onPostClick={handlePostClick}
            onKeyDown={handleKeyDown}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className="blog-list-page full-page-terminal"
      onClick={handleBackgroundClick}
    >
      <div className="container" onClick={(e) => e.stopPropagation()}>
        <div className="terminal-window" onClick={(e) => e.stopPropagation()}>
          <div className="terminal-header">
            <div className="terminal-controls">
              <span
                className="terminal-control close"
                onClick={handleClose}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleClose()}
                aria-label="Close and return home"
              />
              <span className="terminal-control minimize" />
              <span className="terminal-control maximize" />
            </div>
            <span className="terminal-title">
              ~/blog - All Posts ({blogPosts.length})
            </span>
          </div>
          <div className="terminal-body">
            <div className="post-header content-header">
              <div className="file-info">
                <span className="prompt text-primary">aly@raffauf:~/blog$</span>
                <span className="command text-secondary"> ls -la</span>
              </div>
            </div>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
