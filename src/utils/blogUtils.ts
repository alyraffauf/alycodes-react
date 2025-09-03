import { parseMarkdownWithFrontmatter, formatFileSize } from "./helpers";

export interface BlogPost {
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

export const loadBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const indexResponse = await fetch("/blog/index.json");
    if (!indexResponse.ok) throw new Error("Failed to load blog index");

    const blogIndex = await indexResponse.json();

    const postPromises = blogIndex.map(
      async ({ filename }: { filename: string }) => {
        try {
          const response = await fetch(`/blog/${filename}`);
          if (!response.ok) return null;

          const content = await response.text();
          const { frontmatter, content: body } =
            parseMarkdownWithFrontmatter(content);
          const baseSlug = filename.replace(".md", "");
          const dateSlug = `${frontmatter.date}-${baseSlug}`;

          return {
            id: dateSlug,
            title: frontmatter.title,
            date: frontmatter.date,
            tags: frontmatter.tags || [],
            description: frontmatter.description || "",
            slug: dateSlug,
            content: body,
            size: formatFileSize(content),
            lastModified: frontmatter.date + "T10:00:00Z",
          };
        } catch (error) {
          console.error(`Error loading ${filename}:`, error);
          return null;
        }
      },
    );

    const postResults = await Promise.all(postPromises);
    const posts = postResults.filter((post): post is BlogPost => post !== null);

    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  } catch (error) {
    console.error("Error loading blog posts:", error);
    return [];
  }
};
