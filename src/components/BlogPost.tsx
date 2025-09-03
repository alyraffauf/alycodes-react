import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  parseMarkdownWithFrontmatter,
  formatFileSize,
  formatBlogDate,
} from "../utils/helpers";
import { renderMarkdownWithSyntaxHighlighting } from "../utils/syntaxHighlighter";
import "./BlogPost.css";

interface BlogPost {
  id: string;
  title: string;
  date: string;
  tags: string[];
  description: string;
  slug: string;
  content: string;
  size: string;
  lastModified: string;
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) {
        setError("No blog post specified");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Extract filename from date-based slug (e.g. "2024-01-15-cyberpunk-ui-react" -> "cyberpunk-ui-react")
        const filename = slug.replace(/^\d{4}-\d{2}-\d{2}-/, "");
        const response = await fetch(`/blog/${filename}.md`);

        if (!response.ok) {
          throw new Error("Blog post not found");
        }

        const content = await response.text();
        const { frontmatter, content: body } =
          parseMarkdownWithFrontmatter(content);

        setPost({
          id: slug,
          title: frontmatter.title,
          date: frontmatter.date,
          tags: frontmatter.tags || [],
          description: frontmatter.description || "",
          slug: slug,
          content: body,
          size: formatFileSize(content),
          lastModified: frontmatter.date + "T10:00:00Z",
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load blog post",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [slug]);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClose = () => {
    // Navigate back to home
    navigate("/", { replace: true });
  };

  const handleBackgroundClick = (e: React.MouseEvent): void => {
    // Only close if clicking on the background, not the terminal window
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const renderPostMeta = () => {
    if (!post) return null;

    return (
      <div className="post-meta content-meta">
        <div className="meta-line">
          <span className="meta-label">Date:</span>
          <span className="meta-value">{formatBlogDate(post.date)}</span>
        </div>
        <div className="meta-line">
          <span className="meta-label">Size:</span>
          <span className="meta-value">{post.size}</span>
        </div>
        <div className="meta-line">
          <span className="meta-label">Tags:</span>
          <span className="meta-value">[{post.tags.join(", ")}]</span>
        </div>
      </div>
    );
  };

  const renderMarkdownContent = (content: string) => {
    return renderMarkdownWithSyntaxHighlighting(content);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
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
              ></span>
              <span className="terminal-control minimize"></span>
              <span className="terminal-control maximize"></span>
            </div>
            <span className="terminal-title">Loading...</span>
          </div>
          <div className="terminal-body">
            <div className="loading-text loading-state">
              <span className="comment-prefix"># </span>
              Loading blog post...
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
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
              ></span>
              <span className="terminal-control minimize"></span>
              <span className="terminal-control maximize"></span>
            </div>
            <span className="terminal-title">Error</span>
          </div>
          <div className="terminal-body">
            <div className="error-text error-state">
              <span className="comment-prefix"># </span>
              {error}
            </div>
          </div>
        </div>
      );
    }

    if (!post) return null;

    return (
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
            ></span>
            <span className="terminal-control minimize"></span>
            <span className="terminal-control maximize"></span>
          </div>
          <span className="terminal-title">{post.title}</span>
        </div>
        <div className="terminal-body">
          <div className="post-header content-header">
            <div className="file-info">
              <span className="prompt text-primary">aly@raffauf:~/blog$</span>
              <span className="command text-secondary">
                {" "}
                cat {post.slug.replace(/^\d{4}-\d{2}-\d{2}-/, "")}.md
              </span>
            </div>
            {renderPostMeta()}
          </div>

          <div
            className="post-body"
            dangerouslySetInnerHTML={{
              __html: renderMarkdownContent(post.content),
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      className="blog-post-page full-page-terminal"
      onClick={handleBackgroundClick}
    >
      <div className="container" onClick={(e) => e.stopPropagation()}>
        {renderContent()}
      </div>
    </div>
  );
};

export default BlogPost;
