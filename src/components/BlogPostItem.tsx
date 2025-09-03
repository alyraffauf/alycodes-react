import React from "react";
import { BlogPost } from "../utils/blogUtils";

interface BlogPostItemProps {
  post: BlogPost;
  onPostClick: (post: BlogPost) => void;
  onKeyDown: (e: React.KeyboardEvent, post: BlogPost) => void;
}

const BlogPostItem: React.FC<BlogPostItemProps> = ({
  post,
  onPostClick,
  onKeyDown,
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const formatPermissions = () => "-rw-r--r--";
  const formatOwner = () => "aly";
  const formatGroup = () => "staff";

  return (
    <div
      className="directory-entry"
      onClick={() => onPostClick(post)}
      onKeyDown={(e) => onKeyDown(e, post)}
      role="button"
      tabIndex={0}
      aria-label={`Read blog post: ${post.title}`}
    >
      <span className="permissions text-muted">{formatPermissions()}</span>
      <span className="owner text-muted">{formatOwner()}</span>
      <span className="group text-muted">{formatGroup()}</span>
      <span className="size text-muted">{post.size}</span>
      <span className="date text-muted">{formatDate(post.lastModified)}</span>
      <span className="post-name">
        {post.slug.replace(/^\d{4}-\d{2}-\d{2}-/, "")}.md
      </span>
    </div>
  );
};

export default BlogPostItem;
