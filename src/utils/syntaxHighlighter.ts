import Prism from "prismjs";

// Import core languages
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-shell-session";
import "prismjs/components/prism-nix";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-toml";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-python";
import "prismjs/components/prism-go";
import "prismjs/components/prism-docker";
import "prismjs/components/prism-nginx";
import "prismjs/components/prism-sql";

// Import custom cyberpunk-themed CSS
import "../styles/prism-cyberpunk.css";

// Language aliases for common variations
const LANGUAGE_ALIASES: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  fish: "bash",
  nixos: "nix",
  yml: "yaml",
  py: "python",
  rs: "rust",
  dockerfile: "docker",
  conf: "nginx",
  config: "nginx",
};

/**
 * Highlights code using Prism.js
 * @param code - The code string to highlight
 * @param language - The language identifier
 * @returns HTML string with syntax highlighting
 */
export function highlightCode(code: string, language: string = ""): string {
  // Clean up the code but preserve meaningful whitespace
  let cleanCode = code.replace(/\r\n/g, "\n");

  // Remove only leading/trailing newlines, preserve other whitespace
  cleanCode = cleanCode.replace(/^\n+/, "").replace(/\n+$/, "");

  // Ensure we have actual content
  if (!cleanCode.trim()) {
    return `<pre class="language-none"><code></code></pre>`;
  }

  if (!language) {
    // If no language specified, return code in a basic pre/code block
    return `<pre class="language-none"><code>${escapeHtml(cleanCode)}</code></pre>`;
  }

  // Normalize language identifier
  const normalizedLang = language.toLowerCase().trim();
  const prismLang = LANGUAGE_ALIASES[normalizedLang] || normalizedLang;

  // Check if the language is supported by Prism
  if (!Prism.languages[prismLang]) {
    console.warn(
      `Language '${language}' not supported by Prism.js, falling back to plain text`,
    );
    return `<pre class="language-none"><code>${escapeHtml(cleanCode)}</code></pre>`;
  }

  try {
    // Highlight the code
    const highlightedCode = Prism.highlight(
      cleanCode,
      Prism.languages[prismLang],
      prismLang,
    );
    return `<pre class="language-${prismLang}"><code class="language-${prismLang}">${highlightedCode}</code></pre>`;
  } catch (error) {
    console.error(
      `Error highlighting code with language '${language}':`,
      error,
    );
    // Fallback to plain text if highlighting fails
    return `<pre class="language-none"><code>${escapeHtml(cleanCode)}</code></pre>`;
  }
}

/**
 * Enhanced markdown renderer with syntax highlighting
 * @param content - The markdown content to render
 * @returns HTML string with syntax highlighting applied
 */
export function renderMarkdownWithSyntaxHighlighting(content: string): string {
  // Normalize line endings
  let html = content.replace(/\r\n/g, "\n");

  // First pass: Extract and replace code blocks with placeholders
  const codeBlocks: string[] = [];
  const codeBlockPlaceholder = "___CODE_BLOCK_";

  // Handle fenced code blocks with better boundary detection
  html = html.replace(
    /```([a-zA-Z0-9]*)\n?([\s\S]*?)\n?```/g,
    (match, language, code) => {
      // Clean up the code content
      const cleanedCode = code.replace(/^\n+/, "").replace(/\n+$/, "");
      const highlightedCode = highlightCode(cleanedCode, language);
      const placeholder = `${codeBlockPlaceholder}${codeBlocks.length}___`;
      codeBlocks.push(highlightedCode);
      return placeholder;
    },
  );

  // Process line by line to avoid conflicts
  const lines = html.split("\n");
  const processedLines: string[] = [];

  for (const line of lines) {
    // Don't process lines with code block placeholders
    if (line.includes(codeBlockPlaceholder)) {
      processedLines.push(line);
      continue;
    }

    let processedLine = line;

    // Headers
    if (processedLine.match(/^### /)) {
      processedLine = processedLine.replace(/^### (.+)$/, "<h3>$1</h3>");
    } else if (processedLine.match(/^## /)) {
      processedLine = processedLine.replace(/^## (.+)$/, "<h2>$1</h2>");
    } else if (processedLine.match(/^# /)) {
      processedLine = processedLine.replace(/^# (.+)$/, "<h1>$1</h1>");
    } else {
      // Inline formatting for non-header lines
      // Inline code - avoid conflicts with code blocks
      processedLine = processedLine.replace(
        /`([^`\n]+?)`/g,
        '<code class="inline-code">$1</code>',
      );
      // Bold
      processedLine = processedLine.replace(
        /\*\*([^*\n]+?)\*\*/g,
        "<strong>$1</strong>",
      );
      // Italic
      processedLine = processedLine.replace(/\*([^*\n]+?)\*/g, "<em>$1</em>");
      // Links
      processedLine = processedLine.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
      );
    }

    processedLines.push(processedLine);
  }

  // Rejoin and handle paragraphs
  html = processedLines.join("\n");

  // Split into blocks by double newlines
  const blocks = html.split(/\n\s*\n/);
  const processedBlocks = blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";

      // Don't wrap certain elements in paragraphs
      if (
        trimmed.includes(codeBlockPlaceholder) ||
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<pre") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<ol")
      ) {
        return trimmed;
      }

      // Convert single newlines within blocks to <br>
      const withBreaks = trimmed.replace(/\n/g, "<br>");
      return `<p>${withBreaks}</p>`;
    })
    .filter(Boolean);

  html = processedBlocks.join("\n\n");

  // Restore code blocks
  codeBlocks.forEach((codeBlock, index) => {
    const placeholder = `${codeBlockPlaceholder}${index}___`;
    html = html.replace(placeholder, codeBlock);
  });

  return html;
}

/**
 * Escapes HTML characters in a string
 * @param text - The text to escape
 * @returns Escaped HTML string
 */
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Gets a list of all supported languages
 * @returns Array of supported language identifiers
 */
export function getSupportedLanguages(): string[] {
  return Object.keys(Prism.languages).filter(
    (lang) => lang !== "extend" && lang !== "insertBefore" && lang !== "DFS",
  );
}

/**
 * Checks if a language is supported
 * @param language - The language identifier to check
 * @returns Whether the language is supported
 */
export function isLanguageSupported(language: string): boolean {
  const normalizedLang = language.toLowerCase();
  const prismLang = LANGUAGE_ALIASES[normalizedLang] || normalizedLang;
  return !!Prism.languages[prismLang];
}
